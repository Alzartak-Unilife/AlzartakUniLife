import axios from "axios";
import { Course, CourseObject } from "../types/Course";
import { GeneratorConfig, GeneratorConfigObject } from "../types/GeneratorConfig";
import { Timetable, TimetableObject } from "../types/Timetable";




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
    const apiUrl = `${path}`;
    const now = new Date();
    const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}:${now.getMilliseconds().toString().padStart(3, '0')}`;
    //console.log(`[${formattedTime}] request: ${apiUrl}`);
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
            getApiUrl(`/api/course/getCourseList`),
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




/*****************************************************************
 * 자동 시간표 생성기의 설정을 가져오는 API 메서드입니다.
*****************************************************************/

/** 자동 시간표 생성기 설정 응답 데이터 타입 */
type GetGeneratorConfigResponse = {
    data: GeneratorConfigObject | null;
    message: "SUCCESS" | "FAIL";
};

/**
 * 서버에서 자동 시간표 생성기의 설정을 가져옵니다.
 * @returns {Promise<GetGeneratorConfigResponse>} 
 * GeneratorConfigObject와 처리 결과 메시지를 포함하는 객체를 반환합니다.
 * 요청이 실패하면 null과 "FAIL" 메시지를 반환합니다.
 */
export async function getGeneratorConfig(): Promise<{
    data: GeneratorConfig | null;
    message: "SUCCESS" | "FAIL";
}> {
    let responseData: GetGeneratorConfigResponse = { data: null, message: "FAIL" };
    try {
        const response = await axios.get(
            getApiUrl(`/api/timetable/auto/configGenerator`),
            {
                timeout: getDefualtAxiosTimeout(),
            }
        );
        responseData = response.data;
    } catch (error) {
        return {
            data: null,
            message: "FAIL"
        }
    }
    return {
        data: responseData.data === null ? null : GeneratorConfig.fromObject(responseData.data),
        message: responseData.message
    };
}




/*****************************************************************
 * 자동 시간표 생성기의 설정을 서버에 저장하는 API 메서드입니다.
*****************************************************************/

/** 자동 시간표 생성기 설정 저장 응답 데이터 타입 */
type CreateGeneratorConfigResponse = {
    message: "SUCCESS" | "FAIL";
};

/**
 * 서버에 자동 시간표 생성기의 설정을 저장합니다.
 * @param {GeneratorConfig} param - 저장할 시간표 생성기 설정입니다.
 * @returns {Promise<CreateGeneratorConfigResponse>} 
 * 처리 결과 메시지를 포함하는 객체를 반환합니다.
 * 요청이 실패하면 "FAIL" 메시지를 반환합니다.
 */
export async function createGeneratorConfig(param: GeneratorConfig): Promise<{
    message: "SUCCESS" | "FAIL";
}> {
    let responseData: CreateGeneratorConfigResponse = { message: "FAIL" };
    try {
        const postData = param.toObject();
        const response = await axios.post(
            getApiUrl(`/api/timetable/auto/configGenerator`),
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
            message: "FAIL"
        }
    }
    return responseData;
}




/*****************************************************************
 * 자동 시간표 생성기의 설정을 서버에서 업데이트하는 API 메서드입니다.
*****************************************************************/

/** 자동 시간표 생성기 설정 업데이트 응답 데이터 타입 */
type UpdateGeneratorConfigResponse = {
    message: "SUCCESS" | "FAIL";
};

/**
 * 서버에서 자동 시간표 생성기의 설정을 업데이트합니다.
 * @param {GeneratorConfig} param - 업데이트할 시간표 생성기 설정입니다.
 * @returns {Promise<UpdateGeneratorConfigResponse>} 
 * 처리 결과 메시지를 포함하는 객체를 반환합니다.
 * 요청이 실패하면 "FAIL" 메시지를 반환합니다.
 */
export async function updateGeneratorConfig(param: GeneratorConfig): Promise<{
    message: "SUCCESS" | "FAIL";
}> {
    let responseData: UpdateGeneratorConfigResponse = { message: "FAIL" };
    try {
        const postData = param.toObject();
        const response = await axios.patch(
            getApiUrl(`/api/timetable/auto/configGenerator`),
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
            message: "FAIL"
        }
    }
    return responseData;
}




/*****************************************************************
 * 시간표 생성기 설정에 따라 가능한 시간표 조합들을 생성하는 API 메서드입니다.
*****************************************************************/

/** 시간표 생성 응답 데이터 타입 */
type GenerateTimetablesResponse = {
    data: CourseObject[][];
    message: "SUCCESS" | "FAIL";
};

/**
 * 서버에서 주어진 시간표 생성기 설정에 따라 가능한 시간표 조합들을 생성합니다.
 * @param {GeneratorConfigObject} param - 시간표 생성에 사용되는 매개 변수들입니다.
 * @returns {Promise<{data: Course[][], message: "SUCCESS" | "FAIL"}>} 
 * 생성된 시간표의 배열과 처리 결과 메시지를 포함하는 객체를 반환합니다.
 * 요청이 실패하면 빈 배열과 "FAIL" 메시지를 반환합니다.
*/
export async function generateTimetables(param: GeneratorConfigObject): Promise<{
    data: Course[][];
    message: "SUCCESS" | "FAIL";
}> {
    let responseData: GenerateTimetablesResponse = { data: [], message: "FAIL" };
    try {
        const postData = param;
        const response = await axios.post(
            getApiUrl(`/api/timetable/auto/generateTimetable`),
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




/*****************************************************************
 * 사용자 지정 시간표 설정을 가져오는 API 메서드입니다.
*****************************************************************/

/** 사용자 지정 시간표 설정 응답 데이터 타입 */
type GetMakerTimetableResponse = {
    data: TimetableObject | null;
    message: "SUCCESS" | "FAIL";
};

/**
 * 서버에서 사용자 지정 시간표 설정을 가져옵니다.
 * @returns {Promise<GetMakerTimetableResponse>} 
 * MakerConfigObject와 처리 결과 메시지를 포함하는 객체를 반환합니다.
 * 요청이 실패하면 null과 "FAIL" 메시지를 반환합니다.
 */
export async function getMakerTimetable(): Promise<{
    data: Timetable | null;
    message: "SUCCESS" | "FAIL";
}> {
    let responseData: GetMakerTimetableResponse = { data: null, message: "FAIL" };
    try {
        const response = await axios.get(
            getApiUrl(`/api/timetable/custom/configCustomize`),
            {
                timeout: getDefualtAxiosTimeout(),
            }
        );
        responseData = response.data;
    } catch (error) {
        return {
            data: null,
            message: "FAIL"
        }
    }
    return {
        data: responseData.data === null ? null : Timetable.fromObject(responseData.data),
        message: responseData.message
    };
}




/*****************************************************************
 * 사용자 지정 시간표 설정을 서버에 저장하는 API 메서드입니다.
*****************************************************************/

/** 사용자 지정 시간표 설정 저장 응답 데이터 타입 */
type CreateMakerTimetableResponse = {
    message: "SUCCESS" | "FAIL";
};

/**
 * 서버에 사용자 지정 시간표 설정을 저장합니다.
 * @param {MakerConfig} param - 저장할 사용자 지정 시간표 설정입니다.
 * @returns {Promise<CreateMakerTimetableResponse>} 
 * 처리 결과 메시지를 포함하는 객체를 반환합니다.
 * 요청이 실패하면 "FAIL" 메시지를 반환합니다.
 */
export async function createMakerTimetable(param: Timetable): Promise<{
    message: "SUCCESS" | "FAIL";
}> {
    let responseData: CreateMakerTimetableResponse = { message: "FAIL" };
    try {
        const postData = param.toObject();
        const response = await axios.post(
            getApiUrl(`/api/timetable/custom/configCustomize`),
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
            message: "FAIL"
        }
    }
    return responseData;
}




/*****************************************************************
 * 사용자 지정 시간표 설정을 서버에서 업데이트하는 API 메서드입니다.
*****************************************************************/

/** 사용자 지정 시간표 설정 업데이트 응답 데이터 타입 */
type UpdateMakerTimetableResponse = {
    message: "SUCCESS" | "FAIL";
};

/**
 * 서버에서 사용자 지정 시간표 설정을 업데이트합니다.
 * @param {MakerConfig} param - 업데이트할 사용자 지정 시간표 설정입니다.
 * @returns {Promise<UpdateMakerTimetableResponse>} 
 * 처리 결과 메시지를 포함하는 객체를 반환합니다.
 * 요청이 실패하면 "FAIL" 메시지를 반환합니다.
 */
export async function updateMakerTimetable(param: Timetable): Promise<{
    message: "SUCCESS" | "FAIL";
}> {
    let responseData: UpdateMakerTimetableResponse = { message: "FAIL" };
    try {
        const postData = param;
        const response = await axios.patch(
            getApiUrl(`/api/timetable/custom/configCustomize`),
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
            message: "FAIL"
        }
    }
    return responseData;
}





/*****************************************************************
 * 모든 시간표를 가져오는 API 메서드입니다.
*****************************************************************/

/** 모든 시간표 구성 응답 데이터 타입 */
type GetTimetableAllResponse = {
    data: TimetableObject[];
    message: "SUCCESS" | "FAIL";
};

/**
 * 서버에서 모든 시간표를 가져옵니다.
 * @returns {Promise<GetTimetableAllResponse>} 
 * Timetable 인스턴스 배열과 처리 결과 메시지를 포함하는 객체를 반환합니다.
 * 요청이 실패하면 빈 배열과 "FAIL" 메시지를 반환합니다.
 */
export async function getTimetableAll(): Promise<{
    data: Timetable[];
    message: "SUCCESS" | "FAIL";
}> {
    let responseData: GetTimetableAllResponse = { data: [], message: "FAIL" };
    try {
        const response = await axios.get(
            getApiUrl(`/api/timetable/manageTimetable`),
            {
                timeout: getDefualtAxiosTimeout(),
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
        data: responseData.data.map((timetableObject) => Timetable.fromObject(timetableObject)),
        message: responseData.message
    };
}




/*****************************************************************
 * 새로운 시간표를 서버에 저장하는 API 메서드입니다.
*****************************************************************/

/** 시간표 저장 응답 데이터 타입 */
type SaveTimetableResponse = {
    data: {
        id: string;
    };
    message: "SUCCESS" | "FAIL";
};

/**
 * 서버에 새로운 시간표를 저장합니다.
 * @param {TimetableObject} param - 저장할 시간표 구성 객체입니다.
 * @returns {Promise<SaveTimetableResponse>} 
 * 처리 결과 메시지를 포함하는 객체를 반환합니다.
 * 요청이 실패하면 "FAIL" 메시지를 반환합니다.
 */
export async function saveTimetable(param: Timetable): Promise<{
    data: {
        id: string;
    };
    message: "SUCCESS" | "FAIL";
}> {
    let responseData: SaveTimetableResponse = { data: { id: "" }, message: "FAIL" };
    try {
        const postData = param.toObject();
        const response = await axios.post(
            getApiUrl(`/api/timetable/manageTimetable`),
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
            data: { id: "" },
            message: "FAIL"
        }
    }
    return responseData;
}




/*****************************************************************
 * 기존 시간표를 서버에서 업데이트하는 API 메서드입니다.
*****************************************************************/

/** 시간표 업데이트 응답 데이터 타입 */
type UpdateTimetableResponse = {
    message: "SUCCESS" | "FAIL";
};

/**
 * 서버에서 기존 시간표를 업데이트합니다.
 * @param {TimetableObject} param - 업데이트할 시간표 구성 객체입니다.
 * @returns {Promise<UpdateTimetableResponse>} 
 * 처리 결과 메시지를 포함하는 객체를 반환합니다.
 * 요청이 실패하면 "FAIL" 메시지를 반환합니다.
 */
export async function updateTimetable(param: Timetable): Promise<{
    message: "SUCCESS" | "FAIL";
}> {
    if (param.getId() === "") return { message: "FAIL" };
    let responseData: UpdateTimetableResponse = { message: "FAIL" };
    try {
        const postData = param.toObject();
        const response = await axios.patch(
            getApiUrl(`/api/timetable/manageTimetable`),
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
            message: "FAIL"
        }
    }
    return responseData;
}

























type TestDelayResponse = {
    message: "SUCCESS" | "FAIL";
};

export async function testDelay(): Promise<{
    message: "SUCCESS" | "FAIL";
}> {
    let responseData: TestDelayResponse = { message: "FAIL" };
    try {
        const response = await axios.get(
            getApiUrl(`/api/test/delay`),
            {
                timeout: getDefualtAxiosTimeout(),
            }
        );
        responseData = response.data;
    } catch (error) {
        return { message: "FAIL" }
    }
    return { message: responseData.message }
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