import { PersistentHeap } from "../data-structures/PersistentHeap";
import { WeightedGraph, WgtEdge } from "../data-structures/WeightedGraph";


export class Sidetrack {
    /** sidetrack(u, v, w) = w + d[v] - d[u] */
    public static encode(distance: number[], u: number, v: number, w: number): number {
        return w + distance[v] - distance[u];
    }

    /**  SSSP의 결과를 기반으로 계산된 sidetrack으로 persistent heap을 구성*/
    public static buildSideTrackHeap(graph: WeightedGraph, prevVertex: number[], prevEdgeId: number[], visitedVertex: number[], distance: number[], big: number): PersistentHeap {
        const phHeap = new PersistentHeap(graph.size());

        for (const u of visitedVertex) {
            if (prevVertex[u] !== -1)
                phHeap.set(u, PersistentHeap.copy(phHeap.get(prevVertex[u])));

            const edges = graph.getEdges(u);
            for (let i = 0; i < edges.size(); i++) {
                const edge: WgtEdge = edges.get(i);
                if (edge.getEdgeId() === prevEdgeId[u]) continue;   // SSSP에서 사용된 간선이라면 스킵

                const sidetrack = this.encode(distance, u, edge.getNext(), edge.getWeight());
                if (sidetrack < big) {   // 현재 정점의 heap과 다음 정점의 heap을 합친다
                    phHeap.set(u, PersistentHeap.merge(phHeap.get(u), PersistentHeap.newHeap(u, edge.getNext(), sidetrack)));
                }
            }
        }
        return phHeap;
    }
}