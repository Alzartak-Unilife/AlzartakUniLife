"use client"

import styles from "./Coursetable.module.css";
import useElementDimensions from "@/core/hooks/useElementDimensions";
import { useModal } from "@/core/modules/modal/Modal";
import VirtualizedTable from "@/core/modules/virtualized-table/VirtualizedTable";
import { autoHoverCourseAtom } from "@/core/recoil/hoverCourseAtom";
import { autoOfferedCoursesAtom } from "@/core/recoil/offeredCoursesAtom";
import { autoWishCoursesAtom, sortedAutoWishCoursesSelector } from "@/core/recoil/wishCoursesAtom";
import { Course } from "@/core/types/Course";
import { useCallback, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";


interface CoursetableProps {
    checkCourseConflict: boolean;
}


export default function Coursetable({ checkCourseConflict }: CoursetableProps) {
    // Const
    const ratings = [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1];


    // Ref
    const courseListTable = useRef<HTMLDivElement>(null);


    // State
    const [displayCourseDetail, setDisplayCourseDetail] = useState<Course | null>(null);


    // Recoil
    const [offeredCourse, setOfferedCourse] = useRecoilState<Course[]>(autoOfferedCoursesAtom);
    const setWishCourses = useRecoilState<Course[]>(autoWishCoursesAtom)[1];
    const sortedWishCourses = useRecoilValue<Course[]>(sortedAutoWishCoursesSelector);
    const [hoveredCourse, setHoveredCourse] = useRecoilState<Course | null>(autoHoverCourseAtom);


    /// Modal 
    const [CourseDetailsModal, openCourseDetailsModal, closeCourseDetailsModal] = useModal("ZOOM");


    // Custom Hook
    const courseTableHeight = useElementDimensions(courseListTable, "Pure").height;


    /** 테이블 헤더 설정  */
    const offeredCourseTableColumns: { name: string, style: React.CSSProperties }[] = [
        { name: "\u00A0", style: { width: "70px" } },
        { name: "학년/가진급", style: { width: "110px" } },
        { name: "교과과정", style: { width: "130px" } },
        { name: "학수강좌번호", style: { width: "130px" } },
        { name: "교과목명", style: { width: "calc(100% - 1115px - 5px)" } },
        { name: "교원명", style: { width: "190px" } },
        { name: "수업캠퍼스", style: { width: "105px" } },
        { name: "강의평점", style: { width: "110px" } },
        { name: "학점", style: { width: "50px" } },
        { name: "강의종류", style: { width: "140px" } },
        { name: "\u00A0", style: { width: "80px" } },
    ];

    const wishCourseTableColumns: { name: string, style: React.CSSProperties }[] = [
        { name: "\u00A0", style: { width: "70px" } },
        { name: "학년/가진급", style: { width: "110px" } },
        { name: "교과과정", style: { width: "130px" } },
        { name: "학수강좌번호", style: { width: "130px" } },
        { name: "교과목명", style: { width: "calc(100% - 1115px - 5px)" } },
        { name: "교원명", style: { width: "190px" } },
        { name: "수업캠퍼스", style: { width: "105px" } },
        { name: "선호도 설정", style: { width: "110px" } },
        { name: "학점", style: { width: "50px" } },
        { name: "강의종류", style: { width: "140px" } },
        { name: "\u00A0", style: { width: "80px" } },
    ];


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
        const modifiedIndex = parseInt(e.currentTarget.parentElement?.parentElement?.id || "-1");
        const modifiedCourse = sortedWishCourses[modifiedIndex].copy();
        modifiedCourse.setRating(parseFloat(e.currentTarget.value));

        const newWishCourses = sortedWishCourses.filter((course, index) => index !== modifiedIndex);
        setWishCourses([...newWishCourses, modifiedCourse]);
    }, [sortedWishCourses, setWishCourses]);


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
                        tableStyles={{
                            height: "calc(100% - 2px)",
                            width: "calc(100% - 2px)",
                            overflow: "hidden",
                            borderRadius: "8px",
                            border: "var(--border-solid)"
                        }}

                        numColumns={offeredCourseTableColumns.length}
                        columnHeight={30}
                        columnWidths={offeredCourseTableColumns.map((column) => column.style)}
                        columnStyles={{
                            userSelect: "none",
                            backgroundColor: "var(--table-attribute-background)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "calc(30px - 2px)",
                            borderLeft: "var(--border-solid)",
                            borderBottom: "var(--border-solid)",
                        }}
                        renderColumns={({ index, columnClassName, columnStyle }) => {
                            return (
                                <div key={index} className={columnClassName} style={{
                                    ...columnStyle,
                                    ...(index === 7 ? { backgroundColor: "var(--main-color-light)" } : {})
                                }}>
                                    {offeredCourseTableColumns[index].name}
                                </div>
                            );
                        }}

                        numRows={offeredCourse.length}
                        rowHeight={30}
                        rowStyles={{
                            default: {
                                userSelect: "none",
                                backgroundColor: "var(--table-row-background)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                            }
                        }}
                        renderRows={({ index, rowClassName, rowStyle, itemClassName, itemStyles }) => {
                            const courseInfo = offeredCourse[index].printFormat();
                            return (
                                <div key={index} id={`${index}`} className={rowClassName} style={rowStyle}
                                    onMouseOver={() => { handleHoverCourse(offeredCourse[index]); }}
                                    onMouseOut={() => { handleHoverCourse(null); }}
                                >
                                    <div className={itemClassName} style={itemStyles[0]}>
                                        <button className={styles.course_list__positive_button} disabled={handleCheckDuplication(offeredCourse[index])} onClick={(e) => {
                                            handleSelectCourse(e);
                                            handleHoverCourse(null);
                                        }}>
                                            {"선택"}
                                        </button>
                                    </div>
                                    <div className={itemClassName} style={itemStyles[1]}>{courseInfo.grades}</div>
                                    <div className={itemClassName} style={itemStyles[2]}>{courseInfo.curriculum}</div>
                                    <div className={itemClassName} style={itemStyles[3]}>{courseInfo.code}</div>
                                    <div className={itemClassName} style={itemStyles[4]}>{courseInfo.name}</div>
                                    <div className={itemClassName} style={itemStyles[5]} onClick={(e) => {
                                        console.log(courseInfo)
                                    }}>{courseInfo.professor}</div>
                                    <div className={itemClassName} style={itemStyles[6]}>{courseInfo.campus}</div>
                                    <div className={itemClassName} style={{
                                        ...itemStyles[7],
                                        backgroundColor: "var(--main-color-light-light)"
                                    }}>{courseInfo.evaluation}</div>
                                    <div className={itemClassName} style={itemStyles[8]}>{courseInfo.credit}</div>
                                    <div className={itemClassName} style={itemStyles[9]}>{courseInfo.lectureCategory}</div>
                                    <div className={itemClassName} style={itemStyles[10]}>
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
                        tableStyles={{
                            height: "calc(100% - 2px)",
                            width: "calc(100% - 2px)",
                            overflow: "hidden",
                            borderRadius: "8px",
                            border: "var(--border-solid)"
                        }}

                        numColumns={wishCourseTableColumns.length}
                        columnHeight={30}
                        columnStyles={{
                            userSelect: "none",
                            backgroundColor: "var(--table-attribute-background)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "calc(30px - 2px)",
                            borderLeft: "var(--border-solid)",
                            borderBottom: "var(--border-solid)",
                        }}
                        columnWidths={wishCourseTableColumns.map((column) => column.style)}
                        renderColumns={({ index, columnClassName, columnStyle }) => {
                            return (
                                <div key={index} className={columnClassName} style={{
                                    ...columnStyle,
                                    ...(index === 7 ? { backgroundColor: "var(--main-color-light)" } : {})
                                }}>
                                    {wishCourseTableColumns[index].name}
                                </div>
                            );
                        }}

                        numRows={sortedWishCourses.length}
                        rowHeight={30}
                        rowStyles={{
                            default: {
                                userSelect: "none",
                                backgroundColor: "var(--table-row-background)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                            }
                        }}
                        renderRows={({ index, rowClassName, rowStyle, itemClassName, itemStyles }) => {
                            const courses = sortedWishCourses[index];
                            const courseInfo = sortedWishCourses[index].printFormat();
                            return (
                                <div key={index} id={`${index}`} className={rowClassName} style={rowStyle}
                                    onMouseOver={() => { handleHoverCourse(courses) }}
                                    onMouseOut={() => { handleHoverCourse(null); }}
                                >
                                    <div className={itemClassName} style={itemStyles[0]}>
                                        <button className={styles.course_list__nagative_button} onClick={(e) => {
                                            handleUnselectCourse(e);
                                            handleHoverCourse(null);
                                        }}>
                                            {"취소"}
                                        </button>
                                    </div>
                                    <div className={itemClassName} style={itemStyles[1]}>{courseInfo.grades}</div>
                                    <div className={itemClassName} style={itemStyles[2]}>{courseInfo.curriculum}</div>
                                    <div className={itemClassName} style={itemStyles[3]}>{courseInfo.code}</div>
                                    <div className={itemClassName} style={itemStyles[4]}>{courseInfo.name}</div>
                                    <div className={itemClassName} style={itemStyles[5]}>{courseInfo.professor}</div>
                                    <div className={itemClassName} style={itemStyles[6]}>{courseInfo.campus}</div>
                                    <div className={itemClassName} style={{
                                        ...itemStyles[7],
                                        backgroundColor: "var(--main-color-light-light)"
                                    }}>
                                        <select value={courses.getRating().toFixed(2)} onChange={handleRerateCourse}
                                            style={{
                                                backgroundColor: "transparent",
                                                fontSize: "16px",
                                                height: "100%",
                                                width: "calc(100% - 10px)",
                                                paddingLeft: "10px",
                                                textAlign: "center"
                                            }}>
                                            {[courses.getEvaluation(), ...ratings].sort((a, b) => b - a).map((rating, index) =>
                                                <option key={index} style={courses.getEvaluation() === rating ? { backgroundColor: "var(--main-color-light)" } : {}}>
                                                    {rating.toFixed(2)}
                                                </option>
                                            )}
                                        </select>
                                    </div>
                                    <div className={itemClassName} style={itemStyles[8]}>{courseInfo.credit}</div>
                                    <div className={itemClassName} style={itemStyles[9]}>{courseInfo.lectureCategory}</div>
                                    <div className={itemClassName} style={itemStyles[10]}>
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