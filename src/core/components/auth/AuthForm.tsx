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
                    로그인
                </button>
                <button className={styles.signup}>
                    회원가입
                </button>
            </>}
        </div>
    );
}