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

    return (
        <div className={styles.wrapper}>
            <div className={styles.titles}>
                {titleList.map((title, idx) => {
                    return <div key={idx} className={styles.title}>{title}</div>
                })}
            </div>
            <div className={styles.contents}>
                {Object.values(course.printFormat()).map((courseInfo, idx) => {
                    return <div key={idx} className={styles.content}>{courseInfo}</div>
                })}
            </div>
        </div>
    );
}