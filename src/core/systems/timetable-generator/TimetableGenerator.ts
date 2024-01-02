import { Course } from "@/core/types/Course";
import { CombinatorWithSidetrack } from "./algorithms/CombinatorWithSidetrack";
import { Bit, Bitmask } from "./data-structures/Bitmask";
import { VertexConverter } from "./algorithms/VertexConverter";
import { WeightedGraph } from "./data-structures/WeightedGraph";
import { ICombinator } from "./algorithms/ICombinator";
import { GeneratorConfig, GeneratorConfigObject } from "@/core/types/GeneratorConfig";


/** sidetrack을 이용한 조합 생성기를 반환 */
function constructCombinatorWithSidetrack(essentialCourses: Course[], normalCourses: Course[], minCredit: number, maxCredit: number): CombinatorWithSidetrack | null {

    let conflicts: Bit[] = [];
    let [source, subsource, sink] = [0, 0, 0];
    let [inf, big]: bigint[] = [(25n ** 51n) * 2n, (25n ** 51n)];
    const [graph, revgraph] = [new WeightedGraph(), new WeightedGraph()];
    const vertexConv: VertexConverter = new VertexConverter();

    /* *********************************** 그래프 모델링 *********************************** */

    // preference 가중치를 계산
    const PREFER = { ESSENTIAL: 6, NONE: 6 };
    const rating2weight = (rating: number) => {
        return rating === PREFER.ESSENTIAL || rating === PREFER.NONE ? 0n : (25n ** BigInt(50 - Math.floor(rating * 10)));  // ex) if rating is 4.3 then, 25^7
    }

    // 정점간 충돌 여부를 저장
    const courses = [...essentialCourses, ...normalCourses];
    conflicts = new Array(courses.length + 3).fill(Bitmask.default);   // 필수 개수 + 일반 개수 + source/subsource/sink
    for (let i = 0; i < courses.length; i++) {
        for (let j = i + 1; j < courses.length; j++) {
            if (courses[i].conflictWith(courses[j])) {
                conflicts[i] = Bitmask.insertAt(conflicts[i], j);
                conflicts[j] = Bitmask.insertAt(conflicts[j], i);
            }
        }
    }
    //console.log(conflicts)

    // 필수과목 그룹화
    const essenGroups: number[][] = [];
    if (essentialCourses.length > 0) {
        let eGroup: number[] = [0];
        for (const courseNum of [...Array.from({ length: essentialCourses.length - 1 }, (_, i) => i + 1)]) {
            if (essentialCourses[eGroup[eGroup.length - 1]].getBaseCode() === essentialCourses[courseNum].getBaseCode()) {
                // 최근에 생성된 그룹에 속한 과목들과 같은 id.base를 가진 과목(= 같은 과목 다른 분반)이면 같은 그룹에 포함
                eGroup.push(courseNum);
            } else {
                // 다른 과목이라면 essenGroups에 기존 그룹을 추가하고, 새로운 그룹을 생성
                essenGroups.push(eGroup);
                eGroup = [courseNum];
            }
        }
        essenGroups.push(eGroup);   // 마지막에 생성된 그룹 추가
    }
    //console.log(essenGroups);


    // 필수과목들의 학점 총 합이, 목표학점 보다 높은 경우 null 리턴
    const essenCredit = essenGroups.length > 0 ? essenGroups.reduce((sumCredit, group) => { sumCredit += essentialCourses[group[0]].getCredit(); return sumCredit; }, 0) : 0;
    if (maxCredit < essenCredit) return null;

    // lev, source, subsource, sink값 할당 후 그래프 생성
    const normLev: number = maxCredit - essenCredit;
    source = essentialCourses.length + (normLev * normalCourses.length);
    // selections.essential.length + (normLev * selections.normal.length);
    subsource = source + 1;
    sink = source + 2;
    graph.assign(sink + 1);
    revgraph.assign(sink + 1);
    //console.log(normLev); console.log(source); console.log(subsource); console.log(sink);

    // 치환 함수 구현
    vertexConv.substitute = (num: number, lev: number) => essentialCourses.length + ((lev - 1) * normalCourses.length) + num;
    vertexConv.revert = (num: number) => {
        let temp = num;
        if (num < essentialCourses.length) temp = num;
        else if (num < source) temp = ((num - essentialCourses.length) % normalCourses.length) + essentialCourses.length;
        else temp = essentialCourses.length + normalCourses.length + (num === source ? 0 : num === subsource ? 1 : 2);
        //console.log(`conv: ${num}->${temp}`);

        if (num < essentialCourses.length) return num;
        if (num < source) return ((num - essentialCourses.length) % normalCourses.length) + essentialCourses.length;
        return essentialCourses.length + normalCourses.length + (num === source ? 0 : num === subsource ? 1 : 2);
    };

    // 필수 과목으로 [source, subsource] 그래프 구성
    let prevEssenGroup = [source];
    for (const group of [...essenGroups, [subsource]]) {
        for (const u of prevEssenGroup) {
            for (const v of group) {
                const w = rating2weight(v === subsource ? PREFER.NONE : essentialCourses[vertexConv.revert(v)].getRating());
                if (Bitmask.exist(conflicts[vertexConv.revert(u)], vertexConv.revert(v))) continue;
                //console.log(`${u}->${v}: ${w}`);
                graph.addDirectedEdge(u, v, w);
                revgraph.addDirectedEdge(v, u, w);
            }
        }
        prevEssenGroup = [...group];
    }

    // 일반 과목으로 [subsource, sink] 그래프 구성
    const creditFreeRide = maxCredit - minCredit;
    if (normLev === 0) {
        // 필수 과목으로 학점이 다 채워진 경우, subsource와 sink를 직접 연결
        graph.addDirectedEdge(subsource, sink, rating2weight(PREFER.NONE));
        revgraph.addDirectedEdge(sink, subsource, rating2weight(PREFER.NONE));
    }
    else {
        // 남은 학점(=normLev)이 있는 경우, 일반 과목을 추가
        for (let vLev = 1; vLev <= normLev; vLev++) {
            for (let vIdx = 0; vIdx < normalCourses.length; vIdx++) {
                const uLev = vLev - normalCourses[vIdx].getCredit();
                if (uLev < 0) continue;
                else if (uLev === 0) {
                    const [u, v, w] = [subsource, vertexConv.substitute(vIdx, vLev), rating2weight(normalCourses[vIdx].getRating())];
                    //console.log(`${u}->${v}: ${w}`);
                    graph.addDirectedEdge(u, v, w);
                    revgraph.addDirectedEdge(v, u, w);
                }
                else {
                    for (let uIdx = 0; uIdx < vIdx; uIdx++) {
                        const [u, v, w] = [vertexConv.substitute(uIdx, uLev), vertexConv.substitute(vIdx, vLev), rating2weight(normalCourses[vIdx].getRating())];
                        if (Bitmask.exist(conflicts[vertexConv.revert(u)], vertexConv.revert(v))) continue;
                        //console.log(`${u}->${v}: ${w}`);
                        graph.addDirectedEdge(u, v, w);
                        revgraph.addDirectedEdge(v, u, w);
                    }
                }
            }
        }

        for (let uIdx = 0; uIdx < normalCourses.length; uIdx++) {
            for (let free = 0; free <= creditFreeRide; free++) {
                if (normLev - free <= 0) continue;
                const [u, v, w] = [vertexConv.substitute(uIdx, normLev - free), sink, rating2weight(PREFER.NONE)];
                //console.log(`${u}->${v}: ${w}`);
                graph.addDirectedEdge(u, v, w);
                revgraph.addDirectedEdge(v, u, w);
            }
        }
    }

    return new CombinatorWithSidetrack(graph, revgraph, conflicts, vertexConv, source, sink, inf, big);
}



