// ============================================================================
// GET /api/orders
// 个人订单 API
//
// 只允许 parent 和 teacher
// Phase 4B.1 临时方案：依赖前端传入 identityId
// 真实上线前必须替换为 session/JWT/cookie
// ============================================================================

import { NextRequest } from "next/server";
import { successResponse, badRequestResponse, forbiddenResponse, notFoundResponse } from "@/server/api/response";
import { orderService } from "@/server/services";
import { requireOrderIdentityFromRequest } from "@/server/api/auth-context";

export async function GET(request: NextRequest) {
  try {
    // 获取并校验身份
    let identity;
    try {
      identity = await requireOrderIdentityFromRequest(request);
    } catch (error) {
      const message = (error as Error).message;
      if (message.includes("不存在") || message.includes("未提供")) {
        return notFoundResponse(message);
      }
      return forbiddenResponse(message);
    }

    // 调用 service 获取个人订单
    const orders = await orderService.getPersonalOrders(identity.id);

    // 转换日期为字符串
    const responseData = orders.map((o) => ({
      ...o,
      createdAt: o.createdAt.toISOString(),
      paidAt: o.paidAt?.toISOString(),
      expiredAt: o.expiredAt?.toISOString(),
    }));

    return successResponse(responseData);
  } catch (error) {
    console.error("Orders API error:", error);
    return badRequestResponse("获取订单列表失败");
  }
}