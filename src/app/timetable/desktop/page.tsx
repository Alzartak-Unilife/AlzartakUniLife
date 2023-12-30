import styles from "./page.module.css";
import Link from "next/link";

export default function TimetableDesktop() {
    // Render
    return (
        <div className={styles.page}>
            <div className={styles.select_page}>
                <Link className={styles.btnAuto} href={"./desktop/auto/setting"}>
                    스마트 시간표 생성
                </Link>
                <Link className={styles.btnCustom} href={"./desktop/custom/maker"}>
                    커스텀 타임테이블
                </Link>
            </div>
        </div>
    );
}