"use client"

import { Dispatch, SetStateAction } from "react";
import styles from "./ConfigPreset.module.css";


interface ConfigPresetProps {
    settingPreset: number;
    setSettingPreset: Dispatch<SetStateAction<number>>;
}

export default function ConfigPreset({ settingPreset, setSettingPreset }: ConfigPresetProps) {
      // Render
    return (
        <div className={styles.configPreset}>
            <div className={styles.preset_select}>
                <select className={styles.dropdown} value={settingPreset} onChange={(e) => setSettingPreset(parseInt(e.target.value))}>
                    {Array.from({ length: 11 }, (_, idx) => idx).map((presetIdx) =>
                        <option key={presetIdx}>
                            {presetIdx === 0 ? "-프리셋 선택-" : `프리셋${presetIdx}`}
                        </option>)}
                </select>
            </div>
            <div className={styles.preset_buttons}>
                <button className={styles.btnLoad}>불러오기</button>
                <button className={styles.btnSave}>저장</button>
            </div>
        </div>
    );
}