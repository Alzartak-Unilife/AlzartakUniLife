import ConfigGenerator from "@/core/components/timetable/desktop/auto/setting/ConfigGenerator"
import styles from "./page.module.css"
import DisplayCoursetable from "@/core/components/timetable/desktop/DisplayCoursetable";
import SearchOfferedCourses from "@/core/components/timetable/desktop/SearchOfferedCourses";


export default async function AutoSettingDesktop() {
    // Render
    return (
        <div className={styles.page}>
            <div className={styles.top}>
                <SearchOfferedCourses
                    pageType={"autoPage"}
                />
            </div>
            <div className={styles.middle}>
                <div className={styles.middle_left}>
                    <ConfigGenerator />
                </div>
                <div className={styles.middle_right}>
                    <DisplayCoursetable
                        pageType={"autoPage"}
                    />
                </div>
            </div>
        </div>
    )
}