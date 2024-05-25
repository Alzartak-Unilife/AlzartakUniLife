import MongoDbProvider from '@/core/modules/database/MongoDbProvider';
import { NextApiRequest, NextApiResponse } from 'next';
import { CourseObject } from '@/core/types/Course';


type PostParam = {
    year: number;
    semester: number;
    curriculum: string;
    offeringCollege: string;
    offeringDepartment: string;
    lectureCategory: string;
    lectureLanguage: string;
    baseCode: string;
    courseName: string;
    professor: string;
}


export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    const db = await MongoDbProvider.getDb();

    switch (request.method) {
        case "POST": {
            const param = request.body as PostParam;
            try {
                const courses = await db.collection("courses").find({
                    $and: [
                        { year: param.year },
                        { semester: param.semester },
                        ...(param.curriculum ? [{ curriculum: param.curriculum }] : []),
                        ...(param.offeringCollege ? [{ offeringCollege: param.offeringCollege }] : []),
                        ...(param.offeringDepartment ? [{ offeringDepartment: { $regex: param.offeringDepartment, $options: 'i' } }] : []),
                        ...(param.lectureCategory ? [{ lectureCategory: param.lectureCategory }] : []),
                        ...(param.lectureLanguage ? [{ language: param.lectureLanguage }] : []),
                        ...(param.baseCode ? [{ baseCode: { $regex: param.baseCode, $options: 'i' } }] : []),
                        ...(param.courseName ? [{ name: { $regex: param.courseName, $options: 'i' } }] : []),
                        ...(param.professor ? [{ professor: { $regex: param.professor, $options: 'i' } }] : [])
                    ]
                }).toArray();
                const courseObjects: CourseObject[] = courses.map(course => {
                    return {
                        year: course.year,
                        semester: course.semester,
                        grades: course.grades,
                        curriculum: course.curriculum,
                        courseArea: course.courseArea,
                        baseCode: course.baseCode,
                        divCode: course.divCode,
                        name: course.name,
                        professor: course.professor,
                        campus: course.campus,
                        schedules: course.schedules,
                        credit: course.credit,
                        theory: course.theory,
                        practice: course.practice,
                        lectureType: course.lectureType,
                        lectureCategory: course.lectureCategory,
                        language: course.language,
                        requirementType: course.requirementType,
                        offeringCollege: course.offeringCollege,
                        offeringDepartment: course.offeringDepartment,
                        remarks: course.remarks,
                        evaluation: course.evaluation,
                        rating: course.rating
                    };
                });
                response.status(200).json({ data: courseObjects, message: "SUCCESS" });
            } catch (error) {
                response.status(500).json({ data: [], message: "FAIL" });
            }
            break;
        }
        default: {
            response.status(400).json({ data: [], message: "FAIL" });
        }
    };
}
