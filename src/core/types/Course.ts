
/**
 * `Day` 타입은 요일을 나타내는 문자열 타입입니다.
 */
export type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun" | "None";




/**
 * TimeObject 타입은 시작 시간과 종료 시간을 나타내는 객체의 타입입니다.
 * 'begin'과 'end' 필드는 각각 시작 시간과 종료 시간을 숫자로 나타냅니다.
 * 예: { begin: 540, end: 630 }
 */
export type TimeObject = {
    begin: number;
    end: number;
}


/**
 * `Time` 클래스는 시작 시간과 종료 시간을 나타내는 클래스입니다.
 */
export class Time {
    private begin: number;
    private end: number;

    /**
     * Time 클래스의 생성자입니다.
     * @param {number} begin 시작 시간을 나타냅니다.
     * @param {number} end 종료 시간을 나타냅니다.
     */
    constructor(begin: number, end: number) {
        this.begin = begin;
        this.end = end;
    }

    /**
     * 시작 시간을 반환합니다.
     * @returns {number} 시작 시간
     */
    getBegin(): number {
        return this.begin;
    }

    /**
     * 시작 시간을 설정합니다.
     * @param {number} value 새로운 시작 시간
     */
    setBegin(value: number): void {
        if (value >= 0) {
            this.begin = value;
        } else {
            throw new Error("Begin time must be a non-negative number.");
        }
    }

    /**
     * 종료 시간을 반환합니다.
     * @returns {number} 종료 시간
     */
    getEnd(): number {
        return this.end;
    }

    /**
     * 종료 시간을 설정합니다.
     * @param {number} value 새로운 종료 시간
     */
    setEnd(value: number): void {
        if (value >= 0) {
            this.end = value;
        } else {
            throw new Error("End time must be a non-negative number.");
        }
    }

    /**
     * `equalWith` 메서드는 두 개의 `Time` 인스턴스가 시간 범위가 완전히 동일한지 여부를 확인합니다.
     * @param {Time} other - 비교할 다른 `Time` 인스턴스
     * @returns {boolean} 두 인스턴스의 시작 및 종료 시간이 완전히 동일한 경우 `true`를 반환하고, 그렇지 않으면 `false`를 반환합니다.
     */
    equalWith(other: Time): boolean {
        return this.getBegin() === other.getBegin() && this.getEnd() === other.getEnd();
    }

    /**
     * `conflictWith` 메서드는 두 개의 `Time` 인스턴스가 시간 범위가 겹치는지 여부를 확인합니다.
     * @param {Time} other - 비교할 다른 `Time` 인스턴스
     * @returns {boolean} 두 인스턴스의 시간 범위가 겹치는 경우 `true`를 반환하고, 그렇지 않으면 `false`를 반환합니다.
     */
    conflictWith(other: Time): boolean {
        return this.getBegin() < other.getEnd() && this.getEnd() > other.getBegin();
    }

    /**
     * `copy` 메서드는 `Time` 인스턴스의 깊은 복사본을 생성합니다.
     * 이 메서드는 기존 `Time` 객체의 시작 및 종료 시간을 새 인스턴스로 복사하여 반환합니다.
     * @returns {Time} 새로운 `Time` 인스턴스
     */
    copy(): Time {
        return new Time(this.begin, this.end);
    }

    /**
     * `toObject` 메서드는 Time 인스턴스의 상태를 일반 객체로 변환합니다.
     * 이 메서드는 시작 시간과 종료 시간을 포함하는 객체를 반환합니다.
     * @returns {TimeObject} 시작 시간과 종료 시간을 나타내는 객체
     */
    toObject(): TimeObject {
        return { begin: this.begin, end: this.end };
    }

    /**
     * fromObject 메서드는 TimeObject 타입의 객체를 Time 인스턴스로 변환합니다.
     * @param {TimeObject} object - TimeObject 타입의 객체입니다.
     * @returns {Time} Time 인스턴스를 반환합니다.
     */
    public static fromObject(object: TimeObject): Time {
        return new Time(object.begin, object.end);
    }

