import styles from "./page.module.css";
import Image from 'next/image';

export default function DesktopGuide() {
    return (
        <div className={styles.desktopGuide}>
            <div style={{ position: 'relative', width: "128vh", height: "72vh", marginBottom: "50px" }}>
                <Image src="/guide01.PNG" alt="guide01" fill priority />
            </div>
            <div style={{ position: 'relative', width: "128vh", height: "72vh", marginBottom: "50px" }}>
                <Image src="/guide02.PNG" alt="guide02" fill priority />
            </div>
            <div style={{ position: 'relative', width: "128vh", height: "72vh", marginBottom: "50px" }}>
                <Image src="/guide03.PNG" alt="guide03" fill priority />
            </div>
            <div style={{ position: 'relative', width: "128vh", height: "72vh", marginBottom: "50px" }}>
                <Image src="/guide04.PNG" alt="guide04" fill priority />
            </div>
            <div style={{ position: 'relative', width: "128vh", height: "72vh", marginBottom: "50px" }}>
                <Image src="/guide05.PNG" alt="guide05" fill priority />
            </div>
            <div style={{ position: 'relative', width: "128vh", height: "72vh", marginBottom: "50px" }}>
                <Image src="/guide06.PNG" alt="guide06" fill priority />
            </div>
            <div style={{ position: 'relative', width: "128vh", height: "72vh", marginBottom: "50px" }}>
                <Image src="/guide07.PNG" alt="guide07" fill priority />
            </div>
        </div>
    );
}
