import { atom } from 'recoil';
import { Course } from '../types/Course';

export const SelectedCoursesAtom = atom<Course[]>({
    key: "SelectedCoursesAtom",
    default: [],
});
