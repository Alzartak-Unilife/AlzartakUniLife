export class RandomGenerator {
    public static randNumber(lowerBound: number, upperBound: number): number {
        return Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;
    }
}