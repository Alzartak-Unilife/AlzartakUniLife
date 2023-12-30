"use client"

import Link from "next/link";
import styles from "./GenerateTimetable.module.css";


export default function GenerateTimetable() {
    // Render
    return (
        <Link className={styles.wrapper} href={"../auto/generate"}>
            <button className={styles.btnCreate}>시간표 생성</button>
        </Link>
    );
}