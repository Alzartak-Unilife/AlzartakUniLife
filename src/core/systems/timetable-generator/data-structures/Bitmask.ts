export type Bit = bigint;

export class Bitmask {
    public static default: Bit = 0n;

    public static insertAt(bit: Bit, nth: number): Bit { return bit | (1n << BigInt(nth)); }
    public static removeAt(bit: Bit, nth: number): Bit { return bit & ~(1n << BigInt(nth)); }

    public static union(fstBit: Bit, sndBit: Bit): Bit { return fstBit | sndBit; }
    public static intersection(fstBit: Bit, sndBit: Bit): Bit { return fstBit & sndBit; }
    public static difference(fstBit: Bit, sndBit: Bit): Bit { return fstBit & ~sndBit; }

    public static exist(bit: Bit, nth: number): boolean { return Boolean(bit & (1n << BigInt(nth))); }
    public static empty(bit: Bit): boolean { return bit === 0n; }
}