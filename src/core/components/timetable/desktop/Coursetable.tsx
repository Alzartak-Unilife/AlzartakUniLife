"use client"

import styles from "./Coursetable.module.css";
import useElementDimensions from "@/core/hooks/useElementDimensions";
import { useModal } from "@/core/modules/modal/Modal";
import VirtualizedTable from "@/core/modules/virtualized-table/VirtualizedTable";
import { HoveredCourseAtom } from "@/core/recoil/HoveredCourseAtom";
import { OfferedCoursesAtom } from "@/core/recoil/OfferedCoursesAtom";
import { SelectedCoursesAtom } from "@/core/recoil/SelectedCoursesAtom";
import { Course } from "@/core/types/Course";
import { useCallback, useRef, useState } from "react";
import { useRecoilState } from "recoil";



export default function Coursetable() {
    // Ref
    const courseListTable = useRef<HTMLDivElement>(null);


    // State
    const [selectedCourseIDs, setSelectedCourseIDs] = useState<Set<string>>(new Set());
    const [detailedCourse, setDetailedCourse] = useState<Course | null>(null);


    // Recoil
    const [offeredCourse, setOfferedCourse] = useRecoilState<Course[]>(OfferedCoursesAtom);
    const [selectedCourses, setSelectedCourses] = useRecoilState<Course[]>(SelectedCoursesAtom);
    const [hoveredCourse, setHoveredCourse] = useRecoilState<Course | null>(HoveredCourseAtom);


    /// Modal 
    const [CourseDetailsModal, openCourseDetailsModal, closeCourseDetailsModal] = useModal("ZOOM");


    // Custom Hook
    const courseTableHeight = useElementDimensions(courseListTable, "Pure").height;


    /** 테이블 헤더 설정  */
    const courseTableColumns: { name: string, style: React.CSSProperties }[] = [
        { name: "\u00A0", style: { width: "70px" } },
        { name: "학년/가진급학년", style: { width: "140px" } },
        { name: "교과과정", style: { width: "95px" } },
        { name: "학수강좌번호", style: { width: "120px" } },
        { name: "교과목명", style: { width: "calc(calc(100% - 850px - 5px) * 0.7)" } },
        { name: "교원명", style: { width: "calc(calc(100% - 850px - 5px) * 0.3)" } },
        { name: "수업캠퍼스", style: { width: "105px" } },
        { name: "강의평점", style: { width: "95px" } },
        { name: "학점", style: { width: "60px" } },
        { name: "강의종류", style: { width: "95px" } },
        { name: "\u00A0", style: { width: "70px" } },
    ];


    // Handler
    /** 과목 리스트/선택된 과목 리스트에서 마우스가 가리키고 있는 과목 설정 (hover이벤트) */
    const onHoverCourse = (course: Course | null) => {
        if (setHoveredCourse) {
            // hover된 과목 작은 모달로 시간표 보여줌
            setHoveredCourse(course ? course : null);
        }
    }

    /** 과목 충돌 여부 판단*/
    const checkCourseConflict = (fstCourse: Course, sndCourse: Course) => {
        for (const fstSchedules of fstCourse.getSchedules())
            for (const sndSchedules of sndCourse.getSchedules())
                if (fstSchedules.getDay() === sndSchedules.getDay()
                    && fstSchedules.getTime().getBegin() < sndSchedules.getTime().getEnd()
                    && fstSchedules.getTime().getEnd() > sndSchedules.getTime().getBegin()) return true;
        return false;
    }

    /** 과목 리스트에서 과목 선택 */
    const onSelectCourse = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const selectedIndex = parseInt(e.currentTarget.parentElement?.parentElement?.id || "-1");
        const selectedCourse = offeredCourse[selectedIndex];
        if (setSelectedCourses) {
            if (selectedCourses.some((course) => checkCourseConflict(course, selectedCourse))) {
                alert("기존에 선택한 과목과 시간이 겹칩니다.");
            } else {
                setSelectedCourses([...selectedCourses, selectedCourse]);
                setSelectedCourseIDs(prev => new Set([...prev, selectedCourse.getBaseCode() + selectedCourse.getDivCode()]));
            }
        }
    }, [offeredCourse, selectedCourses, setSelectedCourses]);

    /** 선택된 과목 리스트에서 과목 선택 취소 */
    const onUnselectCourse = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const selectedIndex = parseInt(e.currentTarget.parentElement?.parentElement?.id || "-1");
        if (setSelectedCourses) {
            const deselectedCourse = selectedCourses[selectedIndex];
            const newSelectedList = selectedCourses.filter((course, index) => index !== selectedIndex);
            setSelectedCourses(newSelectedList);
            setSelectedCourseIDs(prev => {
                const newSet = new Set(prev);
                newSet.delete(deselectedCourse.getBaseCode() + deselectedCourse.getDivCode());
                return newSet;
            });
        }
    }, [selectedCourses, setSelectedCourses]);

    /** 과목 상세 정보 */
    const onCourseDetail = (course: Course) => {
        setDetailedCourse(course);
        openCourseDetailsModal();
    };

    /** 중복 선택 확인 */
    const isSelected = useCallback((targetCourse: Course) => {
        return selectedCourseIDs.has(targetCourse.getBaseCode() + targetCourse.getDivCode());
    }, [selectedCourseIDs]);


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

                        numColumns={courseTableColumns.length}
                        columnHeight={35}
                        columnWidths={courseTableColumns.map((column) => column.style)}
                        columnStyles={{
                            userSelect: "none",
                            backgroundColor: "var(--table-attribute-background)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "calc(35px - 1px)",
                            borderLeft: "var(--border-solid)",
                            borderBottom: "var(--border-solid)",
                        }}
                        renderColumns={({ index, columnClassName, columnStyle }) => {
                            return (
                                <div key={index} className={columnClassName} style={columnStyle}>
                                    {courseTableColumns[index].name}
                                </div>
                            );
                        }}

                        numRows={offeredCourse.length}
                        rowHeight={35}
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
                                    onMouseOver={() => { onHoverCourse(offeredCourse[index]); }}
                                    onMouseOut={() => { onHoverCourse(null); }}
                                >
                                    <div className={itemClassName} style={itemStyles[0]}>
                                        <button className={styles.course_list__positive_button} disabled={isSelected(offeredCourse[index])} onClick={(e) => {
                                            onSelectCourse(e);
                                            onHoverCourse(null);
                                        }}>
                                            {"선택"}
                                        </button>
                                    </div>
                                    <div className={itemClassName} style={itemStyles[1]}>{courseInfo.grades}</div>
                                    <div className={itemClassName} style={itemStyles[2]}>{courseInfo.curriculum}</div>
                                    <div className={itemClassName} style={itemStyles[3]}>{courseInfo.code}</div>
                                    <div className={itemClassName} style={itemStyles[4]}>{courseInfo.name}</div>
                                    <div className={itemClassName} style={itemStyles[5]}>{courseInfo.professor}</div>
                                    <div className={itemClassName} style={itemStyles[6]}>{courseInfo.campus}</div>
                                    <div className={itemClassName} style={itemStyles[7]}>{courseInfo.evaluation}</div>
                                    <div className={itemClassName} style={itemStyles[8]}>{courseInfo.credit}</div>
                                    <div className={itemClassName} style={itemStyles[9]}>{courseInfo.lectureCategory}</div>
                                    <div className={itemClassName} style={itemStyles[10]}>
                                        <button className={styles.course_list__button} onClick={() => onCourseDetail(offeredCourse[index])}>
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
                        &#91;선택한 강의 수: {selectedCourses.length}, 학점: {selectedCourses.reduce((totalCredit, course) => totalCredit + course.getCredit(), 0)}&#93;
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

                        numColumns={courseTableColumns.length}
                        columnHeight={35}
                        columnStyles={{
                            userSelect: "none",
                            backgroundColor: "var(--table-attribute-background)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "calc(35px - 1px)",
                            borderLeft: "var(--border-solid)",
                            borderBottom: "var(--border-solid)",
                        }}
                        columnWidths={courseTableColumns.map((column) => column.style)}
                        renderColumns={({ index, columnClassName, columnStyle }) => {
                            return (
                                <div key={index} className={columnClassName} style={columnStyle}>
                                    {courseTableColumns[index].name}
                                </div>
                            );
                        }}

                        numRows={selectedCourses.length}
                        rowHeight={35}
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
                                    onMouseOver={() => { onHoverCourse(selectedCourses[index]) }}
                                    onMouseOut={() => { onHoverCourse(null); }}
                                >
                                    <div className={itemClassName} style={itemStyles[0]}>
                                        <button className={styles.course_list__nagative_button} onClick={(e) => {
                                            onUnselectCourse(e);
                                            onHoverCourse(null);
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
                                    <div className={itemClassName} style={itemStyles[7]}>{courseInfo.evaluation}</div>
                                    <div className={itemClassName} style={itemStyles[8]}>{courseInfo.credit}</div>
                                    <div className={itemClassName} style={itemStyles[9]}>{courseInfo.lectureCategory}</div>
                                    <div className={itemClassName} style={itemStyles[10]}>
                                        <button className={styles.course_list__button} onClick={() => onCourseDetail(selectedCourses[index])}>
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


/*    {detailedCourse && (
        <CourseDetailsModal>
            <CourseDetails course={detailedCourse} onClose={closeCourseDetailsModal} />
        </CourseDetailsModal>
    )}*/