export class VertexConverter {
    public substitute: (vertex: number, level: number) => number;
    public revert: (vertex: number) => number;

    constructor() {
        this.substitute = (vertex: number, level: number) => vertex;
        this.revert = (vertex: number) => vertex;
    }
};