import AutoGenerateTimetable from "@/core/components/timetable/desktop/auto/generate/AutoGenerateTimetable";
import styles from "./page.module.css";

export default function AutoGenerateDesktop() {
    // Render
    return (
        <div className={styles.page}>
            <AutoGenerateTimetable />
        </div>
    );
}