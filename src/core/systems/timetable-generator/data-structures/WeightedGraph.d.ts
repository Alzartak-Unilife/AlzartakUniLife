export class WgtEdge {
    constructor(next: number, weight: number, edgeId: number);
    getNext(): number;
    getWeight(): number;
    getEdgeId(): number;
}

export class WeightedGraph {
    constructor(grpSize: number);
    assign(grpSize: number): void;
    expansion(grpSize: number): void;
    addDirectedEdge(u: number, v: number, weight: number): void;
    getEdges(index: number): any;
    size(): number;
}