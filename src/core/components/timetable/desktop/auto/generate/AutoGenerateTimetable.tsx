"use client"

import useElementDimensions from "@/core/hooks/useElementDimensions";
import styles from "./AutoGenerateTimetable.module.css";
import { useEffect, useRef, useState } from "react";
import DisplayTimetable from "./DisplayTimetable";
import { useRecoilValue } from "recoil";
import { IGeneratorConfig } from "@/core/types/IGeneratorConfig";
import { autoGeneratorConfigAtom } from "@/core/recoil/autoGeneratorConfigAtom";
import { Course } from "@/core/types/Course";
import { generateTimetables } from "@/core/api/AlzartakUnilfeApi";
import CircularProgressOverlay from "@/core/modules/circular-progress-overlay/CircularProgressOverlay";


export default function AutoGenerateTimetable() {
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
    const [timetables, setTimetables] = useState<Course[][]>([]);


    // Recoil
    const autoGeneratorConfig = useRecoilValue<IGeneratorConfig>(autoGeneratorConfigAtom);


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
        (async () => {
            if (timetableDisplayCount > 0) {
                setIsLoading(true);
                setProcessPercentage(0);
                setProcessDescription(0);

                const apiPercentageInterval = setInterval(() => {
                    setProcessPercentage(prevPercentage => {
                        if (prevPercentage >= 80) {
                            clearInterval(apiPercentageInterval);
                            return prevPercentage;
                        }
                        return prevPercentage + (80.0 / 150.0);
                    });
                    setProcessDescription(prevDescription => {
                        return (prevDescription + 0.2) % 4;
                    });
                }, 100);

                const { data: genTimetables, message } = await generateTimetables(autoGeneratorConfig);

                clearInterval(apiPercentageInterval);
                setProcessPercentage(80);

                const setProgress = setInterval(() => {
                    setProcessPercentage(prevPercentage => {
                        if (prevPercentage >= 100) {
                            clearInterval(setProgress);
                            setIsLoading(false);
                            return 0;
                        }
                        return Math.round(prevPercentage + 3);
                    });
                    setProcessDescription(prevDescription => {
                        return (prevDescription + 0.2) % 4;
                    });
                }, 100);

                if (message === "SUCCESS" && genTimetables.length > 0) {
                    if (genTimetables.length % timetableDisplayCount !== 0) {
                        for (let i = ((Math.floor(genTimetables.length / timetableDisplayCount) + 1) * timetableDisplayCount) - genTimetables.length; i > 0; i--)
                            genTimetables.push([]);
                    }
                    setTimetables(genTimetables);
                } else {

                }
            }
        })()
    }, [timetableDisplayCount, autoGeneratorConfig]);

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
        <div className={styles.autoGenerateTimetable} ref={autoGenerateTimetable}>
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

            {timetables.length > 0 ? (<>
                <div className={styles.display_timetable}>
                    <DisplayTimetable
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
            </>) : (<>

            </>)}
        </div>
    );
}

//AutoGenerateTimetable