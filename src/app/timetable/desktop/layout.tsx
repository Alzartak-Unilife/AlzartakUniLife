import AuthTopBar from "@/core/components/auth/AuthTopBar";
import styles from "./layout.module.css";

export default function Layout({ children }: { children: React.ReactNode }) {
    // Render
    return (
        <div className={styles.layout}>
            <div className={styles.auth_top_bar}>
                <AuthTopBar />
            </div>
            <div className={styles.main_contents}>
                {children}
            </div>
        </div>
    )
}
