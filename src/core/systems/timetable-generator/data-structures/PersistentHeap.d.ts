export class PhNode {
    getCurrVertex(): number;
    getNextVertex(): number;
    getSideTrack(): number;
    getChild(nth: number): PhNode;
}

export class PersistentHeap {
    constructor(tableSize: number);
    assign(tableSize: number): void;
    getHeap(idx: number): PhNode;
    copyTo(idx: number, desIdx: number): void;
    insertAt(idx: number, curr: number, next: number, sidetrack: number): void;
}