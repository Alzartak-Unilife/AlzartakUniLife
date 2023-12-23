"use client"

import styles from "./AutoGeneratorConfig.module.css"
import { Course } from "@/core/types/Course";
import Timetable from "../Timetable";
import { useRecoilState } from "recoil";
import { autoWishCoursesAtom } from "@/core/recoil/wishCoursesAtom";
import { autoHoverCourseAtom } from "@/core/recoil/hoverCourseAtom";



export default function AutoGeneratorConfig() {
    // Recoil
    const [selectedCourses, setSelectedCourses] = useRecoilState<Course[]>(autoWishCoursesAtom);
    const [hoveredCourse, setHoveredCourse] = useRecoilState<Course | null>(autoHoverCourseAtom);

    // Render
    return (
        <div className={styles.autoGeneratorConfig}>
            <div className={styles.setting__field} style={{ zIndex: hoveredCourse ? 0 : 1 }}>
            </div>
            <div className={styles.timetable__field} style={{ zIndex: hoveredCourse ? 1 : 0 }}>
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