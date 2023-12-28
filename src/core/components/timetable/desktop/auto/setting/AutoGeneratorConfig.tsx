"use client"

import styles from "./AutoGeneratorConfig.module.css"
import { Course } from "@/core/types/Course";
import Timetable from "../../Timetable";
import { useRecoilState, useRecoilValue } from "recoil";
import { autoHoverCourseAtom } from "@/core/recoil/hoverCourseAtom";
import { useEffect, useState } from "react";
import { BreakDays, Breaktime } from "@/core/types/Timetable";
import ConfigPreset from "./ConfigPreset";
import ConfigCredit from "./ConfigCredit";
import ConfigBreakday from "./ConfigBreakday";
import ConfigBreaktime from "./ConfigBreaktime";
import { IGeneratorConfig } from "@/core/types/IGeneratorConfig";
import { autoWishCoursesAtom, sortedAutoWishCoursesSelector } from "@/core/recoil/wishCoursesAtom";
import { LocalStorageProvider } from "@/core/modules/storage/AppStorageProvider";
import { autoGeneratorConfigAtom } from "@/core/recoil/autoGeneratorConfigAtom";
import CreateTimetable from "./CreateTimetable";



export default function AutoGeneratorConfig() {
    // Recoil
    const hoveredCourse = useRecoilValue<Course | null>(autoHoverCourseAtom);
    const sortedWishCourses = useRecoilValue<Course[]>(sortedAutoWishCoursesSelector);
    const setWishCourses = useRecoilState<Course[]>(autoWishCoursesAtom)[1];
    const [autoGeneratorConfig, setAutoGeneratorConfig] = useRecoilState<IGeneratorConfig>(autoGeneratorConfigAtom);


    // State
    const [isInitialLoadComplete, setIsInitialLoadComplete] = useState<boolean>(false);
    const [settingPreset, setSettingPreset] = useState<number>(0);
    const [creditType, setCreditType] = useState<"단일학점" | "범위학점">("단일학점");
    const [minCredit, setMinCredit] = useState<number>(0);
    const [maxCredit, setMaxCredit] = useState<number>(0);
    const [breakDays, setBreakDays] = useState<BreakDays>(new BreakDays());
    const [breaktimes, setBreaktimes] = useState<Breaktime[]>([]);


    // Effect
    useEffect(() => {
        const storedConfig = LocalStorageProvider.get<IGeneratorConfig>('generatorConfig');
        if (storedConfig) {
            setCreditType(storedConfig.creditType);
            setMinCredit(storedConfig.minCredit);
            setMaxCredit(storedConfig.maxCredit);
            setBreakDays(BreakDays.fromObject(storedConfig.breakDays));
            setBreaktimes(storedConfig.breaktimes.map(b => Breaktime.fromObject(b)));
            setWishCourses(storedConfig.wishCourses.map(c => Course.fromObject(c)));
            setAutoGeneratorConfig(storedConfig);
        } else {
            const defaultConfig: IGeneratorConfig = {
                creditType: "단일학점",
                minCredit: 0,
                maxCredit: 0,
                breakDays: new BreakDays().toObject(),
                breaktimes: [],
                wishCourses: []
            };
            setCreditType(defaultConfig.creditType);
            setMinCredit(defaultConfig.minCredit);
            setMaxCredit(defaultConfig.maxCredit);
            setBreakDays(new BreakDays());
            setBreaktimes([]);
            setWishCourses([]);
            setAutoGeneratorConfig(defaultConfig);
        }
        setIsInitialLoadComplete(true);
    }, []);

    useEffect(() => {
        if (!isInitialLoadComplete) return;
        const newConfig: IGeneratorConfig = {
            creditType,
            minCredit,
            maxCredit,
            breakDays: breakDays.toObject(),
            breaktimes: breaktimes.map(breaktime => breaktime.toObject()),
            wishCourses: sortedWishCourses.map(course => course.toObject()),
        };
        setAutoGeneratorConfig(newConfig);
    }, [creditType, minCredit, maxCredit, breakDays, breaktimes, sortedWishCourses, isInitialLoadComplete]);

    useEffect(() => {
        if (!isInitialLoadComplete) return;
        LocalStorageProvider.set('generatorConfig', autoGeneratorConfig);
    }, [autoGeneratorConfig, isInitialLoadComplete]);


    // Render
    return (
        <div className={styles.autoGeneratorConfig}>
            {isInitialLoadComplete && (
                <>
                    <div className={styles.setting__field} style={{ zIndex: hoveredCourse ? 0 : 1 }}>
                        <div className={styles.contents_title}>
                            시간표 설정
                        </div>
                        <div className={styles.contents_display}>
                            <div className={styles.select_preset}>
                                <ConfigPreset
                                    settingPreset={settingPreset}
                                    setSettingPreset={setSettingPreset}
                                />
                            </div>
                            <div className={styles.config_timetable}>
                                <div className={styles.config_credit}>
                                    <ConfigCredit
                                        creditType={creditType}
                                        setCreditType={setCreditType}
                                        minCredit={minCredit}
                                        setMinCredit={setMinCredit}
                                        maxCredit={maxCredit}
                                        setMaxCredit={setMaxCredit}
                                    />
                                </div>

                                <div className={styles.config_breakday}>
                                    <ConfigBreakday
                                        breakDays={breakDays}
                                        setBreakDays={setBreakDays}
                                        wishCourses={sortedWishCourses}
                                    />
                                </div>

                                <div className={styles.config_breaktime}>
                                    <ConfigBreaktime
                                        breaktimes={breaktimes}
                                        setBreaktimes={setBreaktimes}
                                        wishCourses={sortedWishCourses}
                                    />
                                </div>

                                <div className={styles.create_timetable}>
                                    <CreateTimetable />
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
                                wishCourses={hoveredCourse ? [hoveredCourse] : []}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}