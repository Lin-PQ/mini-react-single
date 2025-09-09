import React from "./react";
import { NoLane } from "./constants/index";
import App from "./demo/init";
import { updateContainer } from "./update";
const root = {
  container: document.getElementById("root"),
  pendingLanes: NoLane, // 记录所有变更
  callbackPriority: NoLane, // 记录已有的待渲染任务
};

updateContainer(root, <App />);
