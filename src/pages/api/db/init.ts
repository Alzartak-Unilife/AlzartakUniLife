import MongoDbProvider from '@/core/modules/database/MongoDbProvider';
import { NextApiRequest, NextApiResponse } from 'next';
import coursesJson from "../../data/courses.json";
import evaluationsJson from "../../data/evaluation.json";
import { Course, CourseObject, Day, Schedule, Time } from '@/core/types/Course';
import { JCourse } from '@/core/types/JCourse';
import { JEvaluation } from '@/core/types/JEvaluation';


function removeNewlines(oringStr: string | undefined): string | undefined {
    return oringStr !== undefined ? oringStr.replace(/\n+$/, '') : undefined;
}


function parseStr(oringStr: string | undefined): string {
    return oringStr !== undefined ? oringStr : "";
}


function praseNum(oringStr: string | undefined): number {
    return oringStr !== undefined ? parseInt(oringStr) : 0;
}


function parseGrades(gradeStr: string | undefined): number[] {
    if (gradeStr === undefined) return [];
    if (gradeStr === "전체학년") return [1, 2, 3, 4, 5, 6];
    if (!gradeStr.includes("-")) return gradeStr.split(',').map(part => parseInt(part.match(/\d+/)![0]));
    const match = gradeStr.match(/(\d+)-(\d+)/);
    const range = [];
    if (match) {
        const start = parseInt(match[1]);
        const end = parseInt(match[2]);
        for (let i = start; i <= end; i++) { range.push(i); }
    }
    return range;
}


function parseCourseCode(courseCodeStr: string | undefined): {
    baseCode: string;
    divCode: string;
} {
    if (courseCodeStr === undefined) return { baseCode: "", divCode: "" };
    let courseCode = courseCodeStr.split('-');
    return { baseCode: courseCode[0], divCode: courseCode[1] };
}


function parseSchedule(scheduleStr: string | undefined, roomStr: string | undefined): Schedule[] {
    if (scheduleStr === undefined) return [];

    const daysOfWeek: {
        [key: string]: Day;
    } = {
        "월": "Mon",
        "화": "Tue",
        "수": "Wed",
        "목": "Thu",
        "금": "Fri",
        "토": "Sat",
        "일": "Sun"
    };

    const timeToMinutes = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const scheduleStrs = scheduleStr.split(',');
    const roomStrs = roomStr !== undefined ? roomStr.split(',') : undefined;

    return scheduleStrs.map((scheduleStr, index) => {
        const [day, timeRange] = scheduleStr.split('/');
        const [startTime, endTime] = timeRange.split('-').map(timeToMinutes);
        return new Schedule(
            daysOfWeek[day.trim()[0]],
            new Time(startTime, endTime),
            (roomStrs !== undefined && roomStrs[index] !== undefined) ? roomStrs[index] : ""
        )
    });
}


function parseDepartment(collegeStr: string, departmentStr: string) {
    return departmentStr.split(' ').filter((value) => value !== collegeStr).join(' ');
}


function createCourses(jcourses: JCourse[], jevaluations: JEvaluation): CourseObject[] {
    return jcourses.map((jcourse) => {
        const { baseCode, divCode } = parseCourseCode(removeNewlines(jcourse["학수강좌번호"]));
        const professor = parseStr(removeNewlines(jcourse["교원명"]));
        const evaluation = jevaluations[baseCode]?.[professor]?.avgEvaluation || 0;
        const college = parseStr(removeNewlines(jcourse["개설대학"]));

        return new Course(
            praseNum(removeNewlines(jcourse["강의년도"])),
            praseNum(removeNewlines(jcourse["강의학기"])),
            parseGrades(removeNewlines(jcourse["학년/가진급학년"])),
            parseStr(removeNewlines(jcourse["교과과정"])),
            parseStr(removeNewlines(jcourse["교과영역구분"])),
            baseCode,
            divCode,
            parseStr(removeNewlines(jcourse["교과목명"])),
            professor,
            parseStr(removeNewlines(jcourse["수업캠퍼스"])),
            parseSchedule(removeNewlines(jcourse["요일/시간"]), removeNewlines(jcourse["강의실"])),
            praseNum(removeNewlines(jcourse["학점"])),
            praseNum(removeNewlines(jcourse["이론"])),
            praseNum(removeNewlines(jcourse["실습"])),
            parseStr(removeNewlines(jcourse["강의유형"])),
            parseStr(removeNewlines(jcourse["강의종류"])),
            parseStr(removeNewlines(jcourse["원어강의"])),
            parseStr(removeNewlines(jcourse["이수구분"])),
            college,
            parseDepartment(college, parseStr(removeNewlines(jcourse["개설학과/전공"]))),
            parseStr(removeNewlines(jcourse["비고"])),
            evaluation,
        ).toObject();
    });
}


export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    const db = await MongoDbProvider.connectDb(process.env.ALZARTAK_MONGODB_URI).then(() => MongoDbProvider.getDb());
    const jcourses: JCourse[] = coursesJson as unknown as JCourse[];
    const jevaluations: JEvaluation = evaluationsJson as unknown as JEvaluation;
    const courseObjects = createCourses(jcourses, jevaluations);

    switch (request.method) {
        case "GET": {
            try {
                const resultClear = await db.collection('courses').deleteMany({});
                if (await db.collection('courses').countDocuments() === 0) {
                    try {
                        const result = await db.collection('courses').insertMany(courseObjects);
                        if (result.insertedCount === courseObjects.length) {
                            response.status(200).json({ message: "SUCCESS" });
                        } else {
                            response.status(500).json({ message: "FAIL" });
                        }
                    } catch (error) {
                        response.status(500).json({ message: "FAIL" });
                    }
                } else {
                    response.status(500).json({ message: "FAIL" });
                }
            } catch (error) {
                response.status(500).json({ message: "FAIL" });
            }
            break;
        }
        default: {
            response.status(400).json({ message: "FAIL" });
        }
    };
}