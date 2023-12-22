import AutoGeneratorConfig from "@/core/components/timetable/desktop/auto/AutoGeneratorConfig"
import styles from "./page.module.css"
import Coursetable from "@/core/components/timetable/desktop/Coursetable";


export default function SettingDesktop() {
    // Render
    return (
        <div className={styles.page}>
            <div className={styles.top}></div>
            <div className={styles.middle}>
                <div className={styles.middle_left}>
                    <AutoGeneratorConfig />
                </div>
                <div className={styles.middle_right}>
                    <Coursetable />
                </div>
            </div>
        </div>
    )
}