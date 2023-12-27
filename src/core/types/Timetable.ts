import { Day, Time } from "./Course";

/**
 * BreakDaysObject 타입은 요일별 공강 여부를 나타내는 객체의 타입입니다.
 * 'days' 필드는 각 요일(Day 타입)에 대한 공강 여부를 boolean 값으로 가집니다.
 * 예: { Mon: true, Tue: false, ... }
 */
export type BreakDaysObject = {
    days: Record<Day, boolean>;
}

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
    constructor(daysObject?: BreakDaysObject) {
        this.days = daysObject ? daysObject.days : { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false, None: false };
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
     * `toObject` 메서드는 BreakDays 인스턴스의 상태를 일반 객체로 변환합니다.
     * 이 메서드는 모든 요일의 공강 여부를 담은 객체를 반환합니다.
     * @returns {BreakDaysObject} 요일별 공강 여부를 나타내는 객체
     */
    toObject(): BreakDaysObject {
        return { days: { ...this.days } };
    }

    /**
     * fromObject 메서드는 BreakDaysObject 타입의 객체를 BreakDays 인스턴스로 변환합니다.
     * @param {BreakDaysObject} object - BreakDaysObject 타입의 객체입니다.
     * @returns {BreakDays} BreakDays 인스턴스를 반환합니다.
     */
    public static fromObject(object: BreakDaysObject): BreakDays {
        const instance = new BreakDays();
        Object.keys(object.days).forEach(day => {
            instance.setDay(day as Day, object.days[day as Day]);
        });
        return instance;
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
 * BreaktimeObject 타입은 특정 요일에 설정된 공강 시간을 나타내는 객체의 타입입니다.
 * 'day' 필드는 공강 요일을 나타내며, 'times' 필드는 시작(begin)과 종료(end) 시간을 숫자로 나타냅니다.
 * 예: { day: "Mon", times: { begin: 540, end: 630 } }
 */
export type BreaktimeObject = {
    day: Day;
    times: {
        begin: number;
        end: number;
    };
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
     * `toObject` 메서드는 Breaktime 인스턴스의 상태를 일반 객체로 변환합니다.
     * 이 메서드는 공강 요일과 시간을 포함하는 객체를 반환합니다.
     * @returns {BreaktimeObject} 공강 요일과 시간을 담은 객체
     */
    toObject(): BreaktimeObject {
        return {
            day: this.day,
            times: { ...this.times.toObject() }
        };
    }

    /**
     * fromObject 메서드는 BreaktimeObject 타입의 객체를 Breaktime 인스턴스로 변환합니다.
     * @param {BreaktimeObject} object - BreaktimeObject 타입의 객체입니다.
     * @returns {Breaktime} Breaktime 인스턴스를 반환합니다.
     */
    public static fromObject(object: BreaktimeObject): Breaktime {
        return new Breaktime(object.day, Time.fromObject(object.times));
    }

    /**
     * Breaktime 객체를 문자열 형태로 포맷팅하여 반환합니다.
     * @returns {string} "요일, 시작시간 ~ 종료시간" 형태의 문자열
     */
    printFormat(): string {
        return `${this.day}, ${this.times.printFormat()}`;
    }
}