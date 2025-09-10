import { SyncLane, mergeLane } from "./constants/index";
// createRoot
// element是JSX转换后的reactElement
export function updateContainer(root, element) {
  const update = {
    payload: element,
    lane: SyncLane,
  };
  // 挂载变更
  const fiber = root.current;
  const _root = enqueueUpdate(fiber, update);
  console.log(update, "update", _root);
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
  return node.stateNode;
}
