import AutoGeneratorConfig from "@/core/components/timetable/desktop/auto/setting/AutoGeneratorConfig"
import styles from "./page.module.css"
import Coursetable from "@/core/components/timetable/desktop/Coursetable";
import CourseSearch from "@/core/components/timetable/desktop/CourseSearch";


export default async function AutoSettingDesktop() {
    // Render
    return (
        <div className={styles.page}>
            <div className={styles.top}>
                <CourseSearch
                    pageType={"autoPage"}
                />
            </div>
            <div className={styles.middle}>
                <div className={styles.middle_left}>
                    <AutoGeneratorConfig />
                </div>
                <div className={styles.middle_right}>
                    <Coursetable
                        pageType={"autoPage"}
                    />
                </div>
            </div>
        </div>
    )
}