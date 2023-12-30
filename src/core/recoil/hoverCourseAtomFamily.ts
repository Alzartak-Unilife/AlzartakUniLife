import { atomFamily } from 'recoil';
import { Course } from '../types/Course';

export const hoverCourseAtomFamily = atomFamily<Course | null, "autoPage" | "customPage">({
    key: 'hoverCourseAtomFamily',
    default: null,
});