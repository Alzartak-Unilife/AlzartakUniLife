import { DefaultValue, atom, selector } from "recoil";
import { MakerConfig } from "../types/MakerConfig";

export const makerConfigAtom = atom<MakerConfig>({
    key: "makerConfigAtom",
    default: new MakerConfig([])
});

// wishCourses Selector
export const makerConfigWishCoursesSelector = selector({
    key: 'makerConfigWishCoursesSelector',
    get: ({ get }) => {
        const courses = get(makerConfigAtom).getWishCourses();
        return courses.slice().sort((fst, snd) => snd.getRating() - fst.getRating());
    },
    set: ({ set, get }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            const newConfig = get(makerConfigAtom).copy();
            newConfig.setWishCourses(newValue);
            set(makerConfigAtom, newConfig);
        }
    },
});