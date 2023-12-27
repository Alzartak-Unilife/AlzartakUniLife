"use client"

import styles from "./AutoGeneratorConfig.module.css"
import { Course, Time } from "@/core/types/Course";
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



export default function AutoGeneratorConfig() {
    // Recoil
    const hoveredCourse = useRecoilValue<Course | null>(autoHoverCourseAtom);
    const sortedWishCourses = useRecoilValue<Course[]>(sortedAutoWishCoursesSelector);
    const setWishCourses = useRecoilState<Course[]>(autoWishCoursesAtom)[1];


    // State
    const [isInitialLoadComplete, setIsInitialLoadComplete] = useState<boolean>(false);
    const [settingPreset, setSettingPreset] = useState<number>(0);
    const [creditType, setCreditType] = useState<"단일학점" | "범위학점">("단일학점");
    const [minCredit, setMinCredit] = useState<number>(0);
    const [maxCredit, setMaxCredit] = useState<number>(0);
    const [breakDays, setBreakDays] = useState<BreakDays>(new BreakDays());
    const [breaktimes, setBreaktimes] = useState<Breaktime[]>([]);
    const [generatorConfig, setGeneratorConfig] = useState<IGeneratorConfig>();


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
            setGeneratorConfig(storedConfig);
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
            setGeneratorConfig(defaultConfig);
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
        setGeneratorConfig(newConfig);
    }, [creditType, minCredit, maxCredit, breakDays, breaktimes, sortedWishCourses, isInitialLoadComplete]);

    useEffect(() => {
        if (!isInitialLoadComplete) return;
        LocalStorageProvider.set('generatorConfig', generatorConfig);
    }, [generatorConfig, isInitialLoadComplete]);


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
                                    />
                                </div>

                                <div className={styles.config_breaktime}>
                                    <ConfigBreaktime
                                        breaktimes={breaktimes}
                                        setBreaktimes={setBreaktimes}
                                    />
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
                </>
            )}
        </div>
    );
}