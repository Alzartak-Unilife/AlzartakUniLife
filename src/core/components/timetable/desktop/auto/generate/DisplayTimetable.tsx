"use client"

import { Course } from "@/core/types/Course";
import styles from "./DisplayTimetable.module.css";
import Timetable from "../../Timetable";
import Link from "next/link";

interface DisplayTimetableProps {
    timetableIdx: number;
    timetables: Course[][];
}

export default function DisplayTimetable({ timetableIdx, timetables }: DisplayTimetableProps) {
    return (
        <div className={styles.displayTimetable}>
            {timetables.map((courses, idx) => {
                return (
                    <div key={idx} className={styles.timetable_field}>
                        <div className={styles.timetable_title}>
                            {courses.length > 0 && <div>
                                {`시간표${timetableIdx + idx} [${courses.reduce((sum, course) => sum + course.getCredit(), 0)}학점]`}
                            </div>}
                        </div>

                        <div className={styles.timetable_body}>
                            <Timetable
                                wishCourses={courses}
                            />
                        </div>

                        <Link className={styles.timetable_select} href={"../"}>
                            {courses.length > 0 && <button className={styles.btnSelect}>
                                시간표 선택
                            </button>}
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}


/*
    height: 30px;
    width: 100%;
    margin-top: 10px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-weight: 600;
    color: var(--main-color);
*/