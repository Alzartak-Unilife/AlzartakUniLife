import styles from "./CircularProgressOverlay.module.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';

/*****************************************************************
 * 원형 진행률 표시기를 통해 로딩 상태를 표시하는 오버레이 컴포넌트입니다.
 *****************************************************************/

/** CircularProgressOverlay의 속성 인터페이스 */
interface CircularProgressOverlayProps {
    percentage: number;              // 진행률 백분율
    description: string;             // 진행 상태 설명
    progressFieldSize?: {            // 프로그레스 필드 크기 (선택적)
        height: number;
        width: number;
    };
    trailColor?: string;             // 트레일 색상 (선택적)
    pathColor?: string;              // 경로 색상 (선택적)
    textColor?: string;              // 텍스트 색상 (선택적)
    textSize?: number;               // 텍스트 크기 (선택적)
    backgroundColor?: string;        // 배경 색상 (선택적)
};

/**
 * CircularProgressOverlay 함수 컴포넌트는 로딩 상태를 원형 진행률 표시기로 표시합니다.
 * 
 * 이 컴포넌트는 로딩 상태 및 설명을 시각적으로 표시하여 사용자에게 진행 상태를 알립니다.
 * 사용자 정의 스타일 옵션을 제공하여 시각적 표현을 조정할 수 있습니다.
 *
 * @param {CircularProgressOverlayProps} props - CircularProgressOverlay의 속성입니다.
 * @returns {JSX.Element} 렌더링된 원형 진행률 표시기 오버레이 컴포넌트입니다.
 */
export default function CircularProgressOverlay({ percentage, description, progressFieldSize, trailColor, pathColor, textColor, textSize, backgroundColor }: CircularProgressOverlayProps) {
    // Render
    return (
        <div className={styles.progressOverlay}>
            <div style={progressFieldSize ? progressFieldSize : { width: 125, height: 125 }}>
                <CircularProgressbar
                    value={percentage}
                    text={`${Math.round(percentage)}%`}
                    backgroundPadding={1}
                    strokeWidth={10}
                    styles={buildStyles({
                        pathTransitionDuration: 0.15,
                        pathColor: pathColor,
                        textColor: textColor,
                        trailColor: trailColor,
                        backgroundColor: backgroundColor,
                        textSize: textSize,
                    })}
                />
            </div>
            <div style={{
                marginTop: "15px",
                fontWeight: 600,
                color: textColor,
                fontSize: textSize
            }} >
                {description}
            </div>
        </div>
    );
};
