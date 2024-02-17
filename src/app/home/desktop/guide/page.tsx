import styles from "./page.module.css";
import Image from 'next/image';
import guide01 from '/public/guide01.PNG';
import guide02 from '/public/guide02.PNG';
import guide03 from '/public/guide03.PNG';
import guide04 from '/public/guide04.PNG';
import guide05 from '/public/guide05.PNG';
import guide06 from '/public/guide06.PNG';
import guide07 from '/public/guide07.PNG';

export default async function DesktopGuide() {
    // Render
    return (
        <div className={styles.desktopGuide}>
            <Image src={guide01} alt="guide01" style={{ width: "80vw", height: "45vw", marginBottom: "50px" }} />
            <Image src={guide02} alt="guide02" style={{ width: "80vw", height: "45vw", marginBottom: "50px" }} />
            <Image src={guide03} alt="guide03" style={{ width: "80vw", height: "45vw", marginBottom: "50px" }} />
            <Image src={guide04} alt="guide04" style={{ width: "80vw", height: "45vw", marginBottom: "50px" }} />
            <Image src={guide05} alt="guide05" style={{ width: "80vw", height: "45vw", marginBottom: "50px" }} />
            <Image src={guide06} alt="guide06" style={{ width: "80vw", height: "45vw", marginBottom: "50px" }} />
            <Image src={guide07} alt="guide07" style={{ width: "80vw", height: "45vw", marginBottom: "50px" }} />
        </div>
    );
}