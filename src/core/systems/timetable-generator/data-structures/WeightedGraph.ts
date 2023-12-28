export class WgtEdge {
    public next: number;
    public weight: bigint;
    public edgeId: number;
    constructor(next: number, weight: bigint, edgeId: number) {
        this.next = next;
        this.weight = weight;
        this.edgeId = edgeId;
    }
}


export class WeightedGraph {
    private grpSize: number;            // 그래프의 크기 (=정점의 개수)
    private edgeCnt: number;         // 간선 카운팅 (간선에 id를 부여할 때 활용)
    private adjList: WgtEdge[][];    // 그래프

    constructor(size: number = 0) {
        this.grpSize = size;
        this.edgeCnt = 0;
        this.adjList = [];
        for (let i = 0; i < this.grpSize; i++) this.adjList[i] = [];
    }

    /** 그래프 크기 설정 */
    public assign(size: number): void {
        this.grpSize = size;
        this.edgeCnt = 0;
        this.adjList = [];
        for (let i = 0; i < this.grpSize; i++) this.adjList[i] = [];
    }

    /** 그래프 확장: 기존 그래프는 보존 */
    public expansion(size: number): void {
        this.grpSize = size;
        for (let i = this.adjList.length; i < this.grpSize; i++) this.adjList[i] = [];
    }

    /** 방향 그래프 추가 */
    public addDirectedEdge(u: number, v: number, weight: bigint): void {
        this.adjList[u].push(new WgtEdge(v, weight, this.edgeCnt++));
    }

    /** 정점과 연결된 Edge List나 그래프 자체를 가져옴 */
    public get(index: number): WgtEdge[] {
        return this.adjList[index];
    }

    public size(): number { return this.grpSize; }
}