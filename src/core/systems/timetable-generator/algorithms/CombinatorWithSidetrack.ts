import { Bit, Bitmask } from "../data-structures/Bitmask";
import { PersistentHeap, PhNode } from "../data-structures/PersistentHeap";
import { PriorityQueue } from "../data-structures/PriorityQueue";
import { WeightedGraph } from "../data-structures/WeightedGraph";
import { ICombinator } from "./ICombinator";
import { SSSP } from "./SSSP";
import { Sidetrack } from "./Sidetrack";
import { VertexConverter } from "./VertexConverter";

export class CombinatorWithSidetrack implements ICombinator {
    private INF: bigint;
    private BIG: bigint;
    private STATE: { BEGIN: number, CONTINUE: number, END: number };

    private source: number;
    private sink: number;

    private conflicts: Bit[];                            // 정점 사이의 충돌 정보
    private vertexConv: VertexConverter;                 // 정점 치환

    private nextVertex: number[];                        // 현재 정점에서 이동해야할 다음 정점
    private distance: bigint[];                          // 정점에서 sink까지의 최적가중치    
    private suffixPath: { set: Bit, conflict: Bit }[];   // 정점에서 sink까지의 경로

    private phHeap: PersistentHeap;                      // sidetrack persistent heap
    private pq: PriorityQueue;                           // sidetrack priority queue
    private currState: number;

    constructor(graph: WeightedGraph, revgraph: WeightedGraph, conflicts: Bit[], vertexConv: VertexConverter, source: number, sink: number, inf: bigint, big: bigint) {
        this.source = source;
        this.sink = sink;
        this.INF = inf;
        this.BIG = big;
        this.conflicts = conflicts;
        this.vertexConv = vertexConv;

        // revgraph에 대해 sssp를 구하고, 이 데이터를 기반으로 suffix path, sidetrack persistent heap를 구한다
        const { prevVertex, prevEdgeId, visitedVertex, distance } = SSSP.dijkstra(revgraph, sink, inf);
        this.nextVertex = prevVertex;
        this.distance = distance;
        this.suffixPath = SSSP.restorePaths(prevVertex, conflicts, vertexConv, sink);
        this.phHeap = Sidetrack.buildSideTrackHeap(graph, prevVertex, prevEdgeId, visitedVertex, distance, big);
        this.pq = new PriorityQueue(PriorityQueue.SORTTYPE.LESS, { key: Bitmask.default, value: [] });

        // 조합 시스템의 상태를 저장
        this.STATE = { BEGIN: -1, CONTINUE: 0, END: 1 };
        this.currState = this.distance[this.source] > this.BIG ? this.STATE.END : this.STATE.BEGIN;
    }


    /** 두 경로의 충돌 여부를 확인 */
    private isPathConflict(fstPath: { set: Bit, conflict: Bit }, sndPath: { set: Bit, conflict: Bit }): boolean {
        return Boolean(Bitmask.intersection(Bitmask.union(fstPath.set, sndPath.set), Bitmask.union(fstPath.conflict, sndPath.conflict)));
    }


    /** source -> sink의 경로가 존재하는지 확인하고 mPQueue 초기화 */
    private initializer(): Bit | null {
        const prefix: { set: Bit, conflict: Bit } = { set: Bitmask.insertAt(Bitmask.default, this.vertexConv.revert(this.source)), conflict: Bitmask.default };
        const suffix: { set: Bit, conflict: Bit } = this.suffixPath[this.nextVertex[this.source]];
        const phNode: (PhNode | null) = this.phHeap.get(this.source);

        this.currState = this.STATE.CONTINUE;
        if (phNode !== null) this.pq.push({ key: this.distance[this.source] + phNode.value.sidetrack, value: [phNode, prefix, this.source] });
        return !this.isPathConflict(prefix, suffix) ? Bitmask.union(prefix.set, suffix.set) : null;
    }


    /** 다음 kValue개의 최적의 조합을 찾음*/
    public nextCombination(count: number = 1): Bit[] {
        const paths: Bit[] = [];

        if (this.currState === this.STATE.END) return paths;
        if (this.currState === this.STATE.BEGIN) {
            const path = this.initializer();
            if (path !== null) {
                paths.push(path);
                //console.log(`path: ${path}`)
            }
        }

        const insert2prefix = (prefix: { set: Bit, conflict: Bit }, newVtx: number) => {
            //console.log(`${newVtx}, ${this.mVertexConv.revert(newVtx)}, ${this.mConflicts[this.mVertexConv.revert(newVtx)]}, ${typeof this.mConflicts[this.mVertexConv.revert(newVtx)]}`)
            prefix.set = Bitmask.insertAt(prefix.set, this.vertexConv.revert(newVtx));
            prefix.conflict = Bitmask.union(prefix.conflict, this.conflicts[this.vertexConv.revert(newVtx)]);
            return newVtx;
        };

        while (!this.pq.empty() && paths.length < count) {
            const { key: weight, value: [currNode, prevPrefix, prevLastVtx] } = this.pq.top();
            let currPrefix: { set: Bit, conflict: Bit } = { ...(prevPrefix as { set: Bit, conflict: Bit }) };
            let currLastVtx: number = prevLastVtx as number;
            this.pq.pop();

            // prefix와 suffix사이의 경로 복구
            if (currLastVtx === (currNode as PhNode).value.curr) currLastVtx = insert2prefix(currPrefix, (currNode as PhNode).value.next);
            else {
                for (let v = this.nextVertex[currLastVtx]; v !== (currNode as PhNode).value.curr && v >= 0; v = this.nextVertex[v]) currLastVtx = insert2prefix(currPrefix, v);
                currLastVtx = insert2prefix(currPrefix, (currNode as PhNode).value.curr);
                currLastVtx = insert2prefix(currPrefix, (currNode as PhNode).value.next);
            }

            //console.log(`PQ: ${(currNode as PhNode).value.curr}, ${prevPrefix.set}, ${prevLastVtx} -> ${currPrefix.set}, ${currLastVtx}`)
            if (!this.isPathConflict(currPrefix, this.suffixPath[this.nextVertex[currLastVtx]])) {
                paths.push(Bitmask.union(currPrefix.set, this.suffixPath[this.nextVertex[currLastVtx]].set));
                //console.log(`path: ${Bitmask.union(currPrefix.set, this.suffixPath[this.nextVertex[currLastVtx]].set)}`)
            }

            // 현재 sidetrack은 포함하지 않음. 다른 sidetrack으로 대체 하거나 아예 대체하지 않음
            for (const son of (currNode as PhNode).son) {
                if (son === null) continue;
                this.pq.push({ key: weight - (currNode as PhNode).value.sidetrack + son.value.sidetrack, value: [son, prevPrefix, prevLastVtx] });
            }

            // 현재 sidetrack을 포함. 만약 현재 sidetrack을 포함한 prefix사이에서 충돌이 생긴다면 무시
            const nextNode: (PhNode | null) = this.phHeap.get(currLastVtx);
            if (!Boolean(Bitmask.intersection(currPrefix.set, currPrefix.conflict)) && nextNode !== null)
                this.pq.push({ key: weight + nextNode.value.sidetrack, value: [nextNode, currPrefix, currLastVtx] });
        }

        if (paths.length < count) this.currState = this.STATE.END;   // 추가로 구한 path의 개수가 count미만 이라는 것은 더 이상의 조합은 없다는 말
        return paths;
    }

    /** 조합이 남았는지 확인 */
    public isEndPoint(): boolean { return this.currState === this.STATE.END; }
}