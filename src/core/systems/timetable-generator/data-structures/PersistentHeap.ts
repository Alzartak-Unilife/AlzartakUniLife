import { RandomGenerator } from "../utility/RandomGenerator"


export class PhNode {
    public son: (PhNode | null)[];
    public value: { curr: number; next: number; sidetrack: number; };

    constructor() {
        this.son = [null, null];
        this.value = { curr: 0, next: 0, sidetrack: 0 };
    }

    public static compare(fst: PhNode, snd: PhNode) {
        if (fst.value.sidetrack === snd.value.sidetrack) return 0;
        return fst.value.sidetrack < snd.value.sidetrack ? -1 : 1;
    }
}


export class PersistentHeap {
    private size: number;
    private heapTable: (PhNode | null)[];

    constructor(size: number = 0) {
        this.size = size;
        this.heapTable = new Array(this.size).fill(null);
    }

    public assign(size: number): void {
        this.size = size;
        this.heapTable = new Array(this.size).fill(null);
    }

    public get(idx: number): (PhNode | null) {
        return this.heapTable[idx];
    }

    public set(idx: number, node: (PhNode | null)): void {
        this.heapTable[idx] = node;
    }

    /** 새로운 Heap 추가 */
    public static newHeap(u: number, v: number, sidetrack: number): PhNode {
        let newNode = new PhNode();
        newNode.value = { curr: u, next: v, sidetrack: sidetrack };
        return newNode;
    }

    /** PhNode 복사 */
    public static copy(node: (PhNode | null)): (PhNode | null) {
        if (node === null) return null;
        const newNode = new PhNode();
        newNode.son[0] = node.son[0];
        newNode.son[1] = node.son[1];
        newNode.value = { curr: node.value.curr, next: node.value.next, sidetrack: node.value.sidetrack };
        return newNode;
    }

    /** 주어진 두 Heap을 합치고, 최상위 노드를(root)를 반환 */
    public static merge(fstNode: (PhNode | null), sndNode: (PhNode | null)): (PhNode | null) {
        if (fstNode === null) return sndNode;
        if (sndNode === null) return fstNode;
        if (PhNode.compare(fstNode, sndNode) > 0) {
            let temp = fstNode;
            fstNode = sndNode;
            sndNode = temp;
        }
        let sonIdx = RandomGenerator.randNumber(0, 1);
        // TODO: 나중에 null오류가 있다면 확인 필요
        if (fstNode.son[sonIdx] !== null) fstNode.son[sonIdx] = PersistentHeap.copy(fstNode.son[sonIdx]);
        fstNode.son[sonIdx] = PersistentHeap.merge(fstNode.son[sonIdx], sndNode);
        return fstNode;
    }
}