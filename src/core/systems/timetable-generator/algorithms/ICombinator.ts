import { Bit } from "../data-structures/Bitmask";

export interface ICombinator {
    nextCombination(count: number): Bit[];
}