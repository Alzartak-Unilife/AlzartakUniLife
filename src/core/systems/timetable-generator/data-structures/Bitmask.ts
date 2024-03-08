export type Bit = number;

export class Bitmask {
    public static default: Bit = 0;

    public static insertAt(bit: Bit, nth: number): Bit { return bit | (2 ** nth); }
    public static removeAt(bit: Bit, nth: number): Bit { return bit & ~(2 ** nth); }

    public static union(fstBit: Bit, sndBit: Bit): Bit { return fstBit | sndBit; }
    public static intersection(fstBit: Bit, sndBit: Bit): Bit { return fstBit & sndBit; }
    public static difference(fstBit: Bit, sndBit: Bit): Bit { return fstBit & ~sndBit; }

    public static exist(bit: Bit, nth: number): boolean { return Boolean(bit & (2 ** nth)); }
    public static empty(bit: Bit): boolean { return bit === 0; }
}