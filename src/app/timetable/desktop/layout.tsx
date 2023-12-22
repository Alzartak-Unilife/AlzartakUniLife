import styles from "./layout.module.css";

export default function Layout({ children }: { children: React.ReactNode }) {
    // Render
    return (
        <div className={styles.layout}>
            {children}
        </div>
    )
}
