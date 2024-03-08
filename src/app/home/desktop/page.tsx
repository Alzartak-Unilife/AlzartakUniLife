import AuthForm from "@/core/components/auth/AuthForm";
import styles from "./page.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import MyForm from "@/app/MyForm";

export default async function DesktopHome() {
    // Const
    const isAuth = (await getServerSession(authOptions)) !== null;

    // Render
    return (
        <div className={styles.desktopHome}>
            <div className={styles.get_start}>
                <AuthForm
                    isAuth={isAuth}
                />
                {/* <MyForm /> */}
            </div>
        </div>
    );
}