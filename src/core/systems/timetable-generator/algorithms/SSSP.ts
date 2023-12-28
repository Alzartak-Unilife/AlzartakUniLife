import { Bit, Bitmask } from "../data-structures/Bitmask";
import { PriorityQueue } from "../data-structures/PriorityQueue";
import { WeightedGraph } from "../data-structures/WeightedGraph";
import { VertexConverter } from "./VertexConverter";


export class SSSP {
    /** dijkstra */
    public static dijkstra(graph: WeightedGraph, source: number, inf: bigint): { prevVertex: number[], prevEdgeId: number[], visitedVertex: number[], distance: bigint[] } {
        const INF = inf;//typeof (0 as datatype) === 'number' ? BigInt(2e9) : (10n ** 55n) * 2n;
        const prevVertex: number[] = new Array(graph.size()).fill(-1);
        const prevEdgeId: number[] = new Array(graph.size()).fill(-1);
        const visitedVertex: number[] = [];
        const distance: bigint[] = new Array(graph.size()).fill(INF);
        const pq = new PriorityQueue(PriorityQueue.SORTTYPE.LESS, { key: 0n, value: -1 });

        const enque = (curr: number, next: number, weight: bigint, edgeId: number) => {
            if (distance[next] > weight) {
                distance[next] = weight;
                prevVertex[next] = curr;
                prevEdgeId[next] = edgeId;
                pq.push({ key: weight, value: next });
            }
        };

        enque(-1, source, 0n, -1);
        while (!pq.empty()) {
            const { key: weight, value: curr } = pq.top(); pq.pop();

            if (distance[curr] !== weight) continue;
            visitedVertex.push(curr);

            for (const edge of graph.get(curr))
                enque(curr, edge.next, weight + edge.weight, edge.edgeId);
        }
        console.log(distance); console.log(prevVertex); console.log(prevEdgeId); console.log(visitedVertex);
        return { prevVertex: prevVertex, prevEdgeId: prevEdgeId, visitedVertex: visitedVertex, distance: distance };
    }


    /** sssp의 정점 이동 데이터로부터 source로부터 모든 정점까지의 경로를 복구함 */
    public static restorePaths(prevVertex: number[], conflicts: Bit[], vertexConv: VertexConverter, source: number) {
        const paths: { set: Bit, conflict: Bit }[] = [];
        for (let i = 0; i < prevVertex.length; i++) paths[i] = { set: Bitmask.default, conflict: Bitmask.default };
        paths[source].set = Bitmask.insertAt(paths[source].set, vertexConv.revert(source));
        for (let i = 0; i < prevVertex.length; i++)
            if (prevVertex[i] !== -1) this.restorePathsWithDfs(paths, prevVertex, conflicts, vertexConv, i);
        return paths;
    }

    private static restorePathsWithDfs(paths: { set: Bit, conflict: Bit }[], prevVertex: number[], conflicts: Bit[], vertexConv: VertexConverter, curr: number): { set: Bit, conflict: Bit } {
        if (!Bitmask.empty(paths[curr].set)) return { ...paths[curr] };
        paths[curr] = this.restorePathsWithDfs(paths, prevVertex, conflicts, vertexConv, prevVertex[curr]);
        paths[curr].set = Bitmask.insertAt(paths[curr].set, vertexConv.revert(curr));
        paths[curr].conflict = Bitmask.union(paths[curr].conflict, conflicts[vertexConv.revert(curr)]);
        return { ...paths[curr] };
    }
}