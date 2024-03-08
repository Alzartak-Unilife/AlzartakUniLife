import WeightedGraphModule from "../../../../../public/wasm/WeightedGraph";
import { WeightedGraph, WgtEdge } from "./WeightedGraph";


export async function createWeightedEdge(next: number, weight: number, edgeId: number): Promise<WgtEdge> {
    const weightedGraphModule = await WeightedGraphModule({
        locateFile: (path: any) => {
            if (path.endsWith('.wasm')) {
                return '/wasm/WeightedGraph.wasm';
            }
            return path;
        },
    });
    return (new weightedGraphModule.WgtEdge(next, weight, edgeId)) as WgtEdge;
}


export async function createWeightedGraph(grpSize: number = 0): Promise<WeightedGraph> {
    const weightedGraphModule = await WeightedGraphModule({
        locateFile: (path: any) => {
            if (path.endsWith('.wasm')) {
                return '/wasm/WeightedGraph.wasm';
            }
            return path;
        },
    });
    return (new weightedGraphModule.WeightedGraph(grpSize)) as WeightedGraph;
}