    /**
     * `printFormat` 메서드는 `Time` 클래스 인스턴스의 시작 및 종료 시간을 포맷팅하여 문자열로 반환합니다.
     * 이 메서드는 내부적으로 `format` 함수를 사용하여 시간과 분을 00:00 형식으로 포맷팅합니다.
     * 예를 들어, 시작 시간이 90분이고 종료 시간이 150분인 경우, 
     * '01:30 ~ 02:30'과 같은 형식의 문자열을 반환합니다.
     *
     * @returns {string} 시작 및 종료 시간이 포맷팅된 문자열.
     *                   시간은 00:00 형식으로 표시되며, 시작 및 종료 시간은 '~' 문자로 구분됩니다.
     */
    printFormat(): string {
        const format = (time: number) => {
            let hour = Math.floor(time / 60);
            let minute = time % 60;
            return `${hour < 10 ? '0' : ''}${hour}:${minute < 10 ? '0' : ''}${minute}`;
        }
        return `${format(this.begin)} ~ ${format(this.end)}`;
    }
}




/**
 * `ScheduleObject` 타입은 강의 또는 이벤트의 스케줄을 나타내는 객체의 타입입니다.
 * 'day', 'time', 및 'room' 필드를 가지며, 각각 요일, 시간, 그리고 장소를 나타냅니다.
 * 예: { day: "Mon", time: { begin: 540, end: 630 }, room: "101호" }
 */
export type ScheduleObject = {
    day: Day;
    time: TimeObject;
    room: string;
}

/**
 * `Schedule` 클래스는 특정 강의 또는 이벤트의 스케줄을 나타냅니다.
 * 이 클래스는 강의 또는 이벤트가 열리는 요일, 시간, 그리고 장소를 저장합니다.
 */
export class Schedule {
    private day: Day;       // 강의 또는 이벤트가 열리는 요일
    private time: Time;     // 강의 또는 이벤트가 열리는 시간
    private room: string;   // 강의 또는 이벤트가 열리는 장소

    /**
     * `Schedule` 클래스의 생성자입니다.
     * @param {Day} day 강의 또는 이벤트가 열리는 요일입니다.
     * @param {Time} time 강의 또는 이벤트의 시작 및 종료 시간입니다.
     * @param {string} room 강의 또는 이벤트가 열리는 장소입니다.
     */
    constructor(day: Day, time: Time, room: string) {
        this.day = day;
        this.time = time;
        this.room = room;
    }

    /**
     * 강의 또는 이벤트가 열리는 요일을 반환합니다.
     * @returns {Day} 강의 또는 이벤트가 열리는 요일
     */
    getDay(): Day {
        return this.day;
    }

    /**
     * 강의 또는 이벤트가 열리는 요일을 설정합니다.
     * @param {Day} value 새로운 요일
     */
    setDay(value: Day): void {
        this.day = value;
    }

    /**
     * 강의 또는 이벤트의 시간을 반환합니다.
     * @returns {Time} 강의 또는 이벤트의 시간
     */
    getTime(): Time {
        return this.time;
    }

    /**
     * 강의 또는 이벤트의 시간을 설정합니다.
     * @param {Time} value 새로운 시간
     */
    setTime(value: Time): void {
        this.time = value;
    }

    /**
     * 강의 또는 이벤트가 열리는 장소를 반환합니다.
     * @returns {string} 강의 또는 이벤트가 열리는 장소
     */
    getRoom(): string {
        return this.room;
    }

    /**
     * 강의 또는 이벤트가 열리는 장소를 설정합니다.
     * @param {string} value 새로운 장소
     */
    setRoom(value: string): void {
        this.room = value;
    }

    /**
     * `conflictWith` 메서드는 두 개의 `Schedule` 인스턴스가 시간대가 겹치는지 여부를 확인합니다.
     * @param {Schedule} other - 비교할 다른 `Schedule` 인스턴스
     * @returns {boolean} 두 인스턴스의 시간대가 겹치는 경우 `true`를 반환하고, 그렇지 않으면 `false`를 반환합니다.
     */
    conflictWith(other: Schedule): boolean {
        return this.getDay() === other.getDay() && this.getTime().conflictWith(other.getTime());
    }

    /**
     * `copy` 메서드는 `Schedule` 인스턴스의 깊은 복사본을 생성합니다.
     * 이 메서드는 기존 `Schedule` 객체의 요일, 시간, 장소를 새 인스턴스로 복사하여 반환합니다.
     * 여기서 시간 객체는 해당 객체의 `copy` 메서드를 사용하여 복사합니다.
     * @returns {Schedule} 새로운 `Schedule` 인스턴스
     */
    copy(): Schedule {
        return new Schedule(this.day, this.time.copy(), this.room);
    }

