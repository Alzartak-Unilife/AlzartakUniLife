"use client"

import { signIn } from "next-auth/react";
import styles from "./AuthForm.module.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthFormProps {
    isAuth: boolean;
}

export default function AuthForm({ isAuth }: AuthFormProps) {
    // Const
    const router = useRouter();

    // Handler
    const guide = () => {
        router.push("../home/desktop/guide")
    };

    //Effect
    useEffect(() => {
        if (isAuth) {
            router.replace("../timetable/desktop")
        }
    }, []);

    // Render
    return (
        <div className={styles.authForm}>
            {!isAuth && <>
                <button className={styles.signin} onClick={() => { signIn() }}>
                    시작하기
                </button>
                <button className={styles.signup} onClick={() => { guide() }}>
                    가이드
                </button>
            </>}
        </div>
    );
}