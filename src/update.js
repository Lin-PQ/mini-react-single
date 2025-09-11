import { SyncLane, mergeLane } from "./constants/index";
import { performSyncWorkOnRoot } from "./renderSync";
import { scheduleSyncCallback } from "./scheduleSyncCallback";
// createRoot
// element是JSX转换后的reactElement
export function updateContainer(root, element) {
  const update = {
    payload: element, // element里的type调用获得FC return 的结构
    lane: SyncLane,
  };
  // 挂载变更
  const fiber = root.current;
  // 处理完hostRootFiber的lane是1
  const _root = enqueueUpdate(fiber, update);
  // console.log("update", update);
  // console.log("_root", _root);
  // console.log("fiber", fiber);
  // 调度
  scheduleUpdateOnFiber(_root, update.lane);
}
// 作用是将传入的update挂到对应fiber updateQueue上
// 并沿链表往上标记fiber的childLanes,表示子树需要reconciler
export function enqueueUpdate(fiber, update) {
  // 1.更新updateQueue
  // 链式的存储结构 pending读到的update(如果有)是最新的update,即lastestUpdate
  // 该update的next指向第一个存入的update
  const pending = fiber.updateQueue.pending;
  if (!pending) {
    update.next = update;
  } else {
    // 此处传入的update将被设置为lastestUpdate 因此next属性需要指向第一个update 即 原lastestUpdate next指针指向的update
    update.next = pending.next;
    // 原有的最新的update next 指向传入的update (根据创建时间构建update链表)
    pending.next = update;
  }
  // 更新updateQueue
  fiber.updateQueue.pending = update;

  // 2.往上标记

  // 标记WIP fiber
  fiber.lanes = mergeLane(fiber.lanes, update.lane);

  let alternate = fiber.alternate;
  if (alternate !== null) {
    // 标记current fiber?
    alternate.lanes = mergeLane(alternate.lanes, update.lane);
  }

  // 一路往上标记childLanes
  let node = fiber;
  let parent = fiber.return;
  while (parent) {
    parent.childLanes = mergeLane(parent.childLanes, update.lane);
    let alternate = parent.alternate;
    if (alternate !== null) {
      alternate.childLanes = mergeLane(alternate.childLanes, update.lane);
    }
    node = parent;
    parent = parent.return;
  }
  // 返回了hostRootFiber的stateNode 即最上层的fiber
  return node.stateNode;
}
// scheduleUpdateOnFiber方法主要是触发一个在Fiber节点上的调度更新任务，这个函数在很多地方被调用
// 比如组件状态变化【setState，useState】，就会调用此函数触发一次调度任务，执行一次完整的更新流程。
export function scheduleUpdateOnFiber(root, lane) {
  root.pendingLanes |= lane; // markRootUpdated
  // TODO: 包含饥饿问题处理
  // 从当前的 pendingLanes 中挑选出最高优先级的变更用于渲染
  const nextLane = lane;

  // 是否已生成了待执行的渲染
  const existingCallbackPriority = root.callbackPriority;

  // 存在渲染任务，则这次变更，将在这次渲染任务中一并处理
  if (nextLane === existingCallbackPriority) {
    return;
  }
  // 生成一次渲染任务，并存储起来
  const newTask = performSyncWorkOnRoot.bind(null, root);
  // 往任务队列添加任务, 由 flush 函数执行
  scheduleSyncCallback(newTask);
  root.callbackPriority = lane;
}
