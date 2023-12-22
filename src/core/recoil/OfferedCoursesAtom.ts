import { atom } from 'recoil';
import { Course } from '../types/Course';

export const OfferedCoursesAtom = atom<Course[]>({
    key: "OfferedCoursesAtom",
    default: [],
});