    /**
     * fromObject 메서드는 ScheduleObject 타입의 객체를 Schedule 인스턴스로 변환합니다.
     * @param {ScheduleObject} object - ScheduleObject 타입의 객체입니다.
     * @returns {Schedule} Schedule 인스턴스를 반환합니다.
     */
    public static fromObject(object: ScheduleObject): Schedule {
        return new Schedule(object.day, Time.fromObject(object.time), object.room);
    }

    /**
     * `toObject` 메서드는 Schedule 인스턴스의 상태를 일반 객체로 변환합니다.
     * 이 메서드는 요일, 시간, 장소를 포함하는 객체를 반환합니다.
     * @returns {ScheduleObject} 요일, 시간, 장소를 나타내는 객체
     */
    toObject(): ScheduleObject {
        return {
            day: this.day,
            time: this.time.toObject(),
            room: this.room
        };
    }

    /**
     * `printFormat` 메서드는 `Schedule` 클래스 인스턴스의 강의 또는 이벤트 정보를 포맷팅하여 문자열로 반환합니다.
     * 이 메서드는 강의 또는 이벤트의 요일, 시간 및 장소 정보를 결합하여 문자열로 표현합니다.
     * 예를 들어, 강의가 월요일에 오전 9시부터 오전 11시까지 '101호'에서 열린다면,
     * 'Mon, 09:00 ~ 11:00 (101호)'와 같은 형식의 문자열을 반환합니다.
     *
     * @returns {string} 강의 또는 이벤트의 요일, 시간, 장소 정보가 포맷팅된 문자열.
     *                   형식은 '요일, 시작시간 ~ 종료시간 (장소)'로 표시됩니다.
     */
    printFormat(): string {
        return `${this.day}, ${this.time.printFormat()} (${this.room})`;
    }
}




/**
 * CourseObject 타입은 대학 강의 또는 코스의 정보를 나타내는 객체의 타입입니다.
 * - year: 개설년도
 * - semester: 개설학기
 * - grades: 학년/가진급학년 배열
 * - curriculum: 교과과정
 * - courseArea: 교과영역구분
 * - baseCode: 학수강좌번호
 * - divCode: 분반
 * - name: 교과목명
 * - professor: 교원명
 * - campus: 수업캠퍼스
 * - schedules: 강의 스케줄(요일/시간/강의실) 배열
 * - credit: 학점
 * - theory: 이론 시간
 * - practice: 실습 시간
 * - lectureType: 강의유형
 * - lectureCategory: 강의종류
 * - language: 원어강의
 * - requirementType: 이수구분
 * - offeringCollege: 개설대학
 * - offeringDepartment: 개설학과/전공
 * - remarks: 비고
 * - evaluation: 강의평점
 * - rating: 선호도(선택적)
 */
export type CourseObject = {
    year: number;
    semester: number;
    grades: number[];
    curriculum: string;
    courseArea: string;
    baseCode: string;
    divCode: string;
    name: string;
    professor: string;
    campus: string;
    schedules: ScheduleObject[];
    credit: number;
    theory: number;
    practice: number;
    lectureType: string;
    lectureCategory: string;
    language: string;
    requirementType: string;
    offeringCollege: string;
    offeringDepartment: string;
    remarks: string;
    evaluation: number;
    rating: number;
}

/**
 * `Course` 클래스는 대학 강의 또는 코스에 대한 정보를 저장합니다.
 * 이 클래스는 강의의 평점, 커리큘럼, 학문 분야, 코드, 교수, 캠퍼스 등 다양한 정보를 포함합니다.
 */
export class Course {
    private year: number;                 // 개설년도
    private semester: number;             // 개설학기
    private grades: number[];             // 학년/가진급학년
    private curriculum: string;           // 교과과정
    private courseArea: string;           // 교과영역구분
    private baseCode: string;             // 학수강좌번호
    private divCode: string;              // 분반
    private name: string;                 // 교과목명
    private professor: string;            // 교원명
    private campus: string;               // 수업캠퍼스
    private schedules: Schedule[];        // 요일/시간/강의실
    private credit: number;               // 학점
    private theory: number;               // 이론
    private practice: number;             // 실습
    private lectureType: string;          // 강의유형
    private lectureCategory: string;      // 강의종류
    private language: string;             // 원어강의
    private requirementType: string;      // 이수구분
    private offeringCollege: string;      // 개설대학
    private offeringDepartment: string;   // 개설학과/전공
    private remarks: string;              // 비고
    private evaluation: number;           // 강의평점
    private rating: number;               // 선호도

