"use client"

import { Course } from "@/core/types/Course";
import styles from "./DisplayGeneratedTimetable.module.css";
import DisplayTimetable from "../../DisplayTimetable";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { saveTimetable, updateMakerTimetable } from "@/core/api/AlzartakUnilfeApi";
import { Timetable } from "@/core/types/Timetable";


interface DisplayGeneratedTimetableProps {
    timetableIdx: number;
    timetables: Course[][];
}

export default function DisplayGeneratedTimetable({ timetableIdx, timetables }: DisplayGeneratedTimetableProps) {
    // Const
    const router = useRouter();


    // Handler
    const getDateTime = () => {
        const now = new Date();
        const koreanTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (9 * 3600000));
        const year = koreanTime.getFullYear();
        const month = String(koreanTime.getMonth() + 1).padStart(2, '0');
        const day = String(koreanTime.getDate()).padStart(2, '0');
        const hours = String(koreanTime.getHours()).padStart(2, '0');
        const minutes = String(koreanTime.getMinutes()).padStart(2, '0');
        const seconds = String(koreanTime.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}, ${hours}:${minutes}:${seconds}`;
    }

    const handleEditTimetable = (id: string, name: string, courses: Course[]) => {
        updateMakerTimetable(new Timetable(id, name, courses)).then(({ message }) => {
            if (message === "SUCCESS") {
                Swal.close();
                window.open("../custom/maker", '_blank');
            } else {
                Swal.fire({
                    heightAuto: false,
                    scrollbarPadding: false,
                    html: `<h2 style="font-size: 25px;">알 수 없는 이유로 페이지 이동에 실패하였습니다</h2>`,
                    icon: 'error',
                    buttonsStyling: false,
                    customClass: {
                        confirmButton: `${styles.btnConfirm}`,
                    },
                    confirmButtonText: '확인',
                });
            }
        })
    }

    const handleSelectTimtable = (courses: Course[]) => {
        Swal.fire({
            heightAuto: false,
            scrollbarPadding: false,
            html: `<h2 style="font-size: 25px; z-index: 2000;">이 시간표를 저장하시겠습니까?</h2>`,
            icon: 'question',
            showCancelButton: true,
            buttonsStyling: false,
            customClass: {
                confirmButton: `${styles.btnConfirm}`,
                cancelButton: `${styles.btnCancel}`
            },
            confirmButtonText: '예',
            cancelButtonText: '아니오',

        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    heightAuto: false,
                    scrollbarPadding: false,
                    html: `<h2 style="font-size: 25px; z-index: 2000;">시간표 이름</h2>`,
                    input: "text",
                    inputValue: `${getDateTime()}에 생성한 시간표`,
                    showCancelButton: true,
                    buttonsStyling: false,
                    customClass: {
                        confirmButton: `${styles.btnConfirm}`,
                        cancelButton: `${styles.btnCancel}`
                    },
                    confirmButtonText: '확인',
                    cancelButtonText: '취소',
                    didOpen: () => {
                        const inputElement = Swal.getInput();
                        if (inputElement) {
                            inputElement.select();
                        }
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        const timetableName = result.value as string;
                        Swal.fire({
                            title: '처리 중...',
                            html: '잠시만 기다려 주세요.',
                            allowOutsideClick: false,
                            didOpen: () => {
                                Swal.showLoading();
                            }
                        });

                        saveTimetable(new Timetable("", timetableName, courses)).then(({ data: { id }, message }) => {
                            if (message === "SUCCESS") {
                                Swal.fire({
                                    heightAuto: false,
                                    scrollbarPadding: false,
                                    html: `<h2 style="font-size: 25px;">시간표를 저장하였습니다</h2>`,
                                    icon: 'success',
                                    showCancelButton: true,
                                    buttonsStyling: false,
                                    customClass: {
                                        confirmButton: `${styles.btnConfirm}`,
                                        cancelButton: `${styles.btnOkAndModify}`
                                    },
                                    confirmButtonText: '확인',
                                    cancelButtonText: '시간표 편집 하기',
                                }).then((result) => {
                                    if (result.dismiss === Swal.DismissReason.cancel) {
                                        handleEditTimetable(id, timetableName, courses);
                                    }
                                });
                            } else {
                                Swal.fire({
                                    heightAuto: false,
                                    scrollbarPadding: false,
                                    html: `<h2 style="font-size: 25px;">시간표 저장을 실패하였습니다</h2>`,
                                    icon: 'error',
                                    buttonsStyling: false,
                                    customClass: {
                                        confirmButton: `${styles.btnConfirm}`,
                                    },
                                    confirmButtonText: '확인',
                                });
                            }
                        })
                    }
                });
            }
        })
    };


    // Render
    return (
        <div className={styles.wrapper}>
            {timetables.map((courses, idx) => {
                return (
                    <div key={idx} className={styles.timetable_field}>
                        <div className={styles.timetable_title}>
                            {courses.length > 0 && <div>
                                {`시간표${timetableIdx + idx} [${courses.reduce((sum, course) => sum + course.getCredit(), 0)}학점]`}
                            </div>}
                        </div>

                        <div className={styles.timetable_body}>
                            <DisplayTimetable
                                wishCourses={courses}
                            />
                        </div>

                        <div className={styles.timetable_select}>
                            {courses.length > 0 && <>
                                <button className={styles.btnSave} onClick={() => { handleSelectTimtable(courses); }}>
                                    시간표 저장
                                </button>
                            </>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}


/*
    height: 30px;
    width: 100%;
    margin-top: 10px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-weight: 600;
    color: var(--main-color);
*/