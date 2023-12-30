import { Course, CourseObject } from "./Course";
import { BreakDays, BreakDaysObject, Breaktime, BreaktimeObject } from "./Timetable";


/**
 * GeneratorConfigObject는 시간표 생성기의 설정을 나타냅니다.
 * 
 * - creditType: 학점 타입을 나타내며, "단일학점" 또는 "범위학점" 중 하나입니다.
 * 
 * - minCredit: 최소 학점을 나타냅니다. creditType이 "범위학점"일 때 사용됩니다.
 * 
 * - maxCredit: 최대 학점을 나타냅니다. creditType이 "범위학점"일 때 사용됩니다.
 * 
 * - breakDays: 요일별 공강 여부를 나타내는 객체입니다. BreakDaysObject 타입을 참조합니다.
 * 
 * - breaktimes: 특정 요일에 설정된 공강 시간대를 나타냅니다. BreaktimeObject 배열로 표현됩니다.
 * 
 * - wishCourses: 사용자가 선택한 강의 목록을 나타냅니다. 각 강의는 CourseObject 형태로 저장됩니다.
 */
export type GeneratorConfigObject = {
    creditType: "단일학점" | "범위학점";
    minCredit: number;
    maxCredit: number;
    breakDays: BreakDaysObject;
    breaktimes: BreaktimeObject[];
    wishCourses: CourseObject[];
}


/**
 * GeneratorConfig 클래스는 시간표 생성기의 구성을 관리합니다.
 * 이 클래스는 사용자가 설정한 시간표 생성 조건들을 저장하고 관리하는 역할을 합니다.
 * 
 * - creditType: 학점 타입을 저장합니다. "단일학점" 또는 "범위학점" 중 하나가 될 수 있습니다.
 * - minCredit: 범위 학점 설정 시 사용되는 최소 학점을 저장합니다.
 * - maxCredit: 범위 학점 설정 시 사용되는 최대 학점을 저장합니다.
 * - breakDays: 요일별 공강 여부를 관리하는 BreakDays 객체입니다.
 * - breaktimes: 특정 요일에 설정된 공강 시간대를 관리하는 Breaktime 객체 배열입니다.
 * - wishCourses: 사용자가 선택한 강의 목록을 저장합니다. 각 강의는 Course 객체 형태로 저장됩니다.
 * 
 * 이 클래스는 사용자의 시간표 생성 설정을 저장, 검색, 수정하는 메서드를 제공합니다.
 * 또한, 설정을 객체 형태로 변환하거나 객체에서 인스턴스로 변환하는 기능도 제공합니다.
 */
export class GeneratorConfig {
    private creditType: "단일학점" | "범위학점";
    private minCredit: number;
    private maxCredit: number;
    private breakDays: BreakDays;
    private breaktimes: Breaktime[];
    private wishCourses: Course[];

    /**
     * GeneratorConfig 클래스의 생성자입니다.
     * 시간표 생성기의 다양한 설정을 초기화합니다.
     *
     * @param creditType 학점 타입 ("단일학점" 또는 "범위학점")
     * @param minCredit 최소 학점
     * @param maxCredit 최대 학점
     * @param breakDays 요일별 공강 설정
     * @param breaktimes 특정 요일의 공강 시간대
     * @param wishCourses 사용자가 선택한 강의 목록
     */
    constructor(
        creditType: "단일학점" | "범위학점",
        minCredit: number,
        maxCredit: number,
        breakDays: BreakDays,
        breaktimes: Breaktime[],
        wishCourses: Course[]
    ) {
        this.creditType = creditType;
        this.minCredit = minCredit;
        this.maxCredit = maxCredit;
        this.breakDays = breakDays;
        this.breaktimes = breaktimes;
        this.wishCourses = wishCourses;
    }

    /**
      * 학점 타입을 반환하는 게터 메서드입니다.
      * @returns 현재 설정된 학점 타입 ("단일학점" 또는 "범위학점")
      */
    getCreditType(): "단일학점" | "범위학점" {
        return this.creditType;
    }

    /**
     * 학점 타입을 설정하는 세터 메서드입니다.
     * @param value 새로 설정할 학점 타입
     */
    setCreditType(value: "단일학점" | "범위학점"): void {
        this.creditType = value;
    }

