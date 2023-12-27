import { CourseObject } from "./Course";
import { BreakDaysObject, BreaktimeObject } from "./Timetable";

/**
 * IGeneratorConfig 인터페이스는 시간표 생성기의 설정을 나타냅니다.
 * 
 * - creditType: 학점 타입을 나타내며, "단일학점" 또는 "범위학점" 중 하나입니다.
 * 
 * - minCredit: 최소 학점을 나타냅니다. creditType이 "범위학점"일 때 사용됩니다.
 * 
 * - maxCredit: 최대 학점을 나타냅니다. creditType이 "범위학점"일 때 사용됩니다.
 * 
 * - breakDays: 요일별 공강 여부를 나타내는 객체입니다. BreakDaysObject 타입을 참조합니다.
 * 
 * - breaktimes: 특정 요일에 설정된 공강 시간대를 나타냅니다. BreaktimeObject 배열로 표현됩니다.
 * 
 * - wishCourses: 사용자가 선택한 강의 목록을 나타냅니다. 각 강의는 CourseObject 형태로 저장됩니다.
 */
export interface IGeneratorConfig {
    creditType: "단일학점" | "범위학점";
    minCredit: number;
    maxCredit: number;
    breakDays: BreakDaysObject;
    breaktimes: BreaktimeObject[];
    wishCourses: CourseObject[];
}