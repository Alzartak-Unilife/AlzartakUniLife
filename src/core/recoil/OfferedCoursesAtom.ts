import { atom } from 'recoil';
import { Course } from '../types/Course';


export const autoOfferedCoursesAtom = atom<Course[]>({
    key: "autoOfferedCoursesAtom",
    default: [],
});


export const customOfferedCoursesAtom = atom<Course[]>({
    key: "customOfferedCoursesAtom",
    default: [],
});
