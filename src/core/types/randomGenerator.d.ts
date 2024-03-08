// randomGenerator.d.ts
export class RandomGenerator {
    constructor();
    getInt(lowerBound: number, upperBound: number): number;
    getIntVector(lowerBound: number, upperBound: number, count: number): number[];
}