import { atom } from 'recoil';
import { Course } from '../types/Course';

export const HoveredCourseAtom = atom<Course | null>({
    key: "HoveredCourseAtom",
    default: null,
});
