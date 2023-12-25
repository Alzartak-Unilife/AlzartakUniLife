import React, { useState, useCallback } from 'react';
import styles from "./VirtualizedTable.module.css";

/*****************************************************************
 * VirtualizedTable은 화면에 표시되는 영역에 따라 동적으로 행을 렌더링하는 컴포넌트입니다.
 * 이를 통해 대규모 데이터셋을 효율적으로 표시할 수 있습니다.
 *****************************************************************/

/** VirtualizedTable 컴포넌트의 프로퍼티 정의 */
export interface VirtualizedTableProps {
    windowHeight: number;                  // 테이블이 표시될 윈도우 높이
    tableStyle?: React.CSSProperties;      // 테이블의 스타일
    hideScrollbar?: boolean;               // 스크롤바 표시 여부

    headerHeight: number;                  // 테이블 헤더의 높이
    headerStyle?: { default?: React.CSSProperties, hover?: React.CSSProperties }; // 헤더 스타일
    attributeWidths: {                     // 각 열의 너비 정의
        width: React.CSSProperties['width'];
        minWidth?: React.CSSProperties['minWidth'];
        maxWidth?: React.CSSProperties['maxWidth'];
    }[];
    attributeStyle?: { default?: React.CSSProperties, hover?: React.CSSProperties }; // 열 스타일
    renderHeader: (item: { index: number; attributeClassName: string; attributeStyle: React.CSSProperties; }) => JSX.Element; // 헤더 렌더링 함수

    numRows: number;                      // 표시될 행의 총 개수
    rowHeight: number;                    // 각 행의 높이
    rowStyle?: { default?: React.CSSProperties, hover?: React.CSSProperties }; // 행 스타일
    cellStyle?: { default?: React.CSSProperties, hover?: React.CSSProperties }; // 셀 스타일
    renderRows: (item: { index: number; rowClassName: string; rowStyle: React.CSSProperties, cellClassName: string; cellStyles: React.CSSProperties[]; }) => JSX.Element; // 행 렌더링 함수
}


/**
 * VirtualizedTable 함수 컴포넌트는 가상 스크롤링을 지원하는 테이블을 렌더링합니다.
 * 
 * 이 컴포넌트는 주어진 window 높이와 열/행의 속성에 따라 테이블을 구성하며,
 * 스크롤 위치에 따라 현재 보이는 행만 렌더링하여 성능을 최적화합니다.
 *
 * @param {VirtualizedTableProps} props - VirtualizedTable의 속성입니다.
 * @returns {JSX.Element} 렌더링된 가상 스크롤 테이블입니다.
 */