/** 시간표 생성 클래스 */
export class TimetableGenerator {
    private combinator: ICombinator | null;
    private courses: Course[];
    private combinations: Bit[];


    constructor(generatorConfig: GeneratorConfigObject) {
        const essentialCourses = GeneratorConfig.fromObject(generatorConfig).getEssencialWishCourses();
        const normalCourses = GeneratorConfig.fromObject(generatorConfig).getNormalWishCourses();

        this.courses = [...essentialCourses, ...normalCourses];
        this.combinations = [];
        this.combinator = constructCombinatorWithSidetrack(essentialCourses, normalCourses, generatorConfig.minCredit, generatorConfig.maxCredit);
    }


    /** count개의 조합을 생성한다. 만약 더 이상 생성할 수 있는 조합이 없다면 빈 배열을 리턴한다*/
    private createCombinations(count: number = 1): Bit[] {
        return this.combinator ? this.combinator.nextCombination(count) : [];
    }


    /** bit형식의 조합을 과목조합으로 변환 */
    private bit2Course(bitCombination: Bit): Course[] {
        const res: Course[] = [];   // bit에 포함된 source, subsrc, sink제외  
        this.courses.forEach((course, idx) => {
            if (Bitmask.exist(bitCombination, idx)) res.push(course);
        });
        return res;
    }


    /** count개의 과목 조합(시간표)를 반환한다 */
    public getCourseCombination(index: number, count: number = 1): Course[][] {
        const res: Course[][] = [];
        for (let i = index; i < index + count; i++) {
            // 조합의 수가 i보다 작은 경우, 추가 조합 생성
            while (this.combinations.length <= i) {
                const newComb = this.createCombinations(1);
                if (newComb.length > 0) this.combinations.push(...newComb);
                else { this.combinator = null; return res; }   // 더 이상 조합 생성이 불가능한 경우 조합 생성기를 제거(더 이상 필요가 없다)하고 리턴
            }
            const courses = this.bit2Course(this.combinations[i]);
            if (courses.length > 0)
                res.push(this.bit2Course(this.combinations[i]));
        }
        return res;
    }


    /** count개의 과목 조합(시간표)를 할당한다 */
    public reserveCourseCombination(count: number = 1) {
        if (count <= this.combinations.length) return;
        const newCombs = this.createCombinations(count - this.combinations.length);
        newCombs.forEach(comb => { this.combinations.push(comb); });
        // 더 이상 조합 생성이 불가능한 경우 조합 생성기를 제거(더 이상 필요가 없다)함
        if (newCombs.length < count - this.combinations.length) this.combinator = null;
    }


    /** 현재 할당된 과목 조합(시간표) 개수를 반환한다 */
    public countCourseCombination(): number {
        return this.combinations.length;
    }
}