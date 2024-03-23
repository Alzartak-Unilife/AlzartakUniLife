"use client"

import styles from "./DisplayCoursetable.module.css";
import useElementDimensions from "@/core/hooks/useElementDimensions";
import VirtualizedTable from "@/core/modules/virtualized-table/VirtualizedTable";
import { makerTimetableAtom, makerTimetableCoursesSelector } from "@/core/recoil/makerTimetableAtom";
import { generatorConfigAtom, generatorConfigWishCoursesSelector } from "@/core/recoil/generatorConfigAtom";
import { hoverCourseAtomFamily } from "@/core/recoil/hoverCourseAtomFamily";
import { offeredCoursesAtomFamily } from "@/core/recoil/offeredCoursesAtomFamily";
import { Course } from "@/core/types/Course";
import { GeneratorConfig } from "@/core/types/GeneratorConfig";
import { useCallback, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Swal from "sweetalert2";
import { Timetable } from "@/core/types/Timetable";
import withReactContent from "sweetalert2-react-content";
import DisplayCourseDetails from "./DisplayCourseDetails";


interface DisplayCoursetableProps {
    pageType: "autoPage" | "customPage"
}


export default function DisplayCoursetable({ pageType }: DisplayCoursetableProps) {
    // Const
    const essential = 6;
    const ratings = [essential, 5, 4, 3, 2, 1];
    const offeredCourseTableAttributes: string[] = ["\u00A0", "학년/가진급", "교과과정", "학수강좌번호", "교과목명", "교원명", "수업캠퍼스", "강의평점", "학점", "강의종류", "\u00A0"];
    const wishCourseTableAttributes: string[] = ["\u00A0", "학년/가진급", "교과과정", "학수강좌번호", "교과목명", "교원명", "수업캠퍼스", "선호도 설정", "학점", "강의종류", "\u00A0"];
    const SwalCourseDetails = withReactContent(Swal);

    // Ref
    const courseListTable = useRef<HTMLDivElement>(null);


    // Recoil
    const offeredCourse = useRecoilValue<Course[]>(offeredCoursesAtomFamily(pageType));
    const [wishCourses, setWishCourses] = useRecoilState(pageType === "autoPage" ? generatorConfigWishCoursesSelector : makerTimetableCoursesSelector);
    const setHoveredCourse = useRecoilState<Course | null>(hoverCourseAtomFamily(pageType))[1];
    const timetableConfig = useRecoilValue<GeneratorConfig | Timetable>(pageType === "autoPage" ? generatorConfigAtom : makerTimetableAtom);


    // Custom Hook
    const courseTableHeight = useElementDimensions(courseListTable, "Pure").height;


    // Handler
    /** 과목 리스트/선택된 과목 리스트에서 마우스가 가리키고 있는 과목 설정 (hover이벤트) */
    const handleHoverCourse = (course: Course | null) => {
        if (setHoveredCourse) {
            // hover된 과목 작은 모달로 시간표 보여줌
            setHoveredCourse(course ? course : null);
        }
    }


    /** 과목 리스트에서 과목 선택 */
    const handleSelectCourse = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (pageType === "autoPage" && wishCourses.length >= 25) {
            Swal.fire({
                heightAuto: false,
                scrollbarPadding: false,
                html: `<h2 style="font-size: 20px; z-index: 2000;">
                            희망 과목은 최대 25개까지 선택 가능합니다.
                        </h2>`,
                icon: 'warning',
                buttonsStyling: false,
                customClass: {
                    confirmButton: `${styles.btnConfirm}`,
                },
                confirmButtonText: '확인',
            })
            return;
        }

        const selectedIndex = parseInt(e.currentTarget.parentElement?.parentElement?.id || "-1");
        const selectedCourse = offeredCourse[selectedIndex];

        if (setWishCourses) {
            if (pageType === "autoPage") {
                setWishCourses([...wishCourses, selectedCourse.copy()]);
            } else {
                const conflictCourses = wishCourses.filter(course => !course.conflictWith(selectedCourse, { baseCode: false, schedule: true }));
                if (conflictCourses.length === wishCourses.length) {
                    setWishCourses([...wishCourses, selectedCourse.copy()]);
                } else {
                    Swal.fire({
                        heightAuto: false,
                        scrollbarPadding: false,
                        html: `<h2 style="font-size: 25px; z-index: 2000;">
                                    '${conflictCourses.map((course) => course.getName()).join(",")}' 수업과 시간이 겹칩니다. 추가하면 기존 수업은 삭제됩니다. 추가하시겠습니까?
                                </h2>`,
                        icon: 'question',
                        showCancelButton: true,
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: `${styles.btnConfirm}`,
                            cancelButton: `${styles.btnCancel}`
                        },
                        confirmButtonText: '추가하기',
                        cancelButtonText: '취소',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            setWishCourses([...conflictCourses, selectedCourse.copy()]);
                        }
                    });
                }
            }
        }
    }, [pageType, offeredCourse, wishCourses, setWishCourses]);


    /** 선택된 과목 리스트에서 과목 선택 취소 */
    const handleUnselectCourse = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const selectedIndex = parseInt(e.currentTarget.parentElement?.parentElement?.id || "-1");
        if (setWishCourses) {
            const newWishCourses = wishCourses.filter((course, index) => index !== selectedIndex);
            setWishCourses(newWishCourses);
            setHoveredCourse(null);
        }
    }, [wishCourses, setWishCourses]);


    /** 희망 과목 목록에서 과목 선호도 변경 */
    const handleRerateCourse = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRating = parseFloat(e.currentTarget.value);
        const modifiedIndex = parseInt(e.currentTarget.parentElement?.parentElement?.id || "-1");
        const modifiedCourse = wishCourses[modifiedIndex].copy();

        if (pageType === "autoPage") {
            if (newRating === essential) {
                const autoConfig = timetableConfig as GeneratorConfig;
                const breakday = autoConfig.getBreakDays();
                const breaktimes = autoConfig.getBreaktimes();

                const conflictWithbBeakday = modifiedCourse.getSchedules().some((schedule) => breakday.isBreakDay(schedule.getDay()));
                const conflictWithbBeaktime = modifiedCourse.getSchedules().some((schedule) =>
                    breaktimes.some((breaktime) => schedule.getDay() === breaktime.getDay() && schedule.getTime().conflictWith(breaktime.getTime())));

                if (conflictWithbBeakday || conflictWithbBeaktime) {
                    const comment = conflictWithbBeakday && conflictWithbBeaktime
                        ? "해당 과목은 요일공강, 일일공강과 겹치므로</br>필수과목에 추가할 수 없습니다."
                        : `해당 과목은 ${conflictWithbBeakday ? "요일공강" : "일일공강"}과 겹치므로</br>필수과목에 추가할 수 없습니다.`
                    Swal.fire({
                        heightAuto: false,
                        scrollbarPadding: false,
                        html: `<h2 style="font-size: 20px; user-select: none;">${comment}</h2>`,
                        icon: 'error',
                        confirmButtonText: '<span style="font-size: 15px; user-select: none;">닫기</span>',
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: `${styles.btnConfirm}`,
                            cancelButton: `${styles.btnCancel}`
                        },
                    })
                    return;
                }
            }
        }

        modifiedCourse.setRating(newRating);

        const newWishCourses = wishCourses.filter((course, index) => index !== modifiedIndex);
        setWishCourses([...newWishCourses, modifiedCourse]);
    }, [pageType, wishCourses, setWishCourses, timetableConfig]);


    /** 과목 상세 정보 */
    const handleCourseDetail = (course: Course) => {
        SwalCourseDetails.fire({
            title: '과목 정보',
            html: <DisplayCourseDetails course={course} />,
            width: "80vw",
            buttonsStyling: false,
            customClass: {
                confirmButton: `${styles.btnConfirm}`,
            },
            confirmButtonText: '확인'
        });
    };


    /** 중복 선택 확인 */
    const handleCheckDuplication = useCallback((targetCourse: Course) => {
        return wishCourses.some((course) => course.equalWith(targetCourse));
    }, [wishCourses]);


    // Render
    return (
        <div className={styles.wrapper}>
            <div className={styles.course_list}>
                <div className={styles.course_list__table_info}>
                    <div className={styles.course_list__title}>강의 시간표 목록</div>
                    <div className={styles.course_list__count}>&#91;검색된 강의 수: {offeredCourse.length}&#93;</div>
                </div>

                <div className={styles.course_list__table} ref={courseListTable}>
                    <VirtualizedTable
                        windowHeight={courseTableHeight - 2}
                        tableStyle={{
                            height: "calc(100% - 2px)",
                            width: "calc(100% - 2px)",
                            overflow: "hidden",
                            borderRadius: "8px",
                            border: "var(--border-solid)"
                        }}


                        headerHeight={30}
                        headerStyle={{
                            default: {
                                backgroundColor: "var(--table-attribute-background)",
                            },
                        }}
                        attributeWidths={[
                            { width: "70px" },
                            { width: "110px" },
                            { width: "130px" },
                            { width: "130px" },
                            { width: "calc(100% - 1115px - 5px)", minWidth: "200px" },
                            { width: "190px" },
                            { width: "105px" },
                            { width: "110px" },
                            { width: "50px" },
                            { width: "140px" },
                            { width: "80px" },
                        ]}
                        attributeStyle={{
                            default: {
                                borderLeft: "var(--border-solid)",
                                borderBottom: "var(--border-solid)",
                                userSelect: "none",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "calc(30px - 2px)",
                            },
                            hover: {
                                backgroundColor: "var(--main-color-light)",
                            }
                        }}
                        renderHeader={({ index, attributeClassName: columnClassName, attributeStyle: columnStyle }) => {
                            return (
                                <div key={index} className={columnClassName} style={{ ...columnStyle, ...(index === 0 && { borderLeft: "0px" }) }}>
                                    {offeredCourseTableAttributes[index]}
                                </div>
                            );
                        }}


                        numRows={offeredCourse.length}
                        rowHeight={30}
                        rowStyle={{
                            default: {
                                backgroundColor: "var(--sub-color)",
                            },
                            hover: {
                                backgroundColor: "var(--main-color-light-light)",
                            }
                        }}
                        cellStyle={{
                            default: {
                                borderLeft: "var(--border-solid)",
                                userSelect: "none",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                            },
                            hover: {
                                backgroundColor: "var(--main-color-light)",
                            }
                        }}
                        renderRows={({ index, rowClassName, rowStyle, cellClassName, cellStyles }) => {
                            const courseInfo = offeredCourse[index].printFormat();
                            return (
                                <div key={index} id={`${index}`} className={rowClassName} style={rowStyle}
                                    onMouseOver={() => { handleHoverCourse(offeredCourse[index]); }}
                                    onMouseOut={() => { handleHoverCourse(null); }}
                                >
                                    <div className={cellClassName} style={{ ...cellStyles[0], borderLeft: "0px" }}>
                                        <button className={styles.course_list__positive_button} disabled={handleCheckDuplication(offeredCourse[index])} onClick={handleSelectCourse}>
                                            {"선택"}
                                        </button>
                                    </div>
                                    <div className={cellClassName} style={cellStyles[1]}>{courseInfo.grades}</div>
                                    <div className={cellClassName} style={cellStyles[2]}>{courseInfo.curriculum}</div>
                                    <div className={cellClassName} style={cellStyles[3]}>{courseInfo.code}</div>
                                    <div className={cellClassName} style={cellStyles[4]}>{courseInfo.name}</div>
                                    <div className={cellClassName} style={cellStyles[5]} onClick={(e) => {
                                        console.log(courseInfo)
                                    }}>{courseInfo.professor}</div>
                                    <div className={cellClassName} style={cellStyles[6]}>{courseInfo.campus}</div>
                                    <div className={cellClassName} style={cellStyles[7]}>{courseInfo.evaluation}</div>
                                    <div className={cellClassName} style={cellStyles[8]}>{courseInfo.credit}</div>
                                    <div className={cellClassName} style={cellStyles[9]}>{courseInfo.lectureCategory}</div>
                                    <div className={cellClassName} style={cellStyles[10]}>
                                        <button className={styles.course_list__button} onClick={() => handleCourseDetail(offeredCourse[index])}>
                                            {"상세정보"}
                                        </button>
                                    </div>
                                </div>
                            );
                        }}
                    />
                </div>
            </div>

            <br />

            <div className={styles.course_list}>
                <div className={styles.course_list__table_info}>
                    <div className={styles.course_list__title}>희망 시간표 목록</div>
                    <div className={styles.course_list__count}>
                        &#91;선택한 강의 수: {wishCourses.length}, 학점: {wishCourses.reduce((totalCredit, course) => totalCredit + course.getCredit(), 0)}&#93;
                    </div>
                </div>
                <div className={styles.course_list__table}>
                    <VirtualizedTable
                        windowHeight={courseTableHeight - 2}
                        tableStyle={{
                            height: "calc(100% - 2px)",
                            width: "calc(100% - 2px)",
                            overflow: "hidden",
                            borderRadius: "8px",
                            border: "var(--border-solid)"
                        }}


                        headerHeight={30}
                        headerStyle={{
                            default: {
                                backgroundColor: "var(--table-attribute-background)",
                            },
                        }}
                        attributeWidths={[
                            { width: "70px" },
                            { width: "110px" },
                            { width: "130px" },
                            { width: "130px" },
                            { width: "calc(100% - 1115px - 5px)", minWidth: "200px" },
                            { width: "190px" },
                            { width: "105px" },
                            { width: "110px" },
                            { width: "50px" },
                            { width: "140px" },
                            { width: "80px" },
                        ]}
                        attributeStyle={{
                            default: {
                                borderLeft: "var(--border-solid)",
                                borderBottom: "var(--border-solid)",
                                userSelect: "none",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "calc(30px - 2px)",
                            },
                            hover: {
                                backgroundColor: "var(--main-color-light)",
                            }
                        }}
                        renderHeader={({ index, attributeClassName: columnClassName, attributeStyle: columnStyle }) => {
                            return (
                                <div key={index} className={columnClassName} style={{ ...columnStyle, ...(index === 0 && { borderLeft: "0px" }) }}>
                                    {wishCourseTableAttributes[index]}
                                </div>
                            );
                        }}


                        numRows={wishCourses.length}
                        rowHeight={30}
                        rowStyle={{
                            default: {
                                backgroundColor: "var(--sub-color)",
                            },
                            hover: {
                                backgroundColor: "var(--main-color-light-light)",
                            }
                        }}
                        cellStyle={{
                            default: {
                                borderLeft: "var(--border-solid)",
                                userSelect: "none",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                            },
                            hover: {
                                backgroundColor: "var(--main-color-light)",
                            }
                        }}
                        renderRows={({ index, rowClassName, rowStyle, cellClassName, cellStyles }) => {
                            const courses = wishCourses[index];
                            const courseInfo = wishCourses[index].printFormat();
                            return (
                                <div key={index} id={`${index}`} className={rowClassName} style={rowStyle}
                                    onMouseOver={() => { handleHoverCourse(courses) }}
                                    onMouseOut={() => { handleHoverCourse(null); }}
                                >
                                    <div className={cellClassName} style={{ ...cellStyles[0], borderLeft: "0px" }}>
                                        <button className={styles.course_list__nagative_button} onClick={handleUnselectCourse}>
                                            {"취소"}
                                        </button>
                                    </div>
                                    <div className={cellClassName} style={cellStyles[1]}>{courseInfo.grades}</div>
                                    <div className={cellClassName} style={cellStyles[2]}>{courseInfo.curriculum}</div>
                                    <div className={cellClassName} style={cellStyles[3]}>{courseInfo.code}</div>
                                    <div className={cellClassName} style={cellStyles[4]}>{courseInfo.name}</div>
                                    <div className={cellClassName} style={cellStyles[5]} onClick={(e) => {
                                        console.log(courseInfo)
                                    }}>{courseInfo.professor}</div>
                                    <div className={cellClassName} style={cellStyles[6]}>{courseInfo.campus}</div>
                                    <div className={cellClassName} style={cellStyles[7]}>
                                        <select
                                            value={courses.getRating().toFixed(2)}
                                            onChange={handleRerateCourse}
                                            style={{
                                                backgroundColor: "transparent",
                                                fontSize: "16px",
                                                height: "100%",
                                                width: "calc(100% - 10px)",
                                                paddingLeft: "10px",
                                                textAlign: "center"
                                            }}>
                                            {[courses.getEvaluation(), ...ratings].sort((a, b) => b - a).map((rating, index) =>
                                                <option
                                                    key={index}
                                                    value={rating.toFixed(2)}
                                                    style={courses.getEvaluation() === rating ? { backgroundColor: "var(--main-color-light)" } : {}}>
                                                    {rating === essential ? "필수" : rating.toFixed(2)}
                                                </option>
                                            )}
                                        </select>
                                    </div>
                                    <div className={cellClassName} style={cellStyles[8]}>{courseInfo.credit}</div>
                                    <div className={cellClassName} style={cellStyles[9]}>{courseInfo.lectureCategory}</div>
                                    <div className={cellClassName} style={cellStyles[10]}>
                                        <button className={styles.course_list__button} onClick={() => handleCourseDetail(courses)}>
                                            {"상세정보"}
                                        </button>
                                    </div>
                                </div>
                            );
                        }}
                    />
                </div>
            </div>



        </div>
    );
}



/*
            {displayCourseDetail && (
                <CourseDetailsModal>
                    <CourseDetails course={detailedCourse} onClose={closeCourseDetailsModal} />
                </CourseDetailsModal>
            )}
*/