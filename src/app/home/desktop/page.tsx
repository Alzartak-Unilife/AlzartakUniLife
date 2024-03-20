import AuthForm from "@/core/components/auth/AuthForm";
import styles from "./page.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import MyForm from "@/app/MyForm";
import Image from "next/image";

export default async function DesktopHome() {
    // Const
    const isAuth = (await getServerSession(authOptions)) !== null;

    // Render
    return (
        <div className={styles.desktopHome}>
            <div className={styles.title}>
                Alzartak Unilife
            </div>
            <div style={{ position: 'relative', width: "15vh", height: "15vh", marginBottom: "10px" }}>
                <Image src="/logo.PNG" alt="guide01" fill priority />
            </div>
            <div className={styles.get_start}>
                <AuthForm
                    isAuth={isAuth}
                />
                {/* <MyForm /> */}
            </div>
        </div>
    );
}