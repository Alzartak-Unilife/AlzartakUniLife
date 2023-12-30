import styles from "./page.module.css";
import Link from "next/link";

export default function TimetableDesktop() {
    // Render
    return (
        <div className={styles.page}>
            <div className={styles.select_page}>
                <Link className={styles.btnAuto} href={"./desktop/auto/setting"}>
                    시간표 자동 생성기
                </Link>
                <Link className={styles.btnCustom} href={"./desktop/custom"}>
                    시간표 직접 만들기
                </Link>
            </div>
        </div>
    );
}