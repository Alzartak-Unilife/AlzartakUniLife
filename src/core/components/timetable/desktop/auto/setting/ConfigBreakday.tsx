"use client"

import { Dispatch, SetStateAction } from "react";
import styles from "./ConfigBreakday.module.css";
import { Course, Day } from "@/core/types/Course";
import { BreakDays } from "@/core/types/Timetable";


interface ConfigBreakdayProps {
    breakDays: BreakDays;
    setBreakDays: Dispatch<SetStateAction<BreakDays>>;
    wishCourses: Course[];
}

export default function ConfigBreakday({ breakDays, setBreakDays, wishCourses }: ConfigBreakdayProps) {
    // Const
    const essentialRating = 6;
    const days: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];


    // Hnalder
    const handleBreakDay = (day: Day) => {
        if (!breakDays.getDay(day)) {
            const checkConflictWithEssential = wishCourses.some((course) => course.getRating() === essentialRating && course.getSchedules().some((schedule) => schedule.getDay() === day));
            if (checkConflictWithEssential) { alert("필수과목과 요일이 겹칩니다."); return; }
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