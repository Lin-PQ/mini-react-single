import { HostRoot, NoFlags, NoLanes } from "./constants";

function FiberNode(tag, pendingProps, key) {
  // 基本属性
  this.tag = tag;
  this.pendingProps = pendingProps;
  this.key = key;
  this.type = null;
  this.ref = null;

  // 父子、兄弟关系
  this.return = null;
  this.child = null;
  this.sibling = null;

  // state,props,update
  this.memoizedState = null;
  this.memoizedProps = null;
  this.updateQueue = {
    pending: null,
  };

  // 各种标记
  this.flags = NoFlags;
  this.subtreeFlags = NoFlags;
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 其他
  this.index = 0;
  this.mode = null;
  this.stateNode = null;
  this.deletions = null;
  this.alternate = null;
}

function createFiber(tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key);
}
// 创建根节点 ？hostRootFiber fiberRoot
export function createHostRootFiber() {
  return createFiber(HostRoot, null, null);
}
