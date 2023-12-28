"use client"

import Link from "next/link";
import styles from "./CreateTimetable.module.css";


export default function CreateTimetable() {
    // Render
    return (
        <Link className={styles.createTimetable} href={"../auto/generate"}>
            <button className={styles.btnCreate}>시간표 생성</button>
        </Link>
    );
}