    /**
     * 최소 학점을 반환하는 게터 메서드입니다.
     * @returns 현재 설정된 최소 학점
     */
    getMinCredit(): number {
        return this.minCredit;
    }

    /**
     * 최소 학점을 설정하는 세터 메서드입니다.
     * @param value 새로 설정할 최소 학점
     */
    setMinCredit(value: number): void {
        this.minCredit = value;
    }

    /**
     * 최대 학점을 반환하는 게터 메서드입니다.
     * @returns 현재 설정된 최대 학점
     */
    getMaxCredit(): number {
        return this.maxCredit;
    }

    /**
     * 최대 학점을 설정하는 세터 메서드입니다.
     * @param value 새로 설정할 최대 학점
     */
    setMaxCredit(value: number): void {
        this.maxCredit = value;
    }

    /**
     * 요일별 공강 여부를 관리하는 BreakDays 객체를 반환하는 게터 메서드입니다.
     * @returns 현재 설정된 BreakDays 객체
     */
    getBreakDays(): BreakDays {
        return this.breakDays;
    }

    /**
     * 요일별 공강 여부를 설정하는 세터 메서드입니다.
     * @param value 새로 설정할 BreakDays 객체
     */
    setBreakDays(value: BreakDays): void {
        this.breakDays = value;
    }

    /**
     * 특정 요일의 공강 시간대를 관리하는 Breaktime 객체 배열을 반환하는 게터 메서드입니다.
     * @returns 현재 설정된 Breaktime 객체 배열
     */
    getBreaktimes(): Breaktime[] {
        return this.breaktimes;
    }

    /**
     * 특정 요일의 공강 시간대를 설정하는 세터 메서드입니다.
     * @param value 새로 설정할 Breaktime 객체 배열
     */
    setBreaktimes(value: Breaktime[]): void {
        this.breaktimes = value;
    }

    /**
     * 사용자가 선택한 강의 목록을 반환하는 게터 메서드입니다.
     * @returns 현재 설정된 강의 목록
     */
    getWishCourses(): Course[] {
        return this.wishCourses;
    }

    /**
     * 사용자가 선택한 강의 목록을 설정하는 세터 메서드입니다.
     * @param value 새로 설정할 강의 목록
     */
    setWishCourses(value: Course[]): void {
        this.wishCourses = value;
    }

    /**
     * 객체의 깊은 복사본을 생성하는 메서드입니다.
     * 모든 속성을 복사하여 새로운 GeneratorConfig 인스턴스를 반환합니다.
     *
     * @returns 새로운 GeneratorConfig 인스턴스
     */
    copy(): GeneratorConfig {
        return new GeneratorConfig(
            this.creditType,
            this.minCredit,
            this.maxCredit,
            this.breakDays.copy(),
            this.breaktimes.map(breaktime => breaktime.copy()),
            this.wishCourses.map(course => course.copy())
        );
    }

    /**
     * 객체를 일반 자바스크립트 객체로 변환하는 메서드입니다.
     * 설정 값을 포함하는 GeneratorConfigObject를 반환합니다.
     *
     * @returns GeneratorConfigObject
     */
    toObject(): GeneratorConfigObject {
        return {
            creditType: this.creditType,
            minCredit: this.minCredit,
            maxCredit: this.maxCredit,
            breakDays: this.breakDays.toObject(),
            breaktimes: this.breaktimes.map(breaktime => breaktime.toObject()),
            wishCourses: this.wishCourses.map(course => course.toObject())
        };
    }

    /**
     * GeneratorConfigObject 타입의 객체를 GeneratorConfig 인스턴스로 변환하는 정적 메서드입니다.
     * 
     * @param object GeneratorConfigObject 타입의 객체
     * @returns 새로운 GeneratorConfig 인스턴스
     */
    public static fromObject(object: GeneratorConfigObject): GeneratorConfig {
        return new GeneratorConfig(
            object.creditType,
            object.minCredit,
            object.maxCredit,
            BreakDays.fromObject(object.breakDays),
            object.breaktimes.map(breaktimeObject => Breaktime.fromObject(breaktimeObject)),
            object.wishCourses.map(courseObject => Course.fromObject(courseObject))
        );
    }
}