    /**
    * `Course` 클래스의 생성자입니다. 강의에 대한 모든 정보를 초기화합니다.
    */
    constructor(
        year: number, semester: number,
        grades: number[], curriculum: string, courseArea: string, baseCode: string,
        divCode: string, name: string, professor: string, campus: string,
        schedules: Schedule[], credit: number, theory: number, practice: number,
        lectureType: string, lectureCategory: string, language: string,
        requirementType: string, offeringCollege: string, offeringDepartment: string, remarks: string,
        evaluation: number, rating?: number
    ) {
        this.year = year;
        this.semester = semester;
        this.grades = grades;
        this.curriculum = curriculum;
        this.courseArea = courseArea;
        this.baseCode = baseCode;
        this.divCode = divCode;
        this.name = name;
        this.professor = professor;
        this.campus = campus;
        this.schedules = schedules;
        this.credit = credit;
        this.theory = theory;
        this.practice = practice;
        this.lectureType = lectureType;
        this.lectureCategory = lectureCategory;
        this.language = language;
        this.requirementType = requirementType;
        this.offeringCollege = offeringCollege;
        this.offeringDepartment = offeringDepartment;
        this.remarks = remarks;
        this.evaluation = evaluation;
        this.rating = rating || evaluation;
    }

    /** 개설년도를 반환합니다. */
    getYear(): number {
        return this.year;
    }

    /** 개설년도를 설정합니다. */
    setYear(value: number): void {
        this.year = value;
    }

    /** 개설학기를 반환합니다. */
    getSemester(): number {
        return this.semester;
    }

    /** 개설학기를 설정합니다. */
    setSemester(value: number): void {
        this.semester = value;
    }

    /** 학년/가진급학년을 반환합니다. */
    getGrades(): number[] {
        return this.grades;
    }

    /** 학년/가진급학년을 설정합니다. */
    setGrades(value: number[]): void {
        this.grades = value;
    }

    /** 교과과정을 반환합니다. */
    getCurriculum(): string {
        return this.curriculum;
    }

    /** 교과과정을 설정합니다. */
    setCurriculum(value: string): void {
        this.curriculum = value;
    }

    /** 교과영역구분을 반환합니다. */
    getCourseArea(): string {
        return this.courseArea;
    }

    /** 교과영역구분을 설정합니다. */
    setCourseArea(value: string): void {
        this.courseArea = value;
    }

    /** 학수강좌번호를 반환합니다. */
    getBaseCode(): string {
        return this.baseCode;
    }

    /** 학수강좌번호를 설정합니다. */
    setBaseCode(value: string): void {
        this.baseCode = value;
    }

    /** 분반을 반환합니다. */
    getDivCode(): string {
        return this.divCode;
    }

    /** 분반을 설정합니다. */
    setDivCode(value: string): void {
        this.divCode = value;
    }

    /** 교과목명을 반환합니다. */
    getName(): string {
        return this.name;
    }

    /** 교과목명을 설정합니다. */
    setName(value: string): void {
        this.name = value;
    }

    /** 교원명을 반환합니다. */
    getProfessor(): string {
        return this.professor;
    }

    /** 교원명을 설정합니다. */
    setProfessor(value: string): void {
        this.professor = value;
    }

    /** 수업캠퍼스를 반환합니다. */
    getCampus(): string {
        return this.campus;
    }

    /** 수업캠퍼스를 설정합니다. */
    setCampus(value: string): void {
        this.campus = value;
    }

    /** 요일/시간/강의실을 반환합니다. */
    getSchedules(): Schedule[] {
        return this.schedules;
    }

    /** 요일/시간/강의실을 설정합니다. */
    setSchedules(value: Schedule[]): void {
        this.schedules = value;
    }

    /** 학점을 반환합니다. */
    getCredit(): number {
        return this.credit;
    }

