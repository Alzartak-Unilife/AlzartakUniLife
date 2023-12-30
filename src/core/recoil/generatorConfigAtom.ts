import { DefaultValue, atom, selector } from 'recoil';
import { GeneratorConfig } from '../types/GeneratorConfig';
import { BreakDays } from '../types/Timetable';


export const generatorConfigAtom = atom<GeneratorConfig>({
    key: "generatorConfigAtom",
    default: new GeneratorConfig("단일학점", 0, 0, new BreakDays(), [], [])
});

// creditType Selector
export const generatorConfigCreditTypeSelector = selector({
    key: 'generatorConfigCreditTypeSelector',
    get: ({ get }) => get(generatorConfigAtom).getCreditType(),
    set: ({ set, get }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            const newConfig = get(generatorConfigAtom).copy();
            newConfig.setCreditType(newValue);
            set(generatorConfigAtom, newConfig);
        }
    },
});

// minCredit Selector
export const generatorConfigMinCreditSelector = selector({
    key: 'generatorConfigMinCreditSelector',
    get: ({ get }) => get(generatorConfigAtom).getMinCredit(),
    set: ({ set, get }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            const newConfig = get(generatorConfigAtom).copy();
            newConfig.setMinCredit(newValue);
            set(generatorConfigAtom, newConfig);
        }
    },
});

// maxCredit Selector
export const generatorConfigMaxCreditSelector = selector({
    key: 'generatorConfigMaxCreditSelector',
    get: ({ get }) => get(generatorConfigAtom).getMaxCredit(),
    set: ({ set, get }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            const newConfig = get(generatorConfigAtom).copy();
            newConfig.setMaxCredit(newValue);
            set(generatorConfigAtom, newConfig);
        }
    },
});

// breakDays Selector
export const generatorConfigBreakDaysSelector = selector({
    key: 'generatorConfigBreakDaysSelector',
    get: ({ get }) => get(generatorConfigAtom).getBreakDays(),
    set: ({ set, get }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            const newConfig = get(generatorConfigAtom).copy();
            newConfig.setBreakDays(newValue);
            set(generatorConfigAtom, newConfig);
        }
    },
});

// breaktimes Selector
export const generatorConfigBreaktimesSelector = selector({
    key: 'generatorConfigBreaktimesSelector',
    get: ({ get }) => get(generatorConfigAtom).getBreaktimes(),
    set: ({ set, get }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            const newConfig = get(generatorConfigAtom).copy();
            newConfig.setBreaktimes(newValue);
            set(generatorConfigAtom, newConfig);
        }
    },
});

// wishCourses Selector
export const generatorConfigWishCoursesSelector = selector({
    key: 'generatorConfigWishCoursesSelector',
    get: ({ get }) => {
        const courses = get(generatorConfigAtom).getWishCourses();
        return courses.slice().sort((fst, snd) => snd.getRating() - fst.getRating());
    },
    set: ({ set, get }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            const newConfig = get(generatorConfigAtom).copy();
            newConfig.setWishCourses(newValue);
            set(generatorConfigAtom, newConfig);
        }
    },
});