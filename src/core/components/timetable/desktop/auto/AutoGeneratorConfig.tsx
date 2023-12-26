"use client"

import styles from "./AutoGeneratorConfig.module.css"
import { Course, Day } from "@/core/types/Course";
import Timetable from "../Timetable";
import { useRecoilState } from "recoil";
import { autoWishCoursesAtom } from "@/core/recoil/wishCoursesAtom";
import { autoHoverCourseAtom } from "@/core/recoil/hoverCourseAtom";
import { useState } from "react";
import { BreakDays, Breaktime } from "@/core/types/Timetable";



export default function AutoGeneratorConfig() {
    // Const
    const days: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];


    // Recoil
    const [selectedCourses, setSelectedCourses] = useRecoilState<Course[]>(autoWishCoursesAtom);
    const [hoveredCourse, setHoveredCourse] = useRecoilState<Course | null>(autoHoverCourseAtom);


    // State
    const [settingPreset, setSettingPreset] = useState<number>(0);
    const [creditType, setCreditType] = useState<"단일학점" | "범위학점">('단일학점'); // 초기값 '단일학점' 설정
    const [breakDays, setBreakDays] = useState<BreakDays>(new BreakDays());
    const [breaktimes, setBreaktimes] = useState<Breaktime[]>([]);


    // Handler



    // Render
    return (
        <div className={styles.autoGeneratorConfig}>
            <div className={styles.setting__field} style={{ zIndex: hoveredCourse ? 0 : 1 }}>
                <div className={styles.contents_title}>
                    시간표 설정
                </div>
                <div className={styles.contents_display}>
                    <div className={styles.presets}>
                        <div className={styles.filter}>
                            <select className={styles.dropdown} value={settingPreset} onChange={(e) => setSettingPreset(parseInt(e.target.value))}>
                                {Array.from({ length: 11 }, (_, idx) => idx).map((presetIdx) =>
                                    <option key={presetIdx}>
                                        {presetIdx === 0 ? "-프리셋 선택-" : `프리셋${presetIdx}`}
                                    </option>)}
                            </select>
                        </div>
                        <div className={styles.buttons}>
                            <button className={styles.btnLoad}>불러오기</button>
                            <button className={styles.btnSave}>저장</button>
                        </div>
                    </div>
                    <div className={styles.preset_data}>
                        <div className={[styles.setting, styles.setting_credit].join(' ')}>
                            <label>학점 타입</label>
                            <div className={styles.radioButtons}>
                                <label>
                                    <input
                                        type="radio"
                                        value="단일학점"
                                        checked={creditType === '단일학점'}
                                        onChange={() => setCreditType('단일학점')}
                                    />
                                    단일 학점
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="범위학점"
                                        checked={creditType === '범위학점'}
                                        onChange={() => setCreditType('범위학점')}
                                    />
                                    범위 학점
                                </label>
                            </div>
                            <label>{creditType === "단일학점" ? "목표 학점" : "최소 학점"}</label>
                            <select className={styles.dropdown} value={settingPreset} onChange={(e) => setSettingPreset(parseInt(e.target.value))}>
                                {Array.from({ length: 25 }, (_, idx) => idx).map((presetIdx) =>
                                    <option key={presetIdx}>
                                        {presetIdx === 0 ? `-학점 선택-` : `${presetIdx}학점`}
                                    </option>)}
                            </select>
                            <label>{creditType === "단일학점" ? "\u00A0" : "최대 학점"}</label>
                            <select className={styles.dropdown} value={settingPreset} onChange={(e) => setSettingPreset(parseInt(e.target.value))} style={{
                                visibility: `${creditType === "단일학점" ? "hidden" : "visible"}`
                            }}>
                                {Array.from({ length: 25 }, (_, idx) => idx).map((presetIdx) =>
                                    <option key={presetIdx}>
                                        {presetIdx === 0 ? "-학점 선택-" : `${presetIdx}학점`}
                                    </option>)}
                            </select>
                        </div>

                        <div className={[styles.setting, styles.setting_breakday].join(' ')}>
                            <label>요일 공강</label>
                            <div className={styles.checkbox}>
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

                        <div className={[styles.setting, styles.setting_breaktime].join(' ')}>
                            <div>
                                <select className={[styles.dropdown, styles.select_day].join(' ')}>
                                    {days.map((day) =>
                                        <option key={day}>{day}</option>)}
                                </select>

                                <select className={[styles.dropdown, styles.select_day].join(' ')}>
                                    {days.map((day) =>
                                        <option key={day}>{day}</option>)}
                                </select>
                                ~
                                <select className={[styles.dropdown, styles.select_day].join(' ')}>
                                    {days.map((day) =>
                                        <option key={day}>{day}</option>)}
                                </select>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div className={styles.timetable__field} style={{ zIndex: hoveredCourse ? 1 : 0 }}>
                <div className={styles.contents_title}>
                    {`'${hoveredCourse !== null ? hoveredCourse.getName() : "undefind"}' 강의 시간`}
                </div>
                <div className={styles.contents_display}>
                    <Timetable
                        selectedCourses={hoveredCourse ? [hoveredCourse] : []}
                    />
                </div>
            </div>
        </div>
    );
}