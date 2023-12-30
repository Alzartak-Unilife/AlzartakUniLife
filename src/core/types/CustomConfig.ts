import { Course, CourseObject } from "./Course";


/**
 * CustomConfigObject 타입은 사용자 지정 설정의 상태를 나타내는 객체의 타입입니다.
 * 이 타입은 사용자가 선택한 강의 목록을 CourseObject 배열로 저장합니다.
 */
export type CustomConfigObject = {
    wishCourses: CourseObject[];
}


/**
 * CustomConfig 클래스는 사용자 지정 설정을 관리하는 클래스입니다.
 * 이 클래스는 사용자가 선택한 강의 목록을 관리하며,
 * 강의 목록은 Course 인스턴스의 배열로 저장됩니다.
 */
export class CustomConfig {
    private wishCourses: Course[];

    /**
     * CustomConfig 클래스의 생성자입니다.
     * @param {Course[]} wishCourses - 사용자가 선택한 강의 목록입니다.
     */
    constructor(wishCourses: Course[]) {
        this.wishCourses = wishCourses;
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
     * @returns {CustomConfig} 깊은 복사된 CustomConfig 인스턴스
     */
    copy(): CustomConfig {
        const copiedCourses = this.wishCourses.map(course => course.copy());
        return new CustomConfig(copiedCourses);
    }

    /**
     * CustomConfig 인스턴스의 상태를 일반 객체로 변환합니다.
     * @returns {CustomConfigObject} CustomConfig의 상태를 나타내는 객체
     */
    toObject(): CustomConfigObject {
        return {
            wishCourses: this.wishCourses.map(course => course.toObject())
        };
    }

    /**
     * CustomConfigObject 타입의 객체를 CustomConfig 인스턴스로 변환합니다.
     * @param {CustomConfigObject} object - CustomConfigObject 타입의 객체입니다.
     * @returns {CustomConfig} CustomConfig 인스턴스
     */
    public static fromObject(object: CustomConfigObject): CustomConfig {
        const courses = object.wishCourses.map(courseObject => Course.fromObject(courseObject));
        return new CustomConfig(courses);
    }
}