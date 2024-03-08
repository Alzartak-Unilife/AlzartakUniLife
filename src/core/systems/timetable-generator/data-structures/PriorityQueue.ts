export interface PqNode {
    key: number;
    value: any;
};


export class PriorityQueue {
    public static SORTTYPE = { LESS: 0, GREATER: 1 };

    private defaultItem: PqNode;
    private size: number;
    private heap: PqNode[];

    private keyCmp: (fstidx: number, sndidx: number) => number;
    private nodeSwap: (fstidx: number, sndidx: number) => void;


    constructor(type: number, defaultItem: PqNode) {
        this.defaultItem = defaultItem;
        this.size = 1;
        this.heap = [{ ...this.defaultItem }];

        this.keyCmp = type === PriorityQueue.SORTTYPE.LESS
            ? (fstidx: number, sndidx: number) => (this.heap[fstidx].key === this.heap[sndidx].key ? 0 : this.heap[fstidx].key < this.heap[sndidx].key ? 1 : -1)
            : (fstidx: number, sndidx: number) => (this.heap[fstidx].key === this.heap[sndidx].key ? 0 : this.heap[fstidx].key > this.heap[sndidx].key ? 1 : -1);

        this.nodeSwap = (fstidx: number, sndidx: number) => {
            let temp = this.heap[fstidx];
            this.heap[fstidx] = this.heap[sndidx];
            this.heap[sndidx] = temp;
        };
    }

    public push(item: PqNode): void {
        this.heap.push(item);
        for (let i = this.size++; i > 1 && this.keyCmp(i >> 1, i) < 0; i >>= 1) this.nodeSwap(i >> 1, i);
    }

    public pop(): void {
        this.heap[1] = this.heap[--this.size];
        this.heap.pop();
        let i = 1, son = i << 1;
        while (son < this.size) {
            // 오른쪽 자식이 있는 경우
            if (son + 1 < this.size)
                son = this.keyCmp(son, son + 1) < 0 ? son + 1 : son;

            // 자식의 우선순위가 부모보다 높은 경우
            if (this.keyCmp(i, son) < 0) {
                this.nodeSwap(i, son);
                i = son;
                son <<= 1;
            } else break;
        }
    }

    public top(): PqNode { return this.heap[1]; }

    public empty(): boolean { return this.size <= 1; }

    public clear(): void {
        this.size = 1;
        this.heap = [{ ...this.defaultItem }];
    }
}