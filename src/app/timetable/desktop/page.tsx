import styles from "./page.module.css";
import Link from "next/link";

export default function TimetableDesktop() {
    // Render
    return (
        <div className={styles.page}>
            <Link href={"./desktop/auto/setting"}><button>시간표 자동 생성</button></Link>
            <Link href={"./desktop/custom"}><button>시간표 만들기</button></Link>
        </div>
    );
}