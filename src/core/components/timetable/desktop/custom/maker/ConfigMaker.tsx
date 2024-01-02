"use client"

import styles from "./ConfigMaker.module.css"
import { Course } from "@/core/types/Course";
import DisplayTimetable from "../../DisplayTimetable";
import { useRecoilState, useRecoilValue } from "recoil";
import { useRouter } from "next/navigation";
import { hoverCourseAtomFamily } from "@/core/recoil/hoverCourseAtomFamily";
import { makerTimetableAtom } from "@/core/recoil/makerTimetableAtom";
import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { createMakerTimetable, getMakerTimetable, updateMakerTimetable, updateTimetable } from "@/core/api/AlzartakUnilfeApi";
import ConfigMakerModify from "./ConfigMakerModify";
import { Timetable } from "@/core/types/Timetable";


export default function ConfigMaker() {
    // Router
    const router = useRouter();


    // Recoil
    const hoverCourse = useRecoilValue<Course | null>(hoverCourseAtomFamily("customPage"));
    const [makerTimetable, setMakerTimetable] = useRecoilState<Timetable>(makerTimetableAtom);


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
        getMakerTimetable().then(({ data: storedConfig, message }) => {
            if (storedConfig) {
                setMakerTimetable(storedConfig);
                setIsInitialLoadComplete(true);
            } else {
                const defaultConfig = Timetable.fromObject({
                    id: "",
                    name: "",
                    courses: []
                });
                createMakerTimetable(defaultConfig).then(({ message }) => {
                    if (message === "FAIL") {
                        handleServerError();
                    } else {
                        setMakerTimetable(defaultConfig);
                    }
                    setIsInitialLoadComplete(true);
                })
            }
        });
    }, [handleServerError, router]);


    useEffect(() => {
        if (!isInitialLoadComplete) return;
        updateMakerTimetable(makerTimetable).then(({ message }) => {
            if (message === "FAIL") {
                handleServerError();
            } else {
                if (makerTimetable.getId() !== "") {
                    updateTimetable(makerTimetable);
                }
            }
        });
    }, [handleServerError, router, makerTimetable, isInitialLoadComplete]);


    // Render
    return (
        <div className={styles.wrapper}>
            {isInitialLoadComplete && (
                <div className={styles.timetable__field}>
                    <div className={styles.contents_title}>
                        <ConfigMakerModify />
                    </div>
                    <div className={styles.contents_display}>
                        <DisplayTimetable
                            wishCourses={makerTimetable.getCourses()}
                            previewCourse={hoverCourse}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}