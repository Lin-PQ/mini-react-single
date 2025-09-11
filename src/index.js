import React from "./react";
import { NoLane } from "./constants/index";
import App from "./demo/init";
import { updateContainer } from "./update";
import { createHostRootFiber } from "./fiber";
import { flush } from "./scheduleSyncCallback";
const root = {
  container: document.getElementById("root"),
  pendingLanes: NoLane, // 记录所有变更
  callbackPriority: NoLane, // 记录已有的待渲染任务
};
const hostRootFiber = createHostRootFiber();
root.current = hostRootFiber;
hostRootFiber.stateNode = root;
flush(() => {
  updateContainer(root, <App />);
});
