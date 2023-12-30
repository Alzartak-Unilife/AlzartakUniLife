"use client"

import styles from "./ConfigBreakday.module.css";
import { Course, Day } from "@/core/types/Course";
import Swal from "sweetalert2";
import { useRecoilState, useRecoilValue } from "recoil";
import { generatorConfigBreakDaysSelector, generatorConfigWishCoursesSelector } from "@/core/recoil/generatorConfigAtom";
import { BreakDays } from "@/core/types/Timetable";


export default function ConfigBreakday() {
    // Const
    const essentialRating = 6;
    const days: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];


    // Recoil
    const [breakDays, setBreakDays] = useRecoilState<BreakDays>(generatorConfigBreakDaysSelector);
    const wishCourses = useRecoilValue<Course[]>(generatorConfigWishCoursesSelector);


    // Hnalder
    const handleBreakDay = (day: Day) => {
        if (!breakDays.getDay(day)) {
            const checkConflictWithEssential = wishCourses.some((course) => course.getRating() === essentialRating && course.getSchedules().some((schedule) => schedule.getDay() === day));
            if (checkConflictWithEssential) {
                const comment = "필수과목과 요일이 겹칩니다";
                Swal.fire({
                    heightAuto: false,
                    scrollbarPadding: false,
                    html: `<h2 style="font-size: 20px; user-select: none;">${comment}</h2>`,
                    icon: 'error',
                    confirmButtonText: '<span style="font-size: 15px; user-select: none;">닫기</span>',
                })
                return;
            }
        }
        const newBreakDay = breakDays.copy();
        newBreakDay.setDay(day, !newBreakDay.getDay(day));
        setBreakDays(newBreakDay);
    };


    // Render
    return (
        <div className={styles.configBreakday}>
            <label>요일 공강</label>
            <div className={styles.breakday_select}>
                {days.map((day, index) => (
                    <label key={index}>
                        <input
                            type="checkbox"
                            id={day}
                            checked={breakDays.getDay(day)}
                            onChange={() => { handleBreakDay(day) }}
                        />
                        {day}
                    </label>
                ))}
            </div>
        </div>
    );
}