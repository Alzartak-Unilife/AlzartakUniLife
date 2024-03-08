import PersistentHeapModule from "../../../../../public/wasm/PersistentHeap";
import { PersistentHeap } from "./PersistentHeap";

export async function createPersistentHeap(heapSize: number = 0): Promise<PersistentHeap> {
    const weightedGraphModule = await PersistentHeapModule({
        locateFile: (path: any) => {
            if (path.endsWith('.wasm')) {
                return '/wasm/PersistentHeap.wasm';
            }
            return path;
        },
    });
    return (new weightedGraphModule.PersistentHeap(heapSize)) as PersistentHeap;
}