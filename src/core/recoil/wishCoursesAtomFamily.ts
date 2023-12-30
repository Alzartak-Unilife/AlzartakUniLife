// import { atomFamily, selectorFamily } from 'recoil';
// import { Course } from '../types/Course';

// export const wishCoursesAtomFamily = atomFamily<Course[], "autoPage" | "customPage">({
//     key: 'wishCoursesAtomFamily',
//     default: [],
// });

// export const sortedWishCoursesSelectorFamily = selectorFamily<Course[], "autoPage" | "customPage">({
//     key: 'sortedWishCoursesSelectorFamily',
//     get: (familyKey) => ({ get }) => {
//         const courses = get(wishCoursesAtomFamily(familyKey));
//         return courses.slice().sort((fst, snd) => snd.getRating() - fst.getRating());
//     },
// });