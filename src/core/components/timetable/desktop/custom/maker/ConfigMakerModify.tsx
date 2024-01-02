"use client"

import styles from "./ConfigMakerModify.module.css";
import { useRecoilState } from "recoil";
import { makerTimetableAtom, makerTimetableNameSelector } from "@/core/recoil/makerTimetableAtom";
import { useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';
import { getTimetableAll, saveTimetable } from "@/core/api/AlzartakUnilfeApi";
import { Timetable } from "@/core/types/Timetable";


export default function ConfigMakerModify() {
    // Const
    const ReactSwal = withReactContent(Swal);


    // Recoil
    const [makerTimetable, setMakerTimetable] = useRecoilState<Timetable>(makerTimetableAtom);
    const [configTimetableName, setConfigTimetableName] = useRecoilState(makerTimetableNameSelector);


    // Handler
    const handleNewMakerTimetable = () => {
        saveTimetable(new Timetable("", "새 시간표", [])).then(({ data: { id }, message }) => {
            if (message === "SUCCESS") {
                setMakerTimetable(new Timetable(id, "새 시간표", []));
            };
        })
    }

    const handleLoadTimetable = (timetable: Timetable) => {
        setMakerTimetable(timetable);
        ReactSwal.close();
    };

    const handleLoadSavedTimetables = () => {
        getTimetableAll().then(({ data: timetables, message }) => {
            ReactSwal.fire({
                title: '시간표 목록',
                html: (
                    <div style={{ maxHeight: '350px', overflowY: 'auto', paddingTop: "10px" }}>
                        {timetables.length > 0 ? (
                            <table style={{
                                width: 'calc(100% - 2px)',
                                height: "calc(100% - 2px)",
                                overflow: "hidden",
                                borderRadius: "8px",
                                border: "var(--border-solid)"
                            }}>
                                <tbody>
                                    {timetables.map((timetable, index) => (
                                        <tr key={index}
                                            className={styles.tableRow}
                                            onClick={() => { handleLoadTimetable(timetable) }}
                                        >
                                            <td>{timetable.getName()}</td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        ) : (
                            <p>저장된 시간표가 없습니다.</p>
                        )}
                    </div>
                ),
                width: '500px',
                heightAuto: false,
                buttonsStyling: false,
                customClass: {
                    container: 'swal2-container',
                    popup: 'swal2-popup',
                    title: 'swal2-title',
                    confirmButton: `${styles.btnClose}`,
                },
                confirmButtonText: "닫기"
            })
        });
    };


    // Render
    return (
        <div className={styles.wrapper}>
            <button className={styles.btnReset} onClick={handleNewMakerTimetable}>
                {"새 시간표"}
            </button>
            <input type="text"
                className={styles.textBox}
                placeholder="시간표 이름"
                maxLength={50}
                value={configTimetableName === "새 시간표" ? "" : configTimetableName}
                onChange={(e) => {
                    setConfigTimetableName(e.target.value || "새 시간표")
                }} />
            <button className={styles.btnLoad} onClick={handleLoadSavedTimetables}>
                {"불러오기"}
            </button>
        </div>
    );
}