export default function VirtualizedTable({
    windowHeight, tableStyle, hideScrollbar,
    headerHeight, headerStyle, attributeWidths, attributeStyle, renderHeader,
    numRows, rowHeight, rowStyle, cellStyle, renderRows,
}: VirtualizedTableProps): JSX.Element {
    // 현재 스크롤 위치 상태 관리
    const [scrollTop, setScrollTop] = useState<number>(0);


    // 마우스 오버 상태 관리
    const [hoveredHeader, setHoveredHeader] = useState<true | null>(null);
    const [hoveredAttribute, setHoveredAttribute] = useState<number | null>(null);
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
    const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);


    // 테이블 높이와 현재 보이는 행의 범위 계산
    const innerHeight = numRows * rowHeight;
    const bodyHeight = windowHeight - headerHeight;
    const startIndex = Math.floor(scrollTop / rowHeight);
    const endIndex = Math.min(numRows - 1, Math.floor((scrollTop + bodyHeight) / rowHeight));


    // 스크롤 이벤트 핸들러
    const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop);
    }, []);


    // 헤더 속성 렌더링 로직
    const attributes = [];
    // 각 열(속성)에 대해 반복하여 헤더를 렌더링
    for (let attributeIdx = 0; attributeIdx < attributeWidths.length; attributeIdx++) {
        // 각 헤더 열을 생성하여 attributes 배열에 추가
        attributes.push(
            React.cloneElement(renderHeader({
                index: attributeIdx,
                attributeClassName: `${styles.virtualizedTable_column}`,
                attributeStyle: {
                    ...attributeWidths[attributeIdx], // 각 열의 너비와 스타일 적용
                    height: `100%`,
                    ...attributeStyle?.default,
                    ...((attributeIdx === hoveredAttribute || attributeIdx === hoveredColumn) && attributeStyle?.hover),
                }
            }), {
                key: `attribute-${attributeIdx}`,
                onMouseEnter: () => setHoveredAttribute(attributeIdx), // 마우스 오버 이벤트 핸들러
                onMouseLeave: () => setHoveredAttribute(null) // 마우스 리브 이벤트 핸들러
            })
        );
    }


    // 행 렌더링 로직
    const rows = [];
    // 현재 보이는 영역에 해당하는 행에 대해 반복하여 렌더링
    for (let rowIdx = startIndex; rowIdx <= endIndex; rowIdx++) {
        // 각 행을 렌더링하고 해당 행의 셀 스타일을 설정
        const renderedRow = renderRows({
            index: rowIdx,
            rowClassName: `${styles.virtualizedTable_row}`,
            rowStyle: {
                display: "flex",
                position: "absolute",
                top: `${rowIdx * rowHeight}px`,
                width: "100%",
                height: `${rowHeight}px`,
                ...rowStyle?.default,
                ...(rowIdx === hoveredRow && rowStyle?.hover),
            },
            cellClassName: `${styles.virtualizedTable_column}`,
            cellStyles: Array.from({ length: attributeWidths.length }, (_, columnIdx) => columnIdx).map((columnIdx) => ({
                ...attributeWidths[columnIdx],
                height: `100%`,
                ...cellStyle?.default,
                ...((rowIdx === hoveredRow && columnIdx === hoveredColumn) && cellStyle?.hover)
            })),
        });

        // 각 행에 대한 마우스 이벤트 핸들러 설정
        rows.push(
            React.cloneElement(renderedRow, {
                key: `row-${rowIdx}`,
                onMouseEnter: () => setHoveredRow(rowIdx),
                onMouseLeave: () => setHoveredRow(null),
                children: React.Children.map(renderedRow.props.children, (child, columnIdx) =>
                    React.cloneElement(child, {
                        key: `column-${rowIdx}-${columnIdx}`,
                        onMouseEnter: () => setHoveredColumn(columnIdx),
                        onMouseLeave: () => setHoveredColumn(null),
                    })
                )
            })
        );
    }


    // 렌더링
    return (
        <div className={styles.virtualizedTable} style={tableStyle}>
            <div className={styles.table__header}
                style={{
                    display: "flex",
                    width: `${hideScrollbar ? "100%" : "calc(100% - 0.65vw)"}`,
                    height: `${headerHeight}px`,
                    borderRight: `${hideScrollbar ? "none" : `1vw solid ${(headerStyle?.default?.backgroundColor as string)?.split(' ').pop()}`}`,
                    borderRightColor: `${(headerStyle?.default?.backgroundColor as string)?.split(' ').pop()}`,
                    ...headerStyle?.default,
                    ...(hoveredHeader && headerStyle?.hover),
                }}
                onMouseOver={() => setHoveredHeader(true)}
                onMouseLeave={() => setHoveredHeader(null)}
            >
                {attributes}
            </div>

            <div className={styles.table__body}
                style={{
                    height: `${bodyHeight}px`,
                    maxHeight: `${bodyHeight}px`,
                    overflowY: `${hideScrollbar ? "hidden" : "scroll"}`
                }}
                onScroll={onScroll}>
                <div className={styles.table__body_rows}
                    style={{
                        height: `${innerHeight}px`
                    }}>
                    {rows}
                </div>
            </div>
        </div >
    );
};