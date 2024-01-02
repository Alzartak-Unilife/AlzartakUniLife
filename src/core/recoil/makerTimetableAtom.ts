import { DefaultValue, atom, selector } from "recoil";
import { Timetable } from "../types/Timetable";

export const makerTimetableAtom = atom<Timetable>({
    key: "makerTimetableAtom",
    default: new Timetable("", "", [])
});

// name Selector
export const makerTimetableNameSelector = selector({
    key: 'makerTimetableNameSelector',
    get: ({ get }) => {
        return get(makerTimetableAtom).getName();
    },
    set: ({ set, get }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            const newConfig = get(makerTimetableAtom).copy();
            newConfig.setName(newValue);
            set(makerTimetableAtom, newConfig);
        }
    },
});

// wishCourses Selector
export const makerTimetableCoursesSelector = selector({
    key: 'makerTimetableCoursesSelector',
    get: ({ get }) => {
        const courses = get(makerTimetableAtom).getCourses();
        return courses.slice().sort((fst, snd) => snd.getRating() - fst.getRating());
    },
    set: ({ set, get }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            const newConfig = get(makerTimetableAtom).copy();
            newConfig.setCourses(newValue);
            set(makerTimetableAtom, newConfig);
        }
    },
});