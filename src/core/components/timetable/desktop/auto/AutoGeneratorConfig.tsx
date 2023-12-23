"use client"

import { useEffect } from "react";
import styles from "./AutoGeneratorConfig.module.css"
import { Course } from "@/core/types/Course";
import Timetable from "../Timetable";
import { useRecoilState } from "recoil";
import { SelectedCoursesAtom } from "@/core/recoil/SelectedCoursesAtom";
import { HoveredCourseAtom } from "@/core/recoil/HoveredCourseAtom";



export default function AutoGeneratorConfig() {
    // Recoil
    const [selectedCourses, setSelectedCourses] = useRecoilState<Course[]>(SelectedCoursesAtom);
    const [hoveredCourse, setHoveredCourse] = useRecoilState<Course | null>(HoveredCourseAtom);


    // Render
    return (
        <div className={styles.autoGeneratorConfig}>
            <div className={styles.setting__field} style={{ zIndex: hoveredCourse ? 1 : 0 }}>
            </div>
            <div className={styles.timetable__field} style={{ zIndex: hoveredCourse ? 0 : 1 }}>
                <div className={styles.timetable__name}>
                    {`'${hoveredCourse !== null ? hoveredCourse.getName() : "undefind"}' 강의 시간`}
                </div>

                <div className={styles.timetable__display}>
                    <Timetable
                        selectedCourses={hoveredCourse ? [hoveredCourse] : []}
                    />
                </div>
            </div>
        </div>
    );
}