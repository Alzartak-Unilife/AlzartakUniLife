import axios from "axios";
import { Course, CourseObject, Day, Schedule, Time } from "../types/Course";
import { IGeneratorConfig } from "../types/IGeneratorConfig";




/*****************************************************************
 * API URL을 구성하고 반환하는 메서드입니다.
 *****************************************************************/

/**
 * getApiUrl 메서드는 기본 URL에 API 경로를 추가하여 완성된 API URL을 반환합니다.
 * @param path API 경로입니다.
 * @returns {string} 구성된 API URL을 반환합니다.
 */
function getApiUrl(path: string): string {
    //const apiUrl = `http://3.37.210.242:8080${path}`;
    const apiUrl = `http://localhost:3000${path}`;
    const now = new Date();
    const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}:${now.getMilliseconds().toString().padStart(3, '0')}`;
    console.log(`[${formattedTime}] request: ${apiUrl}`);
    return apiUrl;
}




/*****************************************************************
 * Axios 요청에 사용될 기본 타임아웃 값을 반환하는 메서드입니다.
 *****************************************************************/

/**
 * `getDefualtAxiosTimeout` 메서드는 Axios HTTP 요청의 기본 타임아웃 값을 설정합니다.
 * 현재 이 메서드는 10초(10000 밀리초)로 타임아웃을 설정하여 반환합니다.
 * 이 값을 사용하여 Axios 요청 시 기본적으로 설정할 타임아웃 값을 지정할 수 있습니다.
 *
 * @returns {number} 기본 타임아웃 값인 10000(10초)을 반환합니다.
 */
function getDefualtAxiosTimeout(): number {
    return 15000;
}




/*****************************************************************
 * 조건에 맞는 개설 강좌 목록을 가져오는 API 메서드입니다.
*****************************************************************/

/** 개설 강좌 응답 데이터 타입 */
type GetOfferedCoursesResponse = {
    data: CourseObject[];
    message: "SUCCESS" | "FAIL";
};

/**
 * 서버에서 특정 조건에 맞는 개설 강좌 목록을 가져옵니다.
 * @param {Object} param - 개설 강좌 검색에 사용되는 매개 변수들입니다.
 * @returns {Promise<Course[]>} Course 객체 배열을 반환합니다.
 * 요청이 실패하면 빈 배열을 반환합니다.
*/
export async function getOfferedCourses(param: {
    year: number;
    semester: number;
    curriculum: string;
    offeringCollege: string;
    offeringDepartment: string;
    baseCode: string;
    courseName: string;
    lectureCategory: string;
    professor: string;
    lectureLanguage: string;
}
): Promise<{
    data: Course[];
    message: "SUCCESS" | "FAIL";
}> {
    let responseData: GetOfferedCoursesResponse = { data: [], message: "FAIL" };
    try {
        const postData = param;
        const response = await axios.post(
            getApiUrl(`/api/course/get`),
            postData,
            {
                timeout: getDefualtAxiosTimeout(),
                headers: {
                    "Content-Type": "application/json"
                },
            }
        );
        responseData = response.data;
    } catch (error) {
        return {
            data: [],
            message: "FAIL"
        }
    }

    return {
        data: responseData.data.map((courseObject) => Course.fromObject(courseObject)),
        message: responseData.message
    }
}




/** 개설 강좌 응답 데이터 타입 */
type GenerateTimetablesResponse = {
    data: CourseObject[][];
    message: "SUCCESS" | "FAIL";
};


export async function generateTimetables(param: IGeneratorConfig): Promise<{
    data: Course[][];
    message: "SUCCESS" | "FAIL";
}> {
    let responseData: GenerateTimetablesResponse = { data: [], message: "FAIL" };
    try {
        const postData = param;
        const response = await axios.post(
            getApiUrl(`/api/timetable/auto/generate`),
            postData,
            {
                timeout: getDefualtAxiosTimeout(),
                headers: {
                    "Content-Type": "application/json"
                },
            }
        );
        responseData = response.data;
    } catch (error) {
        return {
            data: [],
            message: "FAIL"
        }
    }
    return {
        data: responseData.data.map((courseObjects) => courseObjects.map((courseObject) => Course.fromObject(courseObject))),
        message: responseData.message
    }
}





/*
type GetProfessorEvaluationsResponse = {
    year: number;
    semester: number;
    score:
}

[
    {
        year: 2023,
        semester: 1,
        score: 3.89
    }
]


export async function getProfessorEvaluations(param: {
    baseCode: string;
    professor: string;
}
): Promise<Course[]> {
    let responseData: GetOfferedCoursesResponse = [];
    try {
        const postData = param;
        const response = await axios.post(
            getApiUrl(`/evaluate`),
            postData,
            {
                headers: {
                    "Content-Type": "application/json"
                },
            }
        );
        console.log(response.data)
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
*/