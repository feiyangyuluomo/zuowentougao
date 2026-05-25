// ============================================================================
// API Smoke Test
// 验证 API Route 是否正常工作
//
// 使用方法：
// 1. 确保 USE_MOCK=true（默认）
// 2. 启动开发服务器 npm run dev
// 3. 运行 npm run api-smoke-test
// ============================================================================

const API_BASE = "http://localhost:3000";

// 颜色输出
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
};

function log(color: string, label: string, message: string) {
  console.log(`${color}[${label}]${colors.reset} ${message}`);
}

function success(message: string) {
  log(colors.green, "✅ SUCCESS", message);
}

function error(message: string) {
  log(colors.red, "❌ ERROR", message);
}

function info(message: string) {
  log(colors.blue, "ℹ️ INFO", message);
}

// 等待服务启动
async function waitForServer(maxRetries = 30, interval = 1000): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(`${API_BASE}/api/activities`);
      if (response.ok) {
        return true;
      }
    } catch {
      // 等待中
    }
    info(`等待服务启动... (${i + 1}/${maxRetries})`);
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  return false;
}

// 测试 GET 请求
async function testGet(endpoint: string, description: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);
    const result = await response.json();

    if (!response.ok) {
      error(`${description}: HTTP ${response.status} - ${result.error?.message || "未知错误"}`);
      return false;
    }

    if (result.success !== true) {
      error(`${description}: 返回 success=false`);
      return false;
    }

    success(`${description}: 通过 (${Array.isArray(result.data) ? result.data.length + " 条" : "OK"})`);
    return true;
  } catch (err) {
    error(`${description}: ${err}`);
    return false;
  }
}

// 测试 POST 请求
async function testPost(
  endpoint: string,
  body: unknown,
  description: string
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json();

    if (!response.ok) {
      error(`${description}: HTTP ${response.status} - ${result.error?.message || "未知错误"}`);
      return false;
    }

    if (result.success !== true) {
      error(`${description}: 返回 success=false`);
      return false;
    }

    success(`${description}: 通过`);
    return true;
  } catch (err) {
    error(`${description}: ${err}`);
    return false;
  }
}

// 主测试函数
async function runApiSmokeTest() {
  console.log("\n" + "=".repeat(60));
  info("API Smoke Test 开始");
  console.log("=".repeat(60) + "\n");

  // 等待服务
  info("检查服务状态...");
  const serverReady = await waitForServer();
  if (!serverReady) {
    error("服务未启动，请先运行 npm run dev");
    process.exit(1);
  }
  success("服务已启动\n");

  let passed = 0;
  let failed = 0;

  // 1. 测试活动列表 API
  info("测试活动 API...");
  if (await testGet("/api/activities", "GET /api/activities")) passed++;
  else failed++;

  // 2. 测试活动详情 API
  if (await testGet("/api/activities/act-summer-2025", "GET /api/activities/[id]")) passed++;
  else failed++;

  // 3. 测试登录 API
  info("\n测试认证 API...");
  if (await testPost("/api/auth/login", { phone: "13800138001" }, "POST /api/auth/login (家长)")) passed++;
  else failed++;

  if (await testPost("/api/auth/login", { phone: "13800138002" }, "POST /api/auth/login (运营)")) passed++;
  else failed++;

  if (await testPost("/api/auth/login", { phone: "13800138003" }, "POST /api/auth/login (老师)")) passed++;
  else failed++;

  // 4. 测试身份切换 API
  if (await testPost("/api/auth/identity/switch", { identityId: "id-parent-001" }, "POST /api/auth/identity/switch")) passed++;
  else failed++;

  // 5. 测试订单 API
  info("\n测试订单 API...");
  if (await testGet("/api/orders?identityId=id-parent-001", "GET /api/orders (家长)")) passed++;
  else failed++;

  if (await testGet("/api/orders?identityId=id-teacher-001", "GET /api/orders (老师)")) passed++;
  else failed++;

  if (await testGet("/api/organization-orders?identityId=id-org-admin-001", "GET /api/organization-orders (机构管理员)")) passed++;
  else failed++;

  // 输出总结
  console.log("\n" + "=".repeat(60));
  console.log("\n📊 API Smoke Test 结果汇总:");
  console.log(`   ✅ 通过: ${passed}`);
  console.log(`   ❌ 失败: ${failed}`);
  console.log(`   📝 总计: ${passed + failed}`);

  if (failed === 0) {
    success("\n🎉 所有 API 测试通过！\n");
    process.exit(0);
  } else {
    error("\n⚠️  部分测试失败，请检查 API 路由\n");
    process.exit(1);
  }
}

// 执行
runApiSmokeTest().catch((err) => {
  error(`Smoke test 执行失败: ${err}`);
  process.exit(1);
});