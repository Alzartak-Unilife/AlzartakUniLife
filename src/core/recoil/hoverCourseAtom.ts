import { atom } from 'recoil';
import { Course } from '../types/Course';


export const autoHoverCourseAtom = atom<Course | null>({
    key: "autoHoverCourseAtom",
    default: null,
});


export const customHoverCourseAtom = atom<Course | null>({
    key: "customHoverCourseAtom",
    default: null,
});