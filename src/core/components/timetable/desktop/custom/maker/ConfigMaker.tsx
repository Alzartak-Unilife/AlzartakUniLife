"use client"

import styles from "./ConfigMaker.module.css"
import { Course } from "@/core/types/Course";
import DisplayTimetable from "../../DisplayTimetable";
import { useRecoilState, useRecoilValue } from "recoil";
import { useRouter } from "next/navigation";
import { hoverCourseAtomFamily } from "@/core/recoil/hoverCourseAtomFamily";
import { MakerConfig } from "@/core/types/MakerConfig";
import { makerConfigAtom } from "@/core/recoil/makerConfigAtom";
import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { createMakerConfig, getMakerConfig, updateMakerConfig } from "@/core/api/AlzartakUnilfeApi";


export default function ConfigMaker() {
    // Router
    const router = useRouter();


    // Recoil
    const hoverCourse = useRecoilValue<Course | null>(hoverCourseAtomFamily("customPage"));
    const [makerConfig, setMakerConfig] = useRecoilState<MakerConfig>(makerConfigAtom);


    // State
    const [isInitialLoadComplete, setIsInitialLoadComplete] = useState<boolean>(false);


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
        getMakerConfig().then(({ data: storedConfig, message }) => {
            if (storedConfig) {
                setMakerConfig(storedConfig);
                setIsInitialLoadComplete(true);
            } else {
                const defaultConfig = MakerConfig.fromObject({
                    wishCourses: []
                });
                createMakerConfig(defaultConfig).then(({ message }) => {
                    if (message === "FAIL") {
                        handleServerError();
                    } else {
                        setMakerConfig(defaultConfig);
                    }
                    setIsInitialLoadComplete(true);
                })
            }
        });
    }, [handleServerError, router]);


    useEffect(() => {
        if (!isInitialLoadComplete) return;
        updateMakerConfig(makerConfig).then(({ message }) => {
            if (message === "FAIL") {
                handleServerError();
            }
        });
    }, [handleServerError, router, makerConfig, isInitialLoadComplete]);


    // Render
    return (
        <div className={styles.wrapper}>
            {isInitialLoadComplete && (
                <div className={styles.timetable__field}>
                    <div className={styles.contents_title}>

                    </div>
                    <div className={styles.contents_display}>
                        <DisplayTimetable
                            wishCourses={makerConfig.getWishCourses()}
                            previewCourse={hoverCourse}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}