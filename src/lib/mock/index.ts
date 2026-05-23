// ============================================================================
// Mock数据统一导出
// ============================================================================

export * from "./activities";
export * from "./students";
export * from "./essays";

// 导出一个便捷的mock数据初始化函数
export function initializeMockData() {
  // 初始化mock数据
  console.info("[Mock Data] Initializing mock data...");

  // 如果需要在这里做一些初始化操作，可以在这里处理
  // 比如设置localStorage等

  return {
    activities: true,
    students: true,
    essays: true,
  };
}