    /** 학점을 설정합니다. */
    setCredit(value: number): void {
        this.credit = value;
    }

    /** 이론을 반환합니다. */
    getTheory(): number {
        return this.theory;
    }

    /** 이론을 설정합니다. */
    setTheory(value: number): void {
        this.theory = value;
    }

    /** 실습을 반환합니다. */
    getPractice(): number {
        return this.practice;
    }

    /** 실습을 설정합니다. */
    setPractice(value: number): void {
        this.practice = value;
    }

    /** 강의유형을 반환합니다. */
    getLectureType(): string {
        return this.lectureType;
    }

    /** 강의유형을 설정합니다. */
    setLectureType(value: string): void {
        this.lectureType = value;
    }

    /** 강의종류를 반환합니다. */
    getLectureCategory(): string {
        return this.lectureCategory;
    }

    /** 강의종류를 설정합니다. */
    setLectureCategory(value: string): void {
        this.lectureCategory = value;
    }

    /** 원어강의를 반환합니다. */
    getLanguage(): string {
        return this.language;
    }

    /** 원어강의를 설정합니다. */
    setLanguage(value: string): void {
        this.language = value;
    }

    /** 이수구분을 반환합니다. */
    getRequirementType(): string {
        return this.requirementType;
    }

    /** 이수구분을 설정합니다. */
    setRequirementType(value: string): void {
        this.requirementType = value;
    }

    /** 개설대학을 반환합니다. */
    getOfferingCollege(): string {
        return this.offeringCollege;
    }

    /** 개설대학을 설정합니다. */
    setOfferingCollege(value: string): void {
        this.offeringCollege = value;
    }

    /** 개설학과/전공을 반환합니다. */
    getOfferingDepartment(): string {
        return this.offeringDepartment;
    }

    /** 개설학과/전공을 설정합니다. */
    setOfferingDepartment(value: string): void {
        this.offeringDepartment = value;
    }

    /** 비고를 반환합니다. */
    getRemarks(): string {
        return this.remarks;
    }

    /** 비고를 설정합니다. */
    setRemarks(value: string): void {
        this.remarks = value;
    }

    /** 강의평점을 반환합니다. */
    getEvaluation(): number {
        return this.evaluation;
    }

    /** 강의평점을 설정합니다. */
    setEvaluation(evaluation: number) {
        this.evaluation = evaluation;
    }

    /** 선호도를 반환합니다. */
    getRating(): number {
        return this.rating;
    }

    /** 선호도를 설정합니다. */
    setRating(rating: number) {
        this.rating = rating;
    }

    /**
     * `equalWith` 메서드는 다른 `Course` 인스턴스와 현재 인스턴스가 동일한 강의인지 비교합니다.
     * 이 메서드는 학수강좌번호, 분반, 개설년도 및 개설학기를 기준으로 두 강의가 같은지 확인합니다.
     * @param {Course} other 비교할 다른 `Course` 인스턴스입니다.
     * @returns {boolean} 두 강의가 동일하면 true, 그렇지 않으면 false를 반환합니다.
     */
    equalWith(other: Course): boolean {
        return this.baseCode === other.baseCode
            && this.divCode === other.divCode
            && this.year === other.year
            && this.semester === other.semester;
    }

    /**
     * `conflictWith` 메서드는 현재 강의와 다른 강의의 시간표가 겹치는지 여부를 확인합니다.
     * 시간표의 충돌 여부는 다음과 같이 판단됩니다:
     * - 두 강의의 시간표 요일이 동일한 경우
     * - 두 강의의 시간표 시작 시간과 종료 시간이 겹치는 경우
     *
     * @param {Course} other 비교할 다른 `Course` 인스턴스입니다.
     * @returns {boolean} 시간표가 겹치면 true, 그렇지 않으면 false를 반환합니다.
     */
    conflictWith(other: Course, compareOptions = { baseCode: true, schedule: true }): boolean {
        if (compareOptions.baseCode && this.baseCode === other.getBaseCode()) return true;
        if (compareOptions.schedule) {
            for (const fstSchedule of this.getSchedules()) {
                for (const sndSchedule of other.getSchedules()) {
                    if (fstSchedule.conflictWith(sndSchedule)) {
                        return true; // 시간표가 겹칠 경우 true 반환
                    }
                }
            }
        }
        return false; // 시간표가 겹치지 않을 경우 false 반환
    }

