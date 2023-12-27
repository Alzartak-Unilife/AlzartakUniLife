"use client"

import { Dispatch, SetStateAction } from "react";
import styles from "./ConfigBreakday.module.css";
import { Day } from "@/core/types/Course";
import { BreakDays } from "@/core/types/Timetable";


interface ConfigBreakdayProps {
    breakDays: BreakDays;
    setBreakDays: Dispatch<SetStateAction<BreakDays>>;
}

export default function ConfigBreakday({ breakDays, setBreakDays }: ConfigBreakdayProps) {
    // Const
    const days: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
                            onChange={() => {
                                const newBreakDay = breakDays.copy();
                                newBreakDay.setDay(day, !newBreakDay.getDay(day));
                                setBreakDays(newBreakDay);
                            }}
                        />
                        {day}
                    </label>
                ))}
            </div>
        </div>
    );
}