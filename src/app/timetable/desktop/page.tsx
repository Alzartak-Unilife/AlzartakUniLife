import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function TimetableDesktop() {
    // Render
    return (
        <div className={styles.page}>
            <div className={styles.title}>
                Alzartak Unilife
            </div>
            <div style={{ position: 'relative', width: "15vh", height: "15vh", marginBottom: "10px" }}>
                <Image src="/logo.PNG" alt="guide01" fill priority />
            </div>
            <div className={styles.select_page}>
                <Link className={styles.btnAuto} href={"./desktop/auto/setting"}>
                    스마트 시간표 생성
                </Link>
                <Link className={styles.btnCustom} href={"./desktop/custom/maker"}>
                    커스텀 시간표
                </Link>
            </div>
        </div>
    );
}