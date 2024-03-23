"use client"

import styles from "./DisplayCourseDetails.module.css";
import { Course } from "@/core/types/Course"

interface DisplayCourseDetailsProps {
    course: Course;
}

export default function DisplayCourseDetails({ course }: DisplayCourseDetailsProps) {
    const titleList = [
        "학년/가진급학년",
        "교과과정",
        "교과영역구분",
        "학수강좌번호",
        "교과목명",
        "교원명",
        "수업캠퍼스",
        "요일/시간/강의실",
        "학점",
        "이론",
        "실습",
        "강의유형",
        "강의종류",
        "원어강의",
        "이수구분",
        "개설대학",
        "개설학과/전공",
        "비고",
        "강의평점"
    ];

    //const contentList = course.printFormat();

    return (
        <div className={styles.wrapper}>
            <div className={styles.titles}>
                {titleList.map((title) => {
                    return <div className={styles.title}>{title}</div>
                })}
            </div>
            <div className={styles.contents}>
                {Object.values(course.printFormat()).map((courseInfo) => {
                    return <div className={styles.content}>{courseInfo}</div>
                })}
            </div>
        </div>
    );
}


/*
    private year: number;                 // 개설년도
    private semester: number;             // 개설학기
    private grades: number[];             // 학년/가진급학년
    private curriculum: string;           // 교과과정
    private courseArea: string;           // 교과영역구분
    private baseCode: string;             // 학수강좌번호
    private divCode: string;              // 분반
    private name: string;                 // 교과목명
    private professor: string;            // 교원명
    private campus: string;               // 수업캠퍼스
    private schedules: Schedule[];        // 요일/시간/강의실
    private credit: number;               // 학점
    private theory: number;               // 이론
    private practice: number;             // 실습
    private lectureType: string;          // 강의유형
    private lectureCategory: string;      // 강의종류
    private language: string;             // 원어강의
    private requirementType: string;      // 이수구분
    private offeringCollege: string;      // 개설대학
    private offeringDepartment: string;   // 개설학과/전공
    private remarks: string;              // 비고
    private evaluation: number;           // 강의평점
    private rating: number;               // 선호도

*/