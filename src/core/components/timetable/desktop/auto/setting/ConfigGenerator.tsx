"use client"

import styles from "./ConfigGenerator.module.css"
import { Course } from "@/core/types/Course";
import DisplayTimetable from "../../DisplayTimetable";
import { useRecoilState, useRecoilValue } from "recoil";
import { useCallback, useEffect, useState } from "react";
import { BreakDays } from "@/core/types/Timetable";
import ConfigCredit from "./ConfigCredit";
import ConfigBreakday from "./ConfigBreakday";
import ConfigBreaktime from "./ConfigBreaktime";
import { GeneratorConfig } from "@/core/types/GeneratorConfig";
import { generatorConfigAtom } from "@/core/recoil/generatorConfigAtom";
import GenerateTimetable from "./GenerateTimetable";
import { createGeneratorConfig, getGeneratorConfig, updateGeneratorConfig } from "@/core/api/AlzartakUnilfeApi";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { hoverCourseAtomFamily } from "@/core/recoil/hoverCourseAtomFamily";


export default function ConfigGenerator() {
    // Router
    const router = useRouter();


    // Recoil
    const hoverCourse = useRecoilValue<Course | null>(hoverCourseAtomFamily("autoPage"));
    const [generatorConfig, setGeneratorConfig] = useRecoilState<GeneratorConfig>(generatorConfigAtom);


    // State
    const [isInitialLoadComplete, setIsInitialLoadComplete] = useState<boolean>(false);
    const [settingPreset, setSettingPreset] = useState<number>(0);


    // Handler
    const handleServerError = useCallback(() => {
        Swal.fire({
            heightAuto: false,
            scrollbarPadding: false,
            html: '<h2 style="font-size: 20px; user-select: none;">알 수 없는 이유로 서버와의 연결이 끊겼습니다</h2>',
            icon: 'error',
            confirmButtonText: '<span style="font-size: 15px; user-select: none;">확인</span>',
            didClose() { router.replace("../") },
            didOpen() { router.prefetch("../") }
        })
    }, [])


    // Effect
    useEffect(() => {
        getGeneratorConfig().then(({ data: storedConfig, message }) => {
            if (storedConfig) {
                setGeneratorConfig(storedConfig);
                setIsInitialLoadComplete(true);
            } else {
                const defaultConfig = GeneratorConfig.fromObject({
                    creditType: "단일학점",
                    minCredit: 0,
                    maxCredit: 0,
                    breakDays: new BreakDays().toObject(),
                    breaktimes: [],
                    wishCourses: []
                });
                createGeneratorConfig(defaultConfig).then(({ message }) => {
                    if (message === "FAIL") {
                        handleServerError();
                    } else {
                        setGeneratorConfig(defaultConfig);
                    }
                    setIsInitialLoadComplete(true);
                })
            }
        });
    }, [handleServerError, router]);


    useEffect(() => {
        if (!isInitialLoadComplete) return;
        updateGeneratorConfig(generatorConfig).then(({ message }) => {
            if (message === "FAIL") {
                handleServerError();
            }
        });
    }, [handleServerError, router, generatorConfig, isInitialLoadComplete]);



    // Render
    return (
        <div className={styles.wrapper}>
            {isInitialLoadComplete && (
                <>
                    <div className={styles.setting__field} style={{ zIndex: hoverCourse ? 0 : 1 }}>
                        <div className={styles.contents_title}>
                            시간표 설정
                        </div>
                        <div className={styles.contents_display}>
                            <div className={styles.config_timetable}>
                                <div className={styles.config_credit}>
                                    <ConfigCredit />
                                </div>

                                <div className={styles.config_breakday}>
                                    <ConfigBreakday />
                                </div>

                                <div className={styles.config_breaktime}>
                                    <ConfigBreaktime />
                                </div>

                                <div className={styles.create_timetable}>
                                    <GenerateTimetable />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.timetable__field} style={{ zIndex: hoverCourse ? 1 : 0 }}>
                        <div className={styles.contents_title}>
                            {`'${hoverCourse !== null ? hoverCourse.getName() : "undefind"}' 강의 시간`}
                        </div>
                        <div className={styles.contents_display}>
                            <DisplayTimetable
                                wishCourses={hoverCourse ? [hoverCourse] : []}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}