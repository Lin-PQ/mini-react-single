import { SyncLane } from "./constants/index";
// createRoot
// element是JSX转换后的reactElement
export function updateContainer(root, element) {
  const update = {
    payload: element,
    lane: SyncLane,
  };
  console.log(update, "update", root);
}
