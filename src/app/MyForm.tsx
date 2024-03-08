"use client"

import { useCallback, useEffect, useState } from "react";
import WeightedGraphModule from "../../public/wasm/WeightedGraph.js";
import { WeightedGraph, WgtEdge } from "@/core/systems/timetable-generator/data-structures/WeightedGraph";

export default function MyForm() {
    const [weightedGraph, setWeightedGraph] = useState<any>();

    const getRandomInt = useCallback((lowerBound: number, upperBound: number) => {
        return Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;
    }, []);

    const handleRefresh = useCallback(() => {
        if (weightedGraph) {
            for (let i = 0; i < 20; i++) {
                console.log(2 ** 64)
                weightedGraph.addDirectedEdge(getRandomInt(1, 9), getRandomInt(1, 9), 2 ** 50);
            }
            for (let i = 1; i < 10; i++) {
                const edges = weightedGraph.getEdges(i);
                console.log(edges)
                for (let j = 0; j < edges.size(); j++) {
                    const edge: WgtEdge = edges.get(j);
                    console.log(`${j} -> ${edge.getNext()} : ${edge.getWeight()}, ${edge.getEdgeId()}`);
                }
            }
        }
    }, [weightedGraph]);

    useEffect(() => {
        const loadWasm = async () => {
            const weightedGraphModule = await WeightedGraphModule({
                locateFile: (path: any) => {
                    if (path.endsWith('.wasm')) {
                        return '/wasm/WeightedGraph.wasm';
                    }
                    return path;
                },
            });
            setWeightedGraph(new weightedGraphModule.WeightedGraph(10));
        }
        loadWasm();
    }, []);

    return (
        <div>
            <button onClick={handleRefresh}>Refresh</button>
        </div>
    );
}