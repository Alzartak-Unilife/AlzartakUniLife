"use client"

import styles from "./ConfigCredit.module.css";
import { useRecoilState } from "recoil";
import { generatorConfigCreditTypeSelector, generatorConfigMaxCreditSelector, generatorConfigMinCreditSelector } from "@/core/recoil/generatorConfigAtom";


export default function ConfigCredit() {
    // Recoil
    const [creditType, setCreditType] = useRecoilState(generatorConfigCreditTypeSelector);
    const [minCredit, setMinCredit] = useRecoilState(generatorConfigMinCreditSelector);
    const [maxCredit, setMaxCredit] = useRecoilState(generatorConfigMaxCreditSelector);


    // Render
    return (
        <div className={styles.wrapper}>

            <label>학점 타입</label>
            <div className={styles.credit_types}>
                <label>
                    <input
                        type="radio"
                        value="단일학점"
                        checked={creditType === '단일학점'}
                        onChange={() => setCreditType('단일학점')}
                    />
                    단일 학점
                </label>
                <label>
                    <input
                        type="radio"
                        value="범위학점"
                        checked={creditType === '범위학점'}
                        onChange={() => setCreditType('범위학점')}
                    />
                    범위 학점
                </label>
            </div>

            <label>목표 학점</label>
            {creditType === "단일학점" ? (
                <div className={styles.credit_single}>
                    <div className={styles.credit_select}>
                        <select
                            className={styles.dropdown}
                            value={`${minCredit === 0 ? `-학점 선택-` : `${minCredit}학점`}`}
                            onChange={(e) => {
                                setMinCredit(e.target.selectedIndex);
                                setMaxCredit(e.target.selectedIndex);
                            }}>
                            {Array.from({ length: 25 }, (_, idx) => idx).map((presetIdx) =>
                                <option key={presetIdx}>
                                    {presetIdx === 0 ? `-학점 선택-` : `${presetIdx}학점`}
                                </option>)}
                        </select>
                    </div>
                </div>
            ) : (
                <div className={styles.credit_range}>
                    <div className={styles.credit_select_half}>
                        <select
                            className={styles.dropdown}
                            value={minCredit}
                            onChange={(e) => setMinCredit(Number(e.target.value))}>
                            {Array.from({ length: 25 }, (_, idx) => idx).map((credit) =>
                                <option key={credit} value={credit}>
                                    {credit === 0 ? `-최소 학점 선택-` : `${credit}학점`}
                                </option>)}
                        </select>
                    </div>

                    <label>~</label>

                    <div className={styles.credit_select_half}>
                        <select
                            className={styles.dropdown}
                            value={maxCredit}
                            onChange={(e) => setMaxCredit(Number(e.target.value))}>
                            {Array.from({ length: 25 - minCredit }, (_, idx) => idx + minCredit).map((credit) =>
                                <option key={credit} value={credit}>
                                    {credit === 0 ? `-최대 학점 선택-` : `${credit}학점`}
                                </option>)}
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
}