import styles from "./page.module.css"
import DisplayCoursetable from "@/core/components/timetable/desktop/DisplayCoursetable";
import SearchOfferedCourses from "@/core/components/timetable/desktop/SearchOfferedCourses";
import ConfigMaker from "@/core/components/timetable/desktop/custom/maker/ConfigMaker";


export default function CustomDesktop() {
    // Render
    return (
        <div className={styles.page}>
            <div className={styles.top}>
                <SearchOfferedCourses
                    pageType={"customPage"}
                />
            </div>
            <div className={styles.middle}>
                <div className={styles.middle_left}>
                    <ConfigMaker />
                </div>
                <div className={styles.middle_right}>
                    <DisplayCoursetable
                        pageType={"customPage"}
                    />
                </div>
            </div>
        </div>
    )
}