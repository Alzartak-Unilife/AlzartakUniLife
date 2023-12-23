"use client"

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Timetable.module.css"
import { Course, Day, Schedule, Time } from "@/core/types/Course";
import useElementDimensions from "@/core/hooks/useElementDimensions";


export interface TimetableProps {
    selectedCourses: Course[];
    previewCourse?: Course | null;
}


type TimetableBlock = "REAL" | "SHADOW";


export default function Timetable({ selectedCourses, previewCourse }: TimetableProps) {
    // Ref
    const timetable = useRef<HTMLDivElement>(null);


    // Const
    const weekdays = useMemo<Day[]>(() => ["Mon", "Tue", "Wed", "Thu", "Fri"], []);
    const weekends = useMemo<Day[]>(() => ["Sat", "Sun"], []);
    const noFixedDay = useMemo<Day[]>(() => ["None"], []);
    const hasWeekendSchedules = [previewCourse, ...selectedCourses].some((course) => course?.getSchedules().some((schedule) => weekends.includes(schedule.getDay() as Day)));
    const hasNoFixedSchedules = [previewCourse, ...selectedCourses].some((course) => course?.getSchedules().length === 0);


    // State
    const [heightPerMinute, setHeightPerMinute] = useState<number>(0);
    const [displayWeekend, setDisplayWeekend] = useState<boolean>(false);
    const [displayNoFixedDay, setdisplayNoFixedDay] = useState<boolean>(false);
    const [timetableColumsCount, setTimetableColumsCount] = useState<number>(5);
    const [courseByDay, setCourseByDay] = useState<Record<Day, [TimetableBlock, number, Course][]>>({ Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [], None: [] });


    // Custom Hook
    const timetableHeight = useElementDimensions<HTMLDivElement>(timetable, "Pure").height;


    // Effect
    useEffect(() => {
        const columnsCount = 5 + (hasWeekendSchedules ? weekends.length : 0) + (hasNoFixedSchedules ? noFixedDay.length : 0);
        setDisplayWeekend(hasWeekendSchedules);
        setdisplayNoFixedDay(hasNoFixedSchedules);
        setTimetableColumsCount(columnsCount);
    }, [previewCourse, selectedCourses, hasWeekendSchedules, hasNoFixedSchedules, weekends, noFixedDay]);

    /** 선택된 과목이 바뀌면 상태 업데이트 */
    useEffect(() => {
        const newCourseByDay: Record<Day, [TimetableBlock, number, Course][]> = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [], None: [] };

        selectedCourses.forEach((course, index) => {
            if (course.getSchedules().length > 0) {
                course.getSchedules().forEach((lecture) => {
                    newCourseByDay[lecture.getDay() as Day].push(["REAL", index + 1, course]);
                });
            } else {
                newCourseByDay["None"].push(["REAL", index + 1, course]);
            }
        });
        if (previewCourse) {
            if (previewCourse.getSchedules().length > 0) {
                previewCourse.getSchedules().forEach((lecture) => {
                    newCourseByDay[lecture.getDay() as Day].push(["SHADOW", 0, previewCourse]);
                });
            } else {
                newCourseByDay["None"].push(["SHADOW", 0, previewCourse]);
            }
        }

        setCourseByDay(newCourseByDay);
    }, [selectedCourses, previewCourse]);

    /** 시간표 높이가 변경되면 블록 높이도 수정해야함 */
    useEffect(() => {
        setHeightPerMinute((timetableHeight - 30) / (16 * 60));
    }, [timetableHeight, setHeightPerMinute])


    // Handler
    /** 요일 칼럼 생성 */
    const createDaysColumns = () => {
        const firstCellWidth = 75;
        const otherCellWidth = `calc((100% - ${firstCellWidth}px) / ${timetableColumsCount})`;
        return (<>
            <th className={styles.timetable__day} style={{ width: `${firstCellWidth}px` }}></th>
            {weekdays.map((day) => (<td key={day} className={styles.timetable__day} style={{ width: otherCellWidth }}>{day}</td>))}
            {weekends.map((day) => (<td key={day} className={styles.timetable__day} style={{ width: otherCellWidth, display: `${displayWeekend ? "table-cell" : "none"}` }}>{day}</td>))}
            {noFixedDay.map((day) => (<td key={day} className={styles.timetable__day} style={{ width: otherCellWidth, display: `${displayNoFixedDay ? "table-cell" : "none"}` }}></td>))}
        </>);
    };

    /** 시간 행 생성 */
    const createTimesRows = () => {
        return (
            <>
                {[...Array(16).keys()].map((hour, idx) => {
                    hour += 8;
                    const hourText = hour <= 12
                        ? `${hour < 10 ? ' ' : ''}${hour}:00 am`
                        : `${hour - 12 < 10 ? ' ' : ''}${hour - 12}:00 pm`;
                    return (<div key={idx} className={styles.timetable__hour}>{hourText}</div>);
                })}
            </>
        );
    }

    /** 강의 블록 생성 */
    const createCourseBlocks = (day: Day) => {
        return courseByDay[day].map(([blockType, colorIndex, course]) => {
            const schedules: Schedule[] = course.getSchedules().length ? course.getSchedules() : [new Schedule("None", new Time(480, blockType === "REAL" ? 510 : 1440), "")];

            return schedules.filter((lecture) => day.localeCompare(lecture.getDay()) === 0).map((lecture) => {
                const keyString = `${day}-${course.getBaseCode()}-${course.getDivCode()}-${lecture.getTime().getBegin()}-${lecture.getTime().getEnd()}-${blockType}`;

                switch (blockType) {
                    case "REAL": {
                        return (
                            <div key={keyString} className={[styles.course_block, styles[`color${colorIndex}`]].join(' ')}
                                style={{
                                    position: day === "None" ? "static" : "absolute",
                                    zIndex: 10,
                                    top: `${heightPerMinute * (lecture.getTime().getBegin() - 480)}px`,
                                    height: (lecture.getTime().getEnd() - lecture.getTime().getBegin()) * heightPerMinute,
                                    width: "100%",
                                    overflow: "hidden",
                                    boxSizing: "border-box",
                                    border: "1px solid #d6d6d6",
                                    borderWidth: "1px 0",
                                }}>
                                <ul className={styles.course_block__status} style={{ display: "none" }}>
                                    <li className={styles.course_block__delete} title="삭제"></li>
                                </ul>
                                <h3>{course.getName()}</h3>
                                <p>
                                    <em>{course.getProfessor()}</em>
                                    <span>{lecture.getRoom() || ""}</span>
                                </p>
                            </div >
                        )
                    }
                    case "SHADOW": {
                        return (
                            <div key={keyString} className={[styles.course_block, styles[`color${colorIndex}`]].join(' ')}
                                style={{
                                    position: "absolute",
                                    zIndex: 11,
                                    top: `${heightPerMinute * (lecture.getTime().getBegin() - 480)}px`,
                                    height: (lecture.getTime().getEnd() - lecture.getTime().getBegin()) * heightPerMinute,
                                    width: "100%",
                                }}>
                            </div>
                        )
                    }
                    default:
                        return null;
                }
            });
        });
    };

    /** 시간 블록 생성 */
    const createTimeBlocks = () => {
        return [...Array(16).keys()].map(hour => {
            hour += 8;
            return (<div key={hour} className={styles.timetable__time_block}></div>);
        });
    }


    // Render
    return (
        <div className={styles.timetable} ref={timetable}>
            <div className={styles.timetable__head}>
                <table className={styles.timetable__head_table} >
                    <tbody>
                        <tr>{createDaysColumns()}</tr>
                    </tbody>
                </table>
            </div>

            <div className={styles.timetable__body}>
                <table className={styles.timetable__body_table}>
                    <tbody >
                        <tr>
                            <th>
                                <div className={styles.timetable__hours}>{createTimesRows()}</div>
                            </th>
                            {weekdays.map(day => {
                                return (
                                    <td key={day} className={styles.timetable__block_field}>
                                        <div className={styles.timetable__course_blocks}>{createCourseBlocks(day)}</div>
                                        <div className={styles.timetable__time_blocks}>{createTimeBlocks()}</div>
                                    </td>);
                            })}
                            {weekends.map(day => {
                                return (
                                    <td key={day} className={styles.timetable__block_field} style={{ display: `${displayWeekend ? "table-cell" : "none"}` }}>
                                        <div className={styles.timetable__course_blocks}>{createCourseBlocks(day)}</div>
                                        <div className={styles.timetable__time_blocks}>{createTimeBlocks()}</div>
                                    </td>);
                            })}
                            {noFixedDay.map(day => {
                                return (
                                    <td key={day} className={styles.timetable__block_field} style={{ display: `${displayNoFixedDay ? "table-cell" : "none"}` }}>
                                        <div className={styles.timetable__course_blocks}>{createCourseBlocks(day)}</div>
                                        <div className={styles.timetable__time_blocks}>{createTimeBlocks()}</div>
                                    </td>);
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div >
    );
}