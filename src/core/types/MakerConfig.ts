import { Course, CourseObject } from "./Course";


/**
 * MakerConfigObject 타입은 사용자 지정 설정의 상태를 나타내는 객체의 타입입니다.
 * 이 타입은 사용자가 선택한 강의 목록을 CourseObject 배열로 저장합니다.
 */
export type MakerConfigObject = {
    id: string;
    name: string;
    wishCourses: CourseObject[];
}


/**
 * MakerConfig 클래스는 사용자 지정 설정을 관리하는 클래스입니다.
 * 이 클래스는 사용자가 선택한 강의 목록을 관리하며,
 * 강의 목록은 Course 인스턴스의 배열로 저장됩니다.
 */
export class MakerConfig {
    private id: string;
    private name: string;
    private wishCourses: Course[];

    /**
     * MakerConfig 클래스의 생성자입니다.
     * @param {string} name - 시간표 이름입니다.
     * @param {Course[]} wishCourses - 시간표의 강의 목록입니다.
     */
    constructor(id: string, name: string, wishCourses: Course[]) {
        this.id = id;
        this.name = name;
        this.wishCourses = wishCourses;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    /**
     * 사용자가 선택한 강의 목록을 반환합니다.
     * @returns {Course[]} 선택한 강의 목록
     */
    getWishCourses(): Course[] {
        return this.wishCourses;
    }

    /**
     * 사용자가 선택한 강의 목록을 설정합니다.
     * @param {Course[]} value - 새로운 강의 목록
     */
    setWishCourses(value: Course[]): void {
        this.wishCourses = value;
    }

    /**
     * CustomConfig 인스턴스의 깊은 복사본을 생성합니다.
     * @returns {MakerConfig} 깊은 복사된 CustomConfig 인스턴스
     */
    copy(): MakerConfig {
        const copiedCourses = this.wishCourses.map(course => course.copy());
        return new MakerConfig(this.id, this.name, copiedCourses);
    }

    /**
     * CustomConfig 인스턴스의 상태를 일반 객체로 변환합니다.
     * @returns {MakerConfigObject} CustomConfig의 상태를 나타내는 객체
     */
    toObject(): MakerConfigObject {
        return {
            id: this.id,
            name: this.name,
            wishCourses: this.wishCourses.map(course => course.toObject())
        };
    }

    /**
     * CustomConfigObject 타입의 객체를 CustomConfig 인스턴스로 변환합니다.
     * @param {MakerConfigObject} object - CustomConfigObject 타입의 객체입니다.
     * @returns {MakerConfig} CustomConfig 인스턴스
     */
    public static fromObject(object: MakerConfigObject): MakerConfig {
        return new MakerConfig(
            object.id,
            object.name,
            object.wishCourses.map(courseObject => Course.fromObject(courseObject))
        );
    }
}