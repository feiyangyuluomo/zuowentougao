// ============================================================================
// Mock数据统一导出
// ============================================================================

export * from "./activities";
export * from "./students";
export * from "./essays";
export * from "./users";
export * from "./identities";
export * from "./self-submissions";
export * from "./ai-results";

// 导出一个便捷的mock数据初始化函数
export function initializeMockData() {
  // 初始化mock数据
  console.info("[Mock Data] Initializing mock data...");

  return {
    activities: true,
    students: true,
    essays: true,
    users: true,
    identities: true,
    selfSubmissions: true,
    aiResults: true,
  };
}