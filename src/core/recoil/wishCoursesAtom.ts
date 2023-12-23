import { atom, selector } from 'recoil';
import { Course } from '../types/Course';

export const autoWishCoursesAtom = atom<Course[]>({
    key: "autoWishCoursesAtom",
    default: [],
});

export const sortedAutoWishCoursesSelector = selector<Course[]>({
    key: 'sortedAutoWishCoursesSelector',
    get: ({ get }) => {
        const courses = get(autoWishCoursesAtom);
        const sortedCourses = courses.slice().sort((fst, snd) => snd.getRating() - fst.getRating());
        return sortedCourses;
    },
});

export const customWishCoursesAtom = atom<Course[]>({
    key: "customWishCoursesAtom",
    default: [],
});

export const sortedCustomWishCoursesSelector = selector<Course[]>({
    key: 'sortedCustomWishCoursesSelector',
    get: ({ get }) => {
        const courses = get(autoWishCoursesAtom);
        const sortedCourses = courses.slice().sort((fst, snd) => snd.getRating() - fst.getRating());
        return sortedCourses;
    },
});