import { atom } from 'recoil';
import { IGeneratorConfig } from '../types/IGeneratorConfig';
import { BreakDays } from '../types/Timetable';


export const autoGeneratorConfigAtom = atom<IGeneratorConfig>({
    key: "autoGeneratorConfigAtom",
    default: {
        creditType: "단일학점",
        minCredit: 0,
        maxCredit: 0,
        breakDays: new BreakDays().toObject(),
        breaktimes: [],
        wishCourses: []
    },
});