let syncQueue = null;

export function scheduleSyncCallback(callback) {
  if (!syncQueue) {
    syncQueue = [callback];
  } else {
    syncQueue.push(callback);
  }
}

export function flushSyncCallback() {
  if (!syncQueue) {
    return;
  }

  syncQueue.forEach(callback => {
    callback();
  });

  syncQueue = null;
}

export function flush(fn) {
  // fn里调用scheduleSyncCallback往队列里添加任务
  fn();
  // 然后执行队列里待处理的任务
  flushSyncCallback();
}
