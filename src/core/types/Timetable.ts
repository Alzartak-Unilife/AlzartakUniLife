import { Course, CourseObject, Day, Time } from "./Course";

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
    time: {
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
    private time: Time; // 공강 시간

    /**
     * Breaktime 클래스의 생성자입니다.
     * @param {Day} day - 공강 요일입니다.
     * @param {Time} times - 공강 시간입니다.
     */
    constructor(day: Day, times: Time) {
        this.day = day;
        this.time = times;
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
    getTime(): Time {
        return this.time;
    }

    /**
     * 공강 시간을 설정합니다.
     * @param {Time} times - 새로 설정할 공강 시간
     */
    setTimes(times: Time): void {
        this.time = times;
    }

    /**
     * Breaktime 인스턴스와 다른 Breaktime 인스턴스가 동일한지 비교하는 메서드입니다.
     * @param {Breaktime} breaktime - 비교할 다른 Breaktime 인스턴스입니다.
     * @returns {boolean} 두 인스턴스가 동일한 요일과 시간을 가지면 true, 그렇지 않으면 false를 반환합니다.
     */
    equalWith(breaktime: Breaktime): boolean {
        return this.getDay() === breaktime.getDay() && this.getTime().equalWith(breaktime.getTime());
    }

    /**
     * Breaktime 객체의 깊은 복사본을 생성합니다.
     * @returns {Breaktime} 새로운 Breaktime 인스턴스
     */
    copy(): Breaktime {
        return new Breaktime(this.day, this.time.copy());
    }

    /**
     * `toObject` 메서드는 Breaktime 인스턴스의 상태를 일반 객체로 변환합니다.
     * 이 메서드는 공강 요일과 시간을 포함하는 객체를 반환합니다.
     * @returns {BreaktimeObject} 공강 요일과 시간을 담은 객체
     */
    toObject(): BreaktimeObject {
        return {
            day: this.day,
            time: { ...this.time.toObject() }
        };
    }

    /**
     * fromObject 메서드는 BreaktimeObject 타입의 객체를 Breaktime 인스턴스로 변환합니다.
     * @param {BreaktimeObject} object - BreaktimeObject 타입의 객체입니다.
     * @returns {Breaktime} Breaktime 인스턴스를 반환합니다.
     */
    public static fromObject(object: BreaktimeObject): Breaktime {
        return new Breaktime(object.day, Time.fromObject(object.time));
    }

    /**
     * Breaktime 객체를 문자열 형태로 포맷팅하여 반환합니다.
     * @returns {string} "요일, 시작시간 ~ 종료시간" 형태의 문자열
     */
    printFormat(): string {
        return `${this.day}, ${this.time.printFormat()}`;
    }
}




/**
 * TimetableObject 타입은 시간표 데이터를 나타내는 객체의 구조를 정의합니다.
 * - id: 시간표의 고유 식별자입니다.
 * - name: 시간표의 이름입니다.
 * - courses: 시간표에 포함된 강의들을 나타내는 CourseObject 배열입니다.
 */
export type TimetableObject = {
    id: string;
    name: string;
    courses: CourseObject[];
}

/**
 * Timetable 클래스는 시간표의 데이터를 관리하고 조작하는 데 사용됩니다.
 * 이 클래스는 시간표의 고유 ID, 이름 및 강의 목록을 속성으로 가집니다.
 */
export class Timetable {
    private id: string;
    private name: string;
    private courses: Course[];

    /**
     * Timetable 클래스의 생성자입니다.
     * @param {string} id - 시간표의 고유 ID입니다.
     * @param {string} name - 시간표의 이름입니다.
     * @param {Course[]} courses - 시간표에 포함된 강의 목록입니다.
     */
    constructor(id: string, name: string, courses: Course[]) {
        this.id = id;
        this.name = name;
        this.courses = courses;
    }

    /** 시간표의 ID를 반환합니다. */
    getId(): string {
        return this.id;
    }

    /** 시간표의 ID를 설정합니다. */
    setId(value: string): void {
        this.id = value;
    }

    /** 시간표의 이름을 반환합니다. */
    getName(): string {
        return this.name;
    }

    /** 시간표의 이름을 설정합니다. */
    setName(value: string): void {
        this.name = value;
    }

    /** 시간표에 포함된 강의 목록을 반환합니다. */
    getCourses(): Course[] {
        return this.courses;
    }

    /** 시간표에 포함된 강의 목록을 설정합니다. */
    setCourses(value: Course[]): void {
        this.courses = value;
    }

    /**
     * Timetable 인스턴스의 깊은 복사본을 생성합니다.
     * @returns {Timetable} 깊은 복사된 Timetable 인스턴스
     */
    copy(): Timetable {
        const copiedCourses = this.courses.map(course => course.copy());
        return new Timetable(this.id, this.name, copiedCourses);
    }

    /**
     * Timetable 인스턴스를 TimetableObject 타입의 객체로 변환합니다.
     * @returns {TimetableObject} Timetable 인스턴스를 나타내는 객체
     */
    toObject(): TimetableObject {
        return {
            id: this.id,
            name: this.name,
            courses: this.courses.map(course => course.toObject())
        };
    }

    /**
     * TimetableObject 타입의 객체를 Timetable 인스턴스로 변환합니다.
     * @param {TimetableObject} object - TimetableObject 타입의 객체입니다.
     * @returns {Timetable} Timetable 인스턴스
     */
    public static fromObject(object: TimetableObject): Timetable {
        const courses = object.courses.map(courseObject => Course.fromObject(courseObject));
        return new Timetable(object.id, object.name, courses);
    }
}