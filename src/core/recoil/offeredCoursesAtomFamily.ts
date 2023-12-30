import { atomFamily } from 'recoil';
import { Course } from '../types/Course';

export const offeredCoursesAtomFamily = atomFamily<Course[], "autoPage" | "customPage">({
    key: 'offeredCoursesAtomFamily',
    default: [],
});