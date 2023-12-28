import { Course } from "@/core/types/Course";
import { CombinatorWithSidetrack } from "./algorithms/CombinatorWithSidetrack";
import { Bit, Bitmask } from "./data-structures/Bitmask";
import { VertexConverter } from "./algorithms/VertexConverter";
import { WeightedGraph } from "./data-structures/WeightedGraph";
import { ICombinator } from "./algorithms/ICombinator";


/** sidetrack을 이용한 조합 생성기를 반환 */
function constructCombinatorWithSidetrack(
    selections: { essential: { course: Course, preference: number }[], normal: { course: Course, preference: number }[] },
    credit: { lowerbound: number, upperbound: number }): CombinatorWithSidetrack | null {

    let conflicts: Bit[] = [];
    let [source, subsource, sink] = [0, 0, 0];
    let [inf, big]: bigint[] = [(25n ** 51n) * 2n, (25n ** 51n)];
    const [graph, revgraph] = [new WeightedGraph(), new WeightedGraph()];
    const vertexConv: VertexConverter = new VertexConverter();

    /* *********************************** 그래프 모델링 *********************************** */

    // preference 가중치를 계산
    const PREFER = { ESSENTIAL: 6, NONE: 6 };
    const preference2weight = (preference: number) => {
        return preference === PREFER.ESSENTIAL || preference === PREFER.NONE ? 0n : (25n ** BigInt(50 - Math.floor(preference * 10)));  // ex) if rating is 4.3 then, 25^7
    }

    // 정점간 충돌 여부를 저장
    const courses = [...selections.essential, ...selections.normal];
    conflicts = new Array(courses.length + 3).fill(Bitmask.default);   // 필수 개수 + 일반 개수 + source/subsource/sink
    for (let i = 0; i < courses.length; i++) {
        for (let j = i + 1; j < courses.length; j++) {
            if (courses[i].course.conflictWith(courses[j].course)) {
                conflicts[i] = Bitmask.insertAt(conflicts[i], j);
                conflicts[j] = Bitmask.insertAt(conflicts[j], i);
            }
        }
    }
    //console.log(conflicts)

    // 필수과목 그룹화
    const essenGroups: number[][] = [];
    if (selections.essential.length > 0) {
        let eGroup: number[] = [0];
        for (const courseNum of [...Array.from({ length: selections.essential.length - 1 }, (_, i) => i + 1)]) {
            if (selections.essential[eGroup[eGroup.length - 1]].course.getBaseCode() === selections.essential[courseNum].course.getBaseCode()) {
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
    const essenCredit = essenGroups.length > 0 ? essenGroups.reduce((sumCredit, group) => { sumCredit += selections.essential[group[0]].course.getCredit(); return sumCredit; }, 0) : 0;
    if (credit.upperbound < essenCredit) return null;

    // lev, source, subsource, sink값 할당 후 그래프 생성
    const normLev: number = credit.upperbound - essenCredit;
    source = selections.essential.length + (normLev * selections.normal.length);
    subsource = source + 1;
    sink = source + 2;
    graph.assign(sink + 1);
    revgraph.assign(sink + 1);
    //console.log(normLev); console.log(source); console.log(subsource); console.log(sink);

    // 치환 함수 구현
    vertexConv.substitute = (num: number, lev: number) => selections.essential.length + ((lev - 1) * selections.normal.length) + num;
    vertexConv.revert = (num: number) => {
        let temp = num;
        if (num < selections.essential.length) temp = num;
        else if (num < source) temp = ((num - selections.essential.length) % selections.normal.length) + selections.essential.length;
        else temp = selections.essential.length + selections.normal.length + (num === source ? 0 : num === subsource ? 1 : 2);
        //console.log(`conv: ${num}->${temp}`);

        if (num < selections.essential.length) return num;
        if (num < source) return ((num - selections.essential.length) % selections.normal.length) + selections.essential.length;
        return selections.essential.length + selections.normal.length + (num === source ? 0 : num === subsource ? 1 : 2);
    };

    // 필수 과목으로 [source, subsource] 그래프 구성
    let prevEssenGroup = [source];
    for (const group of [...essenGroups, [subsource]]) {
        for (const u of prevEssenGroup) {
            for (const v of group) {
                const w = preference2weight(v === subsource ? PREFER.NONE : selections.essential[vertexConv.revert(v)].preference);
                if (Bitmask.exist(conflicts[vertexConv.revert(u)], vertexConv.revert(v))) continue;
                console.log(`${u}->${v}: ${w}`);
                graph.addDirectedEdge(u, v, w);
                revgraph.addDirectedEdge(v, u, w);
            }
        }
        prevEssenGroup = [...group];
    }

    // 일반 과목으로 [subsource, sink] 그래프 구성
    if (normLev === 0) {
        // 필수 과목으로 학점이 다 채워진 경우, subsource와 sink를 직접 연결
        graph.addDirectedEdge(subsource, sink, preference2weight(PREFER.NONE));
        revgraph.addDirectedEdge(sink, subsource, preference2weight(PREFER.NONE));
    }
    else {
        // 남은 학점(=normLev)이 있는 경우, 일반 과목을 추가
        for (let vLev = 1; vLev <= normLev; vLev++) {
            for (let vIdx = 0; vIdx < selections.normal.length; vIdx++) {
                const uLev = vLev - selections.normal[vIdx].course.getCredit();
                if (uLev < 0) continue;
                else if (uLev === 0) {
                    const [u, v, w] = [subsource, vertexConv.substitute(vIdx, vLev), preference2weight(selections.normal[vIdx].preference)];
                    console.log(`${u}->${v}: ${w}`);
                    graph.addDirectedEdge(u, v, w);
                    revgraph.addDirectedEdge(v, u, w);
                }
                else {
                    for (let uIdx = 0; uIdx < vIdx; uIdx++) {
                        const [u, v, w] = [vertexConv.substitute(uIdx, uLev), vertexConv.substitute(vIdx, vLev), preference2weight(selections.normal[vIdx].preference)];
                        if (Bitmask.exist(conflicts[vertexConv.revert(u)], vertexConv.revert(v))) continue;
                        console.log(`${u}->${v}: ${w}`);
                        graph.addDirectedEdge(u, v, w);
                        revgraph.addDirectedEdge(v, u, w);
                    }
                }
            }
        }
        for (let uIdx = 0; uIdx < selections.normal.length; uIdx++) {
            const [u, v, w] = [vertexConv.substitute(uIdx, normLev), sink, preference2weight(PREFER.NONE)];
            console.log(`${u}->${v}: ${w}`);
            graph.addDirectedEdge(u, v, w);
            revgraph.addDirectedEdge(v, u, w);
        }
    }

    return new CombinatorWithSidetrack(graph, revgraph, conflicts, vertexConv, source, sink, inf, big);
}



/** 시간표 생성 클래스 */
export class TimetableGenerator {
    private mCombinator: ICombinator | null;
    //private mSelections: { essential: { course: Course, preference: number }[], normal: { course: Course, preference: number }[] };
    private mCourses: { course: Course, preference: number }[];
    private mCombinations: Bit[];


    constructor(courses: { essential: { course: Course, preference: number }[], normal: { course: Course, preference: number }[] }, credit: { lowerbound: number, upperbound: number }) {
        //this.mSelections = selections;
        this.mCourses = [...courses.essential, ...courses.normal];
        this.mCombinations = [];
        // TODO: courses의 개수에 따라 CombinatorComponentDivide, CombinatorWithSidetrack 둘 중에 하나를 선택해야함
        // 일단은 CombinatorWithSidetrack 고정으로 구현
        this.mCombinator = constructCombinatorWithSidetrack(courses, credit);
    }


    /** count개의 조합을 생성한다. 만약 더 이상 생성할 수 있는 조합이 없다면 빈 배열을 리턴한다*/
    private createCombinations(count: number = 1): Bit[] {
        return this.mCombinator ? this.mCombinator.nextCombination(count) : [];
    }


    /** bit형식의 조합을 과목조합으로 변환 */
    private bit2Course(bitCombination: Bit): Course[] {
        const res: Course[] = [];   // bit에 포함된 source, subsrc, sink제외     
        for (const [courseNum, { course, preference }] of this.mCourses.entries()) {
            if (Bitmask.exist(bitCombination, courseNum)) res.push(course);
        }
        return res;
    }


    /** count개의 과목 조합(시간표)를 반환한다 */
    public getCourseCombination(index: number, count: number = 1): Course[][] {
        const res: Course[][] = [];
        for (let i = index; i < index + count; i++) {
            // 조합의 수가 i보다 작은 경우, 추가 조합 생성
            while (this.mCombinations.length <= i) {
                const newComb = this.createCombinations(1);
                if (newComb.length > 0) this.mCombinations.push(...newComb);
                else { this.mCombinator = null; return res; }   // 더 이상 조합 생성이 불가능한 경우 조합 생성기를 제거(더 이상 필요가 없다)하고 리턴
            }
            res.push(this.bit2Course(this.mCombinations[i]));
        }
        return res;
    }


    /** count개의 과목 조합(시간표)를 할당한다 */
    public reserveCourseCombination(count: number = 1) {
        if (count <= this.mCombinations.length) return;
        const newCombs = this.createCombinations(count - this.mCombinations.length);
        newCombs.forEach(comb => { this.mCombinations.push(comb); });
        // 더 이상 조합 생성이 불가능한 경우 조합 생성기를 제거(더 이상 필요가 없다)함
        if (newCombs.length < count - this.mCombinations.length) this.mCombinator = null;
    }


    /** 현재 할당된 과목 조합(시간표) 개수를 반환한다 */
    public countCourseCombination(): number {
        return this.mCombinations.length;
    }
}