// ============================================================================
// GET /api/orders
// 个人订单 API
//
// 只允许 parent 和 teacher
// ============================================================================

import { NextRequest } from "next/server";
import { successResponse, badRequestResponse, forbiddenResponse } from "@/server/api/response";
import { orderService } from "@/server/services";
import { identityRepository } from "@/server/repositories";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const identityId = searchParams.get("identityId");

    if (!identityId) {
      return badRequestResponse("identityId 不能为空");
    }

    // 校验身份类型（只允许 parent 和 teacher）
    const identity = await identityRepository.findById(identityId);
    if (!identity) {
      return badRequestResponse("身份不存在");
    }

    if (!["parent", "teacher"].includes(identity.identityType)) {
      return forbiddenResponse("只允许家长和个人老师访问此接口");
    }

    // 调用 service 获取个人订单
    const orders = await orderService.getPersonalOrders(identityId);

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