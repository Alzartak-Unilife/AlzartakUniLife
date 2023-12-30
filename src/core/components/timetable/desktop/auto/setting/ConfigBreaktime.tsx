"use client"

import { useEffect, useRef, useState } from "react";
import styles from "./ConfigBreaktime.module.css";
import { Course, Day, Time } from "@/core/types/Course";
import { Breaktime } from "@/core/types/Timetable";
import useElementDimensions from "@/core/hooks/useElementDimensions";
import VirtualizedTable from "@/core/modules/virtualized-table/VirtualizedTable";
import Swal from "sweetalert2";
import { useRecoilState, useRecoilValue } from "recoil";
import { generatorConfigBreaktimesSelector, generatorConfigWishCoursesSelector } from "@/core/recoil/generatorConfigAtom";


export default function ConfigBreaktime() {
    // Const
    const essentialRating = 6;
    const days: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const minutes: number[] = Array.from({ length: 31 }, (_, i) => 480 + i * 30);
    const breaktimeTableAttributes: string[] = ["\u00A0", "공강 시간"];


    // Ref
    const breaktimeTable = useRef<HTMLDivElement>(null);


    // State
    const [day, setDay] = useState<Day>("Mon");
    const [startTime, setStartTime] = useState(480);
    const [endTime, setEndTime] = useState(510);


    // Recoil
    const [breaktimes, setBreaktimes] = useRecoilState<Breaktime[]>(generatorConfigBreaktimesSelector);
    const wishCourses = useRecoilValue<Course[]>(generatorConfigWishCoursesSelector);


    // Custom Hook
    const breaktimeTableHeight = useElementDimensions(breaktimeTable, "Pure").height;


    // Handler
    const minuteToTime = (minute: number) => {
        let hour = Math.floor(minute / 60);
        return `${hour < 10 ? '0' : ''}${hour}:${(minute % 60) < 10 ? '0' : ''}${minute % 60}`;
    }

    const handleSelectBreaktime = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const newBreaktime = new Breaktime(day, new Time(startTime, endTime));
        const checkDuplication = breaktimes.some((breaktime) => breaktime.equalWith(newBreaktime));
        const checkConflictWithEssential = wishCourses.some((course) =>
            course.getRating() === essentialRating && course.getSchedules().some((schedule) =>
                schedule.getDay() === newBreaktime.getDay() && schedule.getTime().conflictWith(newBreaktime.getTime())));

        if (checkDuplication || checkConflictWithEssential) {
            const comment = checkDuplication ? "이미 추가된 공강 시간입니다" : "필수과목과 시간이 겹칩니다";
            Swal.fire({
                heightAuto: false,
                scrollbarPadding: false,
                html: `<h2 style="font-size: 20px; user-select: none;">${comment}</h2>`,
                icon: 'error',
                confirmButtonText: '<span style="font-size: 15px; user-select: none;">닫기</span>',
                buttonsStyling: false,
                customClass: {
                    confirmButton: `${styles.btnConfirm}`,
                    cancelButton: `${styles.btnCancel}`
                },
            })
            return;
        }
        setBreaktimes([...breaktimes, newBreaktime]);
    };

    const handleUnselectBreaktime = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const selectedIndex = parseInt(e.currentTarget.parentElement?.parentElement?.id || "-1");
        const newBreaktimes = breaktimes.filter((breaktime, index) => index !== selectedIndex);
        setBreaktimes(newBreaktimes);

    };


    // Effect
    useEffect(() => {
        if (endTime <= startTime) {
            setEndTime(startTime + 30); // 종료 시간을 시작 시간보다 최소 30분 뒤로 설정
        }
    }, [startTime, endTime]);


    // Render
    return (
        <div className={styles.wrapper}>
            <label>일일 공강</label>
            <div className={styles.breakday_select}>
                <select
                    className={[styles.dropdown, styles.dropdown_day].join(' ')}
                    value={day}
                    onChange={(e) => setDay(e.target.value as Day)}
                >
                    {days.map((day) =>
                        <option key={day}>{day}</option>)}
                </select>
                <label> , </label>
                <select
                    className={[styles.dropdown, styles.dropdown_time].join(' ')}
                    value={startTime}
                    onChange={(e) => setStartTime(Number(e.target.value))}
                >
                    {minutes.map((minute) =>
                        <option key={minute} value={minute}>{minuteToTime(minute)}</option>)}
                </select>
                <label>~</label>
                <select
                    className={[styles.dropdown, styles.dropdown_time].join(' ')}
                    value={endTime}
                    onChange={(e) => setEndTime(Number(e.target.value))}
                >
                    {[...minutes, 1410].filter(minute => minute > startTime).map((minute) =>
                        <option key={minute} value={minute}>{minuteToTime(minute)}</option>)}
                </select>
                <button className={styles.btnAdd} onClick={handleSelectBreaktime}>추가</button>
            </div>
            <div className={styles.breaktime_table} ref={breaktimeTable}>
                <VirtualizedTable
                    windowHeight={breaktimeTableHeight - 2}
                    tableStyle={{
                        height: "calc(100% - 2px)",
                        width: "calc(100% - 2px)",
                        overflow: "hidden",
                        borderRadius: "8px",
                        border: "var(--border-solid)"
                    }}


                    headerHeight={30}
                    headerStyle={{
                        default: {
                            backgroundColor: "var(--table-attribute-background)",
                        },
                    }}
                    attributeWidths={[
                        { width: "70px" },
                        { width: "calc(100% - 70px)" },
                    ]}
                    attributeStyle={{
                        default: {
                            borderLeft: "var(--border-solid)",
                            borderBottom: "var(--border-solid)",
                            userSelect: "none",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "calc(30px - 2px)",
                        },
                        hover: {
                            backgroundColor: "var(--main-color-light)",
                        }
                    }}
                    renderHeader={({ index, attributeClassName: columnClassName, attributeStyle: columnStyle }) => {
                        return (
                            <div key={index} className={columnClassName} style={{ ...columnStyle, ...(index === 0 && { borderLeft: "0px" }) }}>
                                {breaktimeTableAttributes[index]}
                            </div>
                        );
                    }}


                    numRows={breaktimes.length}
                    rowHeight={30}
                    rowStyle={{
                        default: {
                            backgroundColor: "var(--sub-color)",
                        },
                        hover: {
                            backgroundColor: "var(--main-color-light-light)",
                        }
                    }}
                    cellStyle={{
                        default: {
                            borderLeft: "var(--border-solid)",
                            userSelect: "none",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                        },
                        hover: {
                            backgroundColor: "var(--main-color-light)",
                        }
                    }}
                    renderRows={({ index, rowClassName, rowStyle, cellClassName, cellStyles }) => {
                        const breaktime = breaktimes[index].printFormat();
                        return (
                            <div key={index} id={`${index}`} className={rowClassName} style={rowStyle}>
                                <div className={cellClassName} style={{ ...cellStyles[0], borderLeft: "0px" }}>
                                    <button className={styles.breaktime_table_nagative_button} onClick={handleUnselectBreaktime}>
                                        {"삭제"}
                                    </button>
                                </div>
                                <div className={cellClassName} style={cellStyles[1]}>{breaktime}</div>
                            </div>
                        );
                    }}
                />
            </div>
        </div>
    );
}