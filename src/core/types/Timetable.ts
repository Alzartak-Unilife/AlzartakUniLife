import { Day, Time } from "./Course";

/**
 * BreakDays 클래스는 요일별 공강 여부를 관리합니다.
 */
export class BreakDays {
    // 각 요일에 대한 공강 여부를 저장하는 객체
    private days: Record<Day, boolean>;

    /**
     * BreakDays 클래스의 생성자입니다.
     * 모든 요일의 공강 여부를 false로 초기화합니다.
     */
    constructor() {
        this.days = {
            Mon: false,
            Tue: false,
            Wed: false,
            Thu: false,
            Fri: false,
            Sat: false,
            Sun: false,
            None: false
        };
    }

    /**
     * 지정된 요일의 공강 여부를 반환합니다.
     * @param {Day} day - 조회할 요일입니다.
     * @returns {boolean} 해당 요일의 공강 여부입니다.
     */
    getDay(day: Day): boolean {
        return this.days[day];
    }

    /**
     * 지정된 요일의 공강 여부를 설정합니다.
     * @param {Day} day - 설정할 요일입니다.
     * @param {boolean} value - 설정할 공강 여부입니다.
     */
    setDay(day: Day, value: boolean): void {
        this.days[day] = value;
    }

    /**
     * BreakDays 인스턴스의 깊은 복사본을 생성합니다.
     * @returns {BreakDays} 깊은 복사된 BreakDays 인스턴스입니다.
     */
    copy(): BreakDays {
        const newBreakDays = new BreakDays();
        Object.keys(this.days).forEach((day) => {
            newBreakDays.setDay(day as Day, this.days[day as Day]);
        });
        return newBreakDays;
    }

    /**
     * 선택된 요일의 공강 여부를 문자열 형태로 반환합니다.
     * @returns {string} 선택된 요일들의 문자열입니다. 선택된 요일이 없으면 'None'을 반환합니다.
     */
    printFormat(): string {
        const selectedDays = Object.entries(this.days)
            .filter(([_, value]) => value)
            .map(([key, _]) => key)
            .join(", ");
        return selectedDays.length > 0 ? selectedDays : "None";
    }
}




/**
 * Breaktime 클래스는 특정 요일에 설정된 시간대를 관리합니다.
 * 이 클래스는 특정 요일(day)과 해당 요일에 적용될 시간(times)을 포함합니다.
 */
export class Breaktime {
    private day: Day;   // 공강 요일
    private times: Time; // 공강 시간

    /**
     * Breaktime 클래스의 생성자입니다.
     * @param {Day} day - 공강 요일입니다.
     * @param {Time} times - 공강 시간입니다.
     */
    constructor(day: Day, times: Time) {
        this.day = day;
        this.times = times;
    }

    /**
     * 요일을 가져옵니다.
     * @returns {Day} 현재 설정된 공강 요일
     */
    getDay(): Day {
        return this.day;
    }

    /**
     * 요일을 설정합니다.
     * @param {Day} day - 새로 설정할 공강 요일
     */
    setDay(day: Day): void {
        this.day = day;
    }

    /**
     * 공강 시간을 가져옵니다.
     * @returns {Time} 현재 설정된 공강 시간
     */
    getTimes(): Time {
        return this.times;
    }

    /**
     * 공강 시간을 설정합니다.
     * @param {Time} times - 새로 설정할 공강 시간
     */
    setTimes(times: Time): void {
        this.times = times;
    }

    /**
     * Breaktime 객체의 깊은 복사본을 생성합니다.
     * @returns {Breaktime} 새로운 Breaktime 인스턴스
     */
    copy(): Breaktime {
        return new Breaktime(this.day, this.times.copy());
    }

    /**
     * Breaktime 객체를 문자열 형태로 포맷팅하여 반환합니다.
     * @returns {string} "요일, 시작시간 ~ 종료시간" 형태의 문자열
     */
    printFormat(): string {
        return `${this.day}, ${this.times.printFormat()}`;
    }
}
