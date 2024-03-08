#include <emscripten/bind.h>

#include <algorithm>
#include <functional>
#include <random>
#include <vector>

class PhNode {
 private:
  int curr;             // 현재 정점
  int next;             // 다음 정점
  double sidetrack;     // 대체 경로 비용
  PhNode *children[2];  // 자식 힙

 public:
  PhNode(int _curr, int _next, double _sidetrack, PhNode *_left, PhNode *_right)
      : curr(_curr), next(_next), sidetrack(_sidetrack) {
    children[0] = _left;
    children[1] = _right;
  }

  int getCurrVertex() { return curr; }
  int getNextVertex() { return next; }
  double getSideTrack() { return sidetrack; }
  PhNode getChild(int _nth) {
    return children[_nth] == nullptr ? PhNode(-1, -1, -1, nullptr, nullptr)
                                     : *children[_nth];
  }

  // 파라미터로 받은 node를 복사
  static PhNode *copy(PhNode *node) {
    if (node == (PhNode *)nullptr) return (PhNode *)nullptr;
    return new PhNode(node->curr, node->next, node->sidetrack,
                      node->children[0], node->children[1]);
  }

  // 두 노드 합치기
  static PhNode *merge(PhNode *fst, PhNode *snd,
                       std::function<int(int, int)> &randomInt) {
    if (fst == (PhNode *)nullptr) return snd;
    if (snd == (PhNode *)nullptr) return fst;
    if (fst->sidetrack > snd->sidetrack) std::swap(fst, snd);
    int idx = randomInt(0, 1);
    if (fst->children[idx] != (PhNode *)nullptr)
      fst->children[idx] = PhNode::copy(fst->children[idx]);
    fst->children[idx] = PhNode::merge(fst->children[idx], snd, randomInt);
    return fst;
  }
};

class PersistentHeap {
 private:
  int tableSize;
  std::vector<PhNode *> heapTable;
  std::mt19937 randomGen;

 public:
  PersistentHeap(int _tableSize) : randomGen(0x69420) { assign(_tableSize); }

  void assign(int _tableSize) {
    tableSize = _tableSize;
    heapTable.assign(_tableSize, nullptr);
  }

  PhNode getHeap(int _idx) {
    return heapTable[_idx] == nullptr ? PhNode(-1, -1, -1, nullptr, nullptr)
                                      : *heapTable[_idx];
  }

  // PhNode 복사
  void copyTo(int _idx, int _desIdx) {
    heapTable[_desIdx] = PhNode::copy(heapTable[_idx]);
  }

  // 새 PhNode 삽입
  void insertAt(int _idx, int _curr, int _next, double _sidetrack) {
    std::function<int(int, int)> randomInt = [&](int lb, int ub) {
      return std::uniform_int_distribution<int>(lb, ub)(randomGen);
    };

    heapTable[_idx] = PhNode::merge(
        heapTable[_idx], new PhNode(_curr, _next, _sidetrack, nullptr, nullptr),
        randomInt);
  }
};

EMSCRIPTEN_BINDINGS(persistentHeap_module) {
  emscripten::class_<PhNode>("PhNode")
      .function("getCurrVertex", &PhNode::getCurrVertex)
      .function("getNextVertex", &PhNode::getNextVertex)
      .function("getSideTrack", &PhNode::getSideTrack)
      .function("getChild", &PhNode::getChild);

  emscripten::class_<PersistentHeap>("PersistentHeap")
      .constructor<int>()
      .function("assign", &PersistentHeap::assign)
      .function("getHeap", &PersistentHeap::getHeap)
      .function("copyTo", &PersistentHeap::copyTo)
      .function("insertAt", &PersistentHeap::insertAt);
}