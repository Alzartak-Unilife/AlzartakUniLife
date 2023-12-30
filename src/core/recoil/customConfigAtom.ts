import { DefaultValue, atom, selector } from "recoil";
import { CustomConfig } from "../types/CustomConfig";

export const customConfigAtom = atom<CustomConfig>({
    key: "customConfigAtom",
    default: new CustomConfig([])
});

// wishCourses Selector
export const customConfigWishCoursesSelector = selector({
    key: 'customConfigWishCoursesSelector',
    get: ({ get }) => {
        const courses = get(customConfigAtom).getWishCourses();
        return courses.slice().sort((fst, snd) => snd.getRating() - fst.getRating());
    },
    set: ({ set, get }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            const newConfig = get(customConfigAtom);
            newConfig.setWishCourses(newValue);
            set(customConfigAtom, newConfig);
        }
    },
});