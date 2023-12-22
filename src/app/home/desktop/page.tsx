import Link from "next/link";

export default function DesktopHome() {
    // Render
    return (
        <div>
            <Link href={"../timetable/desktop"}><button>시간표</button></Link>
        </div>
    );
}