"use client"

import styles from "./CustomTimetableDisplay.module.css"
import { Course } from "@/core/types/Course";
import Timetable from "../Timetable";
import { useRecoilState } from "recoil";
import { customWishCoursesAtom } from "@/core/recoil/wishCoursesAtom";
import { customHoverCourseAtom } from "@/core/recoil/hoverCourseAtom";

export default function CustomTimetableDisplay() {
    // Recoil
    const [selectedCourses, setSelectedCourses] = useRecoilState<Course[]>(customWishCoursesAtom);
    const [hoveredCourse, setHoveredCourse] = useRecoilState<Course | null>(customHoverCourseAtom);


    // Render
    return (
        <div className={styles.customTimetableDisplay}>
            <div className={styles.setting__field} style={{ zIndex: hoveredCourse ? 0 : 1 }}>
            </div>
            <div className={styles.timetable__field} style={{ zIndex: hoveredCourse ? 1 : 0 }}>
                <div className={styles.timetable__name}>
                    {`'${hoveredCourse !== null ? hoveredCourse.getName() : "undefind"}' 강의 시간`}
                </div>
                <div className={styles.timetable__display}>
                    <Timetable
                        selectedCourses={selectedCourses}
                        previewCourse={hoveredCourse}
                    />
                </div>
            </div>
        </div>
    );
}