    /**
     * `copy` 메서드는 `Course` 인스턴스의 깊은 복사본을 생성합니다.
     * 이 메서드는 기존 `Course` 객체의 모든 속성을 새 인스턴스로 복사하여 반환합니다.
     * 여기서 `schedules` 배열의 각 요소는 해당 요소의 `copy` 메서드를 사용하여 복사합니다.
     * @returns {Course} 새로운 `Course` 인스턴스
     */
    copy(): Course {
        return new Course(
            this.year,
            this.semester,
            [...this.grades],
            this.curriculum,
            this.courseArea,
            this.baseCode,
            this.divCode,
            this.name,
            this.professor,
            this.campus,
            this.schedules.map(s => s.copy()),
            this.credit,
            this.theory,
            this.practice,
            this.lectureType,
            this.lectureCategory,
            this.language,
            this.requirementType,
            this.offeringCollege,
            this.offeringDepartment,
            this.remarks,
            this.evaluation,
            this.rating
        );
    }

    /**
     * `toObject` 메서드는 Course 인스턴스의 상태를 일반 객체로 변환합니다.
     * 이 메서드는 강의에 대한 모든 정보를 포함하는 객체를 반환합니다.
     * @returns {CourseObject} 강의 정보를 나타내는 객체
     */
    toObject(): CourseObject {
        return {
            year: this.year,
            semester: this.semester,
            grades: this.grades,
            curriculum: this.curriculum,
            courseArea: this.courseArea,
            baseCode: this.baseCode,
            divCode: this.divCode,
            name: this.name,
            professor: this.professor,
            campus: this.campus,
            schedules: this.schedules.map(schedule => schedule.toObject()),
            credit: this.credit,
            theory: this.theory,
            practice: this.practice,
            lectureType: this.lectureType,
            lectureCategory: this.lectureCategory,
            language: this.language,
            requirementType: this.requirementType,
            offeringCollege: this.offeringCollege,
            offeringDepartment: this.offeringDepartment,
            remarks: this.remarks,
            evaluation: this.evaluation,
            rating: this.rating
        };
    }

    /**
     * fromObject 메서드는 CourseObject 타입의 객체를 Course 인스턴스로 변환합니다.
     * @param {CourseObject} object - CourseObject 타입의 객체입니다.
     * @returns {Course} Course 인스턴스를 반환합니다.
     */
    public static fromObject(object: CourseObject): Course {
        return new Course(
            object.year,
            object.semester,
            object.grades,
            object.curriculum,
            object.courseArea,
            object.baseCode,
            object.divCode,
            object.name,
            object.professor,
            object.campus,
            object.schedules.map(schedule => Schedule.fromObject(schedule)),
            object.credit,
            object.theory,
            object.practice,
            object.lectureType,
            object.lectureCategory,
            object.language,
            object.requirementType,
            object.offeringCollege,
            object.offeringDepartment,
            object.remarks,
            object.evaluation,
            object.rating
        );
    }

    /**
     * `printFormat` 메서드는 `Course` 인스턴스의 정보를 포맷팅된 형태로 반환합니다.
     * 이 메서드는 강의의 주요 정보들을 객체로 포맷팅하여 반환합니다.
     * @returns {Object} 강의 정보가 포맷팅된 객체입니다.
     */
    printFormat() {
        return {
            grades: this.grades.length > 1 ? `${this.grades[0]}~${this.grades[this.grades.length - 1]}` : this.grades.length === 1 ? this.grades[0].toString() : "",
            curriculum: this.curriculum,
            courseArea: this.courseArea,
            code: `${this.baseCode}-${this.divCode}`,
            name: this.name,
            professor: this.professor,
            campus: this.campus,
            schedules: this.schedules.map((schedule) => schedule.printFormat()),
            credit: this.credit.toString(),
            theory: this.theory.toString(),
            practice: this.practice.toString(),
            lectureType: this.lectureType,
            lectureCategory: this.lectureCategory,
            language: this.language,
            requirementType: this.requirementType,
            offeringCollege: this.offeringCollege,
            offeringDepartment: this.offeringDepartment,
            remarks: this.remarks,
            evaluation: this.evaluation === 0 ? "없음" : this.evaluation.toFixed(2).toString()
        }
    }
}