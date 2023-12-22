import Link from "next/link";

export default function MobileHome() {
    // Render
    return (
        <div>
            <Link href={"../timetable/mobile"}><button>시간표</button></Link>
        </div>
    );
}