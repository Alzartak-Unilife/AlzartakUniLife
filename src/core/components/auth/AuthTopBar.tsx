"use client"

import { signOut } from "next-auth/react";
import styles from "./AuthTopBar.module.css";
import { useRouter } from "next/navigation";

export default function AuthTopBar() {
    // Const
    const router = useRouter();

    // Render
    return (
        <div className={styles.authTopBar}>
            <button className={styles.signout} onClick={() => { signOut() }}>
                로그아웃
            </button>
        </div>
    );
}