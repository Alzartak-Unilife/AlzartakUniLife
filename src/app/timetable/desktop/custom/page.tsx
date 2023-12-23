import AutoGeneratorConfig from "@/core/components/timetable/desktop/auto/AutoGeneratorConfig"
import styles from "./page.module.css"
import Coursetable from "@/core/components/timetable/desktop/Coursetable";
import CourseSearch from "@/core/components/timetable/desktop/CourseSearch";


export default function CustomDesktop() {
    // Render
    return (
        <div className={styles.page}>
            <div className={styles.top}>
                <CourseSearch />
            </div>
            <div className={styles.middle}>
                <div className={styles.middle_left}>

                </div>
                <div className={styles.middle_right}>
                    <Coursetable
                        checkCourseConflict={true}
                    />
                </div>
            </div>
        </div>
    )
}