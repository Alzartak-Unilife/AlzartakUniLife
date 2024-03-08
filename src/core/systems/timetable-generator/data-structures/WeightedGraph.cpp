#include <emscripten/bind.h>

#include <vector>

class WgtEdge {
 private:
  int next;       // 다음 정점
  double weight;  // 간선 번호
  int edgeId;     // 가중치

 public:
  WgtEdge(int _next, double _weight, int _edgeId)
      : next(_next), weight(_weight), edgeId(_edgeId) {}

  int getNext() const { return next; }
  double getWeight() const { return weight; }
  int getEdgeId() const { return edgeId; }
};

class WeightedGraph {
 private:
  int grpSize;  // 그래프의 크기 (=정점의 개수)
  int edgeCnt;  // 간선 카운팅 (간선에 id를 부여할 때 활용)
  std::vector<std::vector<WgtEdge>> adjList;  // 그래프

 public:
  WeightedGraph(int _grpSize = 0) { assign(_grpSize); }

 public:  // 그래프 크기 설정
  void assign(int _grpSize) {
    grpSize = _grpSize;
    edgeCnt = 0;
    adjList.assign(_grpSize, std::vector<WgtEdge>());
  }

 public:  // 그래프 확장: 기존 그래프는 보존
  void expansion(int _grpSize) {
    grpSize = _grpSize;
    adjList.resize(_grpSize);
  }

 public:  // 방향 그래프 추가
  void addDirectedEdge(int u, int v, double weight) {
    adjList[u].push_back(WgtEdge(v, weight, edgeCnt++));
  }

 public:  // 정점과 연결된 Edge List를 가져옴
  std::vector<WgtEdge> getEdges(int index) { return adjList[index]; }

 public:  // 그래프 크기 반환
  int size() { return grpSize; }
};

EMSCRIPTEN_BINDINGS(my_module) {
  emscripten::class_<WgtEdge>("WgtEdge")
      .constructor<int, double, int>()
      .function("getNext", &WgtEdge::getNext)
      .function("getWeight", &WgtEdge::getWeight)
      .function("getEdgeId", &WgtEdge::getEdgeId);

  emscripten::class_<WeightedGraph>("WeightedGraph")
      .constructor<int>()
      .function("assign", &WeightedGraph::assign)
      .function("expansion", &WeightedGraph::expansion)
      .function("addDirectedEdge", &WeightedGraph::addDirectedEdge)
      .function("getEdges", &WeightedGraph::getEdges)
      .function("size", &WeightedGraph::size);

  emscripten::register_vector<WgtEdge>("VectorWgtEdge");
}