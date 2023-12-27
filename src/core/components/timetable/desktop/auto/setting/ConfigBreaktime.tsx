"use client"

import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import styles from "./ConfigBreaktime.module.css";
import { Day, Time } from "@/core/types/Course";
import { BreakDays, Breaktime } from "@/core/types/Timetable";
import useElementDimensions from "@/core/hooks/useElementDimensions";
import VirtualizedTable from "@/core/modules/virtualized-table/VirtualizedTable";


interface ConfigBreaktimeProps {
    breaktimes: Breaktime[]
    setBreaktimes: Dispatch<SetStateAction<Breaktime[]>>;
}

export default function ConfigBreaktime({ breaktimes, setBreaktimes }: ConfigBreaktimeProps) {
    // Const
    const days: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const minutes: number[] = Array.from({ length: 31 }, (_, i) => 480 + i * 30);
    const breaktimeTableAttributes: string[] = ["\u00A0", "공강 시간"];

    // Ref
    const breaktimeTable = useRef<HTMLDivElement>(null);


    // State
    const [day, setDay] = useState<Day>("Mon");
    const [startTime, setStartTime] = useState(480);
    const [endTime, setEndTime] = useState(510);


    // Custom Hook
    const breaktimeTableHeight = useElementDimensions(breaktimeTable, "Pure").height;


    // Handler
    const minuteToTime = (minute: number) => {
        let hour = Math.floor(minute / 60);
        return `${hour < 10 ? '0' : ''}${hour}:${(minute % 60) < 10 ? '0' : ''}${minute % 60}`;
    }

    const handleSelectBreaktime = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const newBreaktime = new Breaktime(day, new Time(startTime, endTime));
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
        <div className={styles.configBreaktime}>
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