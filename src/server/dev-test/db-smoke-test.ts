// ============================================================================
// 数据库 Smoke Test
// 验证 USE_MOCK=false 时真实数据库读取能力
//
// 使用方法：
// 1. 确保 USE_MOCK=false 且 DATABASE_URL 有效
// 2. 先运行 npm run db:seed 填充数据
// 3. 运行 npm run db:smoke-test
// ============================================================================

import { userRepository } from "@/server/repositories/user.repository";
import { identityRepository } from "@/server/repositories/identity.repository";
import { studentRepository } from "@/server/repositories/student.repository";
import { activityRepository } from "@/server/repositories/activity.repository";
import { orderRepository } from "@/server/repositories/order.repository";
import { entitlementRepository } from "@/server/repositories/entitlement.repository";
import { membershipRepository } from "@/server/repositories/membership.repository";

async function runDbSmokeTest() {
  console.log("\n⚠️  USE_MOCK=false - 测试真实数据库读取\n");
  console.log("=" .repeat(60));
  console.log("\n");

  let passed = 0;
  let failed = 0;

  // 1. 测试 userRepository.findByPhone
  try {
    console.log("📋 测试 1: userRepository.findByPhone('13800138001')");
    const user = await userRepository.findByPhone("13800138001");
    if (user) {
      console.log(`   ✅ 找到用户: ${user.nickname} (${user.phone})`);
      passed++;
    } else {
      console.log("   ⚠️  未找到用户（可能未运行 seed）");
      failed++;
    }
  } catch (error) {
    console.log(`   ❌ 错误: ${error}`);
    failed++;
  }

  // 2. 测试 identityRepository.findByUserId
  try {
    console.log("\n📋 测试 2: identityRepository.findByUserId('user-parent-001')");
    const identities = await identityRepository.findByUserId("user-parent-001");
    if (identities && identities.length > 0) {
      console.log(`   ✅ 找到 ${identities.length} 个身份`);
      identities.forEach((id) => {
        console.log(`      - ${id.id} (${id.identityType})`);
      });
      passed++;
    } else {
      console.log("   ⚠️  未找到身份（可能未运行 seed）");
      failed++;
    }
  } catch (error) {
    console.log(`   ❌ 错误: ${error}`);
    failed++;
  }

  // 3. 测试 studentRepository.findByOwner
  try {
    console.log("\n📋 测试 3: studentRepository.findByOwner('id-parent-001')");
    const students = await studentRepository.findByOwner("id-parent-001");
    if (students && students.length > 0) {
      console.log(`   ✅ 找到 ${students.length} 个学生`);
      students.forEach((s) => {
        console.log(`      - ${s.studentName} (${s.school || "无学校"})`);
      });
      passed++;
    } else {
      console.log("   ⚠️  未找到学生（可能未运行 seed）");
      failed++;
    }
  } catch (error) {
    console.log(`   ❌ 错误: ${error}`);
    failed++;
  }

  // 4. 测试 activityRepository.findAll
  try {
    console.log("\n📋 测试 4: activityRepository.findAll()");
    const activities = await activityRepository.findAll();
    if (activities && activities.length > 0) {
      console.log(`   ✅ 找到 ${activities.length} 个活动`);
      activities.forEach((a) => {
        console.log(`      - ${a.title}`);
      });
      passed++;
    } else {
      console.log("   ⚠️  未找到活动（可能未运行 seed）");
      failed++;
    }
  } catch (error) {
    console.log(`   ❌ 错误: ${error}`);
    failed++;
  }

  // 5. 测试 orderRepository.findByIdentity
  try {
    console.log("\n📋 测试 5: orderRepository.findByIdentity('id-parent-001')");
    const orders = await orderRepository.findByIdentity("id-parent-001");
    if (orders && orders.length > 0) {
      console.log(`   ✅ 找到 ${orders.length} 个订单`);
      orders.forEach((o) => {
        console.log(`      - ${o.orderTitle} (¥${(o.amount / 100).toFixed(2)})`);
      });
      passed++;
    } else {
      console.log("   ⚠️  未找到订单（可能未运行 seed）");
      failed++;
    }
  } catch (error) {
    console.log(`   ❌ 错误: ${error}`);
    failed++;
  }

  // 6. 测试 entitlementRepository.findByIdentityId
  try {
    console.log("\n📋 测试 6: entitlementRepository.findByIdentityId('id-parent-001')");
    const entitlements = await entitlementRepository.findByIdentityId("id-parent-001");
    if (entitlements && entitlements.length > 0) {
      console.log(`   ✅ 找到 ${entitlements.length} 条权益`);
      entitlements.forEach((e) => {
        console.log(`      - ${e.entitlementType} (配额: ${e.aiQuota || "无"})`);
      });
      passed++;
    } else {
      console.log("   ⚠️  未找到权益（可能未运行 seed）");
      failed++;
    }
  } catch (error) {
    console.log(`   ❌ 错误: ${error}`);
    failed++;
  }

  // 7. 测试 membershipRepository.findByIdentityId
  try {
    console.log("\n📋 测试 7: membershipRepository.findByIdentityId('id-parent-001')");
    const membership = await membershipRepository.findByIdentityId("id-parent-001");
    if (membership) {
      console.log(`   ✅ 找到会员: ${membership.membershipType} (${membership.status})`);
      passed++;
    } else {
      console.log("   ⚠️  未找到会员（可能未运行 seed）");
      failed++;
    }
  } catch (error) {
    console.log(`   ❌ 错误: ${error}`);
    failed++;
  }

  // 输出总结
  console.log("\n" + "=".repeat(60));
  console.log("\n📊 测试结果汇总:");
  console.log(`   ✅ 通过: ${passed}`);
  console.log(`   ❌ 失败: ${failed}`);
  console.log(`   📝 总计: ${passed + failed}`);

  if (failed === 0) {
    console.log("\n🎉 所有测试通过！数据库读取验证成功！\n");
  } else {
    console.log("\n⚠️  部分测试失败，请检查数据库连接和 seed 数据\n");
  }

  // 退出
  process.exit(failed > 0 ? 1 : 0);
}

// 执行
runDbSmokeTest().catch((error) => {
  console.error("❌ Smoke test 执行失败:", error);
  process.exit(1);
});