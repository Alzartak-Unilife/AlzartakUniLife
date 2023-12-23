import axios from "axios";
import { Course, Day, Schedule, Time } from "../types/Course";




/*****************************************************************
 * API URL을 구성하고 반환하는 메서드입니다.
 *****************************************************************/

/**
 * getApiUrl 메서드는 기본 URL에 API 경로를 추가하여 완성된 API URL을 반환합니다.
 * @param path API 경로입니다.
 * @returns {string} 구성된 API URL을 반환합니다.
 */
function getApiUrl(path: string): string {
    const apiUrl = `http://3.37.210.242:8080${path}`;
    const now = new Date();
    const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}:${now.getMilliseconds().toString().padStart(3, '0')}`;
    console.log(`[${formattedTime}] request: ${apiUrl}`);
    return apiUrl;
}




/*****************************************************************
 * 조건에 맞는 개설 강좌 목록을 가져오는 API 메서드입니다.
*****************************************************************/

/** 개설 강좌 응답 데이터 타입 */
type GetOfferedCoursesResponse = {
    courseId: number;
    year: number;
    semester: number;
    grades: number[];
    curriculum: string;
    courseArea: string;
    baseCode: string;
    divCode: string;
    courseName: string;
    professor: string;
    campus: string;
    schedules: {
        day: string;
        time: {
            begin: number;
            end: number;
        };
        room: string;
    }[];
    credit: number;
    theory: number;
    practice: number;
    lectureType: string;
    lectureCategory: string;
    lectureLanguage: string;
    requirementType: string;
    offeringCollege: string;
    offeringDepartment: string;
    remarks: string;
    avgEvaluation?: number;
}[];

/**
 * 서버에서 특정 조건에 맞는 개설 강좌 목록을 가져옵니다.
 * @param {Object} param - 개설 강좌 검색에 사용되는 매개 변수들입니다.
 * @returns {Promise<Course[]>} Course 객체 배열을 반환합니다.
 * 요청이 실패하면 빈 배열을 반환합니다.
*/
export async function getOfferedCourses(param: {
    year: number;
    semester: number;
    curriculum?: string;
    offeringCollege?: string;
    offeringDepartment?: string;
    baseCode?: string;
    courseName?: string;
    lectureCategory?: string;
    professor?: string;
    lectureLanguage?: string;
}
): Promise<Course[]> {
    let responseData: GetOfferedCoursesResponse = [];
    try {
        const postData = param;
        const response = await axios.post(
            getApiUrl(`/search`),
            postData,
            {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            }
        );
        responseData = response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            responseData = error.response.data;
        }
    }

    return responseData.map(data => new Course(
        data.grades,
        data.curriculum,
        data.courseArea,
        data.baseCode,
        data.divCode,
        data.courseName,
        data.professor,
        data.campus,
        data.schedules.map(schedule => new Schedule(
            schedule.day as Day,
            new Time(schedule.time.begin, schedule.time.end),
            schedule.room
        )),
        data.credit,
        data.theory,
        data.practice,
        data.lectureType,
        data.lectureCategory,
        data.lectureLanguage,
        data.requirementType,
        data.offeringCollege,
        data.offeringDepartment,
        data.remarks,
        data.avgEvaluation ?? 0
    ));
}
