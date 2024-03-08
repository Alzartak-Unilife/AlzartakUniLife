"use client"

import { useCallback, useEffect, useState } from "react";
import RandomGeneratorModule from "../../public/wasm/randomGenerator.js"
import { RandomGenerator } from "@/core/types/randomGenerator.js";


export default function MyForm() {
    const [numbers, setNumbers] = useState({ a: 0, b: 0 });
    const [randomGenerator, setRandomGenerator] = useState<RandomGenerator>();

    const handleRefresh = useCallback(() => {
        if (randomGenerator) {
            setNumbers({ a: randomGenerator.getInt(10, 40), b: randomGenerator.getInt(10, 40) });
        }
    }, [randomGenerator]);

    useEffect(() => {
        const loadWasm = async () => {
            const randomGeneratorModule = await RandomGeneratorModule({
                locateFile: (path: any) => {
                    if (path.endsWith('.wasm')) {
                        return '/wasm/randomGenerator.wasm';
                    }
                    return path;
                },
            });
            setRandomGenerator(new randomGeneratorModule.RandomGenerator());
        }
        loadWasm();
    }, []);

    return (
        <div>
            <input type="text" value={numbers.a} readOnly />
            <input type="text" value={numbers.b} readOnly />
            <br />
            <button onClick={handleRefresh}>Refresh</button>
            <p>Result: {numbers.a + numbers.b}</p>
        </div>
    );
}