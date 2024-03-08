"use client"

import useElementDimensions from "@/core/hooks/useElementDimensions";
import styles from "./ManageGeneratedTimetable.module.css";
import { useEffect, useRef, useState } from "react";
import DisplayGeneratedTimetable from "./DisplayGeneratedTimetable";
import { useRecoilValue } from "recoil";
import { GeneratorConfig } from "@/core/types/GeneratorConfig";
import { generatorConfigAtom } from "@/core/recoil/generatorConfigAtom";
import { Course } from "@/core/types/Course";
import { generateTimetables } from "@/core/api/AlzartakUnilfeApi";
import CircularProgressOverlay from "@/core/modules/circular-progress-overlay/CircularProgressOverlay";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { TimetableGenerator } from "@/core/systems/timetable-generator/TimetableGenerator";


export default function ManageGeneratedTimetable() {
    // Const
    const router = useRouter();


    // Ref
    const autoGenerateTimetable = useRef<HTMLDivElement>(null);


    // State
    const [isLoading, setIsLoading] = useState(false);
    const [processPercentage, setProcessPercentage] = useState<number>(0);
    const [processDescription, setProcessDescription] = useState<number>(0);
    const [timetableDisplayCount, setTimetableDisplayCount] = useState<number>(0);
    const [pageDisplayCount, setPageDisplayCount] = useState<number>(5);
    const [maxPageIndex, setMaxPageIndex] = useState<number>(0);
    const [currPageIndex, setCurrPageIndex] = useState<number>(0);
    const [orignTimetables, setOrignTimetables] = useState<Course[][]>([]);
    const [timetables, setTimetables] = useState<Course[][]>([]);


    // Recoil
    const generatorConfig = useRecoilValue<GeneratorConfig>(generatorConfigAtom);


    // Custom Hook
    const autoGenerateTimetableWidth = useElementDimensions(autoGenerateTimetable, "Pure").width;


    // Handler
    const getCurrentPageTimetables = () => {
        const startIndex = currPageIndex * timetableDisplayCount;
        const endIndex = Math.min(startIndex + timetableDisplayCount, timetables.length);
        return timetables.slice(startIndex, endIndex);
    }


    // Effect
    useEffect(() => {
        setTimetableDisplayCount(Math.floor(autoGenerateTimetableWidth / 600));
    }, [autoGenerateTimetableWidth]);

    useEffect(() => {
        setIsLoading(true);
        setProcessPercentage(0);
        setProcessDescription(0);

        const apiProgressInterval = setInterval(() => {
            setProcessPercentage(prevPercentage => {
                if (prevPercentage >= 80) {
                    clearInterval(apiProgressInterval);
                    return prevPercentage;
                }
                return prevPercentage + (80.0 / 150.0);
            });
            setProcessDescription(prevDescription => {
                return (prevDescription + 0.2) % 4;
            });
        }, 100);

        new TimetableGenerator(generatorConfig.toObject()).getCourseCombination(0, 1000).then(genTimetables => {
            setProcessPercentage(80);

            const setProgress = setInterval(() => {
                setProcessPercentage(prevPercentage => {
                    if (prevPercentage >= 100) {
                        clearInterval(setProgress);
                        setIsLoading(false);
                        return 0;
                    }
                    return Math.round(prevPercentage + 5);
                });
                setProcessDescription(prevDescription => {
                    return (prevDescription + 0.2) % 4;
                });
            }, 100);

            if (genTimetables.length > 0) {
                setOrignTimetables(genTimetables);
            } else {
                Swal.fire({
                    heightAuto: false,
                    scrollbarPadding: false,
                    html: '<h2 style="font-size: 20px; user-select: none;">생성된 시간표가 없습니다</h2>',
                    icon: 'error',
                    buttonsStyling: false,
                    customClass: {
                        confirmButton: `${styles.btnConfirm}`,
                        cancelButton: `${styles.btnCancel}`
                    },
                    confirmButtonText: '<span style="font-size: 15px; user-select: none;">설정 페이지로 돌아가기</span>',
                    didClose() { router.replace("./setting") },
                    didOpen() { router.prefetch("./setting") }
                })
            }

        });
    }, [setIsLoading, setProcessPercentage, setProcessDescription, generatorConfig, setOrignTimetables]);


    useEffect(() => {
        if (orignTimetables.length > 0) {
            const dummyTimetables: Course[][] = [];
            if (orignTimetables.length % timetableDisplayCount !== 0) {
                for (let i = ((Math.floor(orignTimetables.length / timetableDisplayCount) + 1) * timetableDisplayCount) - orignTimetables.length; i > 0; i--)
                    dummyTimetables.push([]);
            }
            setTimetables([...orignTimetables, ...dummyTimetables]);
        }
    }, [timetableDisplayCount, orignTimetables, setTimetables])


    useEffect(() => {
        if (timetables.length > 0 && timetableDisplayCount > 0) {
            setMaxPageIndex((Math.floor(timetables.length / timetableDisplayCount) + ((timetables.length % timetableDisplayCount) !== 0 ? 1 : 0)) - 1);
        }
    }, [timetableDisplayCount, timetables]);


    useEffect(() => {
        if (maxPageIndex < currPageIndex) {
            setCurrPageIndex(maxPageIndex);
        }
    }, [maxPageIndex, currPageIndex]);


    // Render
    return (
        <div className={styles.wrapper} ref={autoGenerateTimetable}>
            {isLoading &&
                <CircularProgressOverlay
                    percentage={Math.min(100, processPercentage)}
                    description={`시간표 생성 중${".".repeat(Math.floor(processDescription))}`}
                    trailColor={"var(--main-color-light-light)"}
                    pathColor={"var(--main-color)"}
                    textColor={"var(--main-color)"}
                    textSize={20}
                />
            }

            {timetables.length > 0 && (<>
                <div className={styles.display_timetable}>
                    <DisplayGeneratedTimetable
                        timetableIdx={currPageIndex * timetableDisplayCount + 1}
                        timetables={getCurrentPageTimetables()}
                    />
                </div>
                <div className={styles.page_select}>
                    <button className={styles.page_index_move_button} onClick={() => { setCurrPageIndex(0) }}>{"«"}</button>
                    <button className={styles.page_index_move_button} onClick={() => {
                        setCurrPageIndex(Math.max(0, currPageIndex - pageDisplayCount))
                    }}>{"‹"}</button>
                    {Array.from(
                        { length: Math.min(pageDisplayCount, maxPageIndex - (Math.floor(currPageIndex / pageDisplayCount) * pageDisplayCount) + 1) },
                        (_, idx) => (Math.floor(currPageIndex / pageDisplayCount) * pageDisplayCount) + idx
                    ).map((pageIndex) =>
                        <button
                            className={[styles.page_index_button, `${currPageIndex === pageIndex ? [styles.curr_page_index_button] : []}`].join(' ')}
                            key={pageIndex}
                            value={pageIndex}
                            onClick={(e) => setCurrPageIndex(pageIndex)}
                        >
                            {pageIndex + 1}
                        </button>)}
                    <button className={styles.page_index_move_button} onClick={() => {
                        setCurrPageIndex(Math.min(maxPageIndex, currPageIndex + pageDisplayCount))
                    }}>{"›"}</button>
                    <button className={styles.page_index_move_button} onClick={() => { setCurrPageIndex(maxPageIndex) }}>{"»"}</button>
                </div>
            </>)}
        </div>
    );
}