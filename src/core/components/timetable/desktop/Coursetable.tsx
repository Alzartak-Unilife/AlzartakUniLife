"use client"

import styles from "./Coursetable.module.css";
import useElementDimensions from "@/core/hooks/useElementDimensions";
import { useModal } from "@/core/modules/modal/Modal";
import VirtualizedTable from "@/core/modules/virtualized-table/VirtualizedTable";
import { autoGeneratorConfigAtom } from "@/core/recoil/autoGeneratorConfigAtom";
import { autoHoverCourseAtom } from "@/core/recoil/hoverCourseAtom";
import { autoOfferedCoursesAtom } from "@/core/recoil/offeredCoursesAtom";
import { autoWishCoursesAtom, sortedAutoWishCoursesSelector } from "@/core/recoil/wishCoursesAtom";
import { Course } from "@/core/types/Course";
import { IGeneratorConfig } from "@/core/types/IGeneratorConfig";
import { BreakDays, Breaktime } from "@/core/types/Timetable";
import { useCallback, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";


interface CoursetableProps {
    checkCourseConflict: boolean;
}


export default function Coursetable({ checkCourseConflict }: CoursetableProps) {
    // Const
    const essential = 6;
    const ratings = [essential, 5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1];
    const offeredCourseTableAttributes: string[] = ["\u00A0", "학년/가진급", "교과과정", "학수강좌번호", "교과목명", "교원명", "수업캠퍼스", "강의평점", "학점", "강의종류", "\u00A0"];
    const wishCourseTableAttributes: string[] = ["\u00A0", "학년/가진급", "교과과정", "학수강좌번호", "교과목명", "교원명", "수업캠퍼스", "선호도 설정", "학점", "강의종류", "\u00A0"];


    // Ref
    const courseListTable = useRef<HTMLDivElement>(null);


    // State
    const [displayCourseDetail, setDisplayCourseDetail] = useState<Course | null>(null);


    // Recoil
    const offeredCourse = useRecoilValue<Course[]>(autoOfferedCoursesAtom);
    const setWishCourses = useRecoilState<Course[]>(autoWishCoursesAtom)[1];
    const sortedWishCourses = useRecoilValue<Course[]>(sortedAutoWishCoursesSelector);
    const setHoveredCourse = useRecoilState<Course | null>(autoHoverCourseAtom)[1];
    const autoGeneratorConfig = useRecoilValue<IGeneratorConfig>(autoGeneratorConfigAtom);


    /// Modal 
    const [CourseDetailsModal, openCourseDetailsModal, closeCourseDetailsModal] = useModal("ZOOM");


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
        const selectedIndex = parseInt(e.currentTarget.parentElement?.parentElement?.id || "-1");
        const selectedCourse = offeredCourse[selectedIndex];
        if (setWishCourses) {
            if (checkCourseConflict && sortedWishCourses.some((course) => course.conflictWith(selectedCourse))) {
                alert("기존에 선택한 과목과 시간이 겹칩니다.");
            } else {
                setWishCourses([...sortedWishCourses, selectedCourse.copy()]);
            }
        }
    }, [offeredCourse, sortedWishCourses, setWishCourses]);


    /** 선택된 과목 리스트에서 과목 선택 취소 */
    const handleUnselectCourse = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const selectedIndex = parseInt(e.currentTarget.parentElement?.parentElement?.id || "-1");
        if (setWishCourses) {
            const newWishCourses = sortedWishCourses.filter((course, index) => index !== selectedIndex);
            setWishCourses(newWishCourses);
        }
    }, [sortedWishCourses, setWishCourses]);


    /** 희망 과목 목록에서 과목 선호도 변경 */
    const handleRerateCourse = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRating = parseFloat(e.currentTarget.value);
        const modifiedIndex = parseInt(e.currentTarget.parentElement?.parentElement?.id || "-1");
        const modifiedCourse = sortedWishCourses[modifiedIndex].copy();

        if (newRating === essential) {
            const breakday: BreakDays = BreakDays.fromObject(autoGeneratorConfig.breakDays);
            const breaktimes: Breaktime[] = autoGeneratorConfig.breaktimes.map((breaktimeObject) => Breaktime.fromObject(breaktimeObject));

            const conflictWithbBeakday = modifiedCourse.getSchedules().some((schedule) => breakday.getDay(schedule.getDay()));
            const conflictWithbBeaktime = modifiedCourse.getSchedules().some((schedule) =>
                breaktimes.some((breaktime) => schedule.getDay() === breaktime.getDay() && schedule.getTime().conflictWith(breaktime.getTime())));

            if (conflictWithbBeakday || conflictWithbBeaktime) {
                if (conflictWithbBeakday && conflictWithbBeaktime) {
                    alert("해당 과목은 '요일공강', '공강시간'과 겹치므로 필수과목에 추가할 수 없습니다.");
                } else {
                    alert(`해당 과목은${conflictWithbBeakday ? "'요일공강'" : "'공강시간'"}과 겹치므로 필수과목에 추가할 수 없습니다.`);
                }
                return;
            }
        }
        modifiedCourse.setRating(newRating);

        const newWishCourses = sortedWishCourses.filter((course, index) => index !== modifiedIndex);
        setWishCourses([...newWishCourses, modifiedCourse]);
    }, [sortedWishCourses, setWishCourses, autoGeneratorConfig]);


    /** 과목 상세 정보 */
    const handleCourseDetail = (course: Course) => {
        setDisplayCourseDetail(course);
        openCourseDetailsModal();
    };


    /** 중복 선택 확인 */
    const handleCheckDuplication = useCallback((targetCourse: Course) => {
        return sortedWishCourses.some((course) => course.equalWith(targetCourse));
    }, [sortedWishCourses]);


    // Render
    return (
        <div className={styles.coursetable}>
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
                        &#91;선택한 강의 수: {sortedWishCourses.length}, 학점: {sortedWishCourses.reduce((totalCredit, course) => totalCredit + course.getCredit(), 0)}&#93;
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


                        numRows={sortedWishCourses.length}
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
                            const courses = sortedWishCourses[index];
                            const courseInfo = sortedWishCourses[index].printFormat();
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