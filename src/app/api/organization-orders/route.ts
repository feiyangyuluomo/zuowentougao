// ============================================================================
// GET /api/organization-orders
// 机构订单 API
//
// 只允许 organization_admin
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

    // 校验身份类型（只允许 organization_admin）
    const identity = await identityRepository.findById(identityId);
    if (!identity) {
      return badRequestResponse("身份不存在");
    }

    if (identity.identityType !== "organization_admin") {
      return forbiddenResponse("只允许机构管理员访问此接口");
    }

    if (!identity.organizationId) {
      return badRequestResponse("机构管理员没有所属机构");
    }

    // 调用 service 获取机构订单
    const orders = await orderService.getOrgOrders(identity.organizationId);

    // 转换日期为字符串
    const responseData = orders.map((o) => ({
      ...o,
      createdAt: o.createdAt.toISOString(),
      paidAt: o.paidAt?.toISOString(),
      expiredAt: o.expiredAt?.toISOString(),
    }));

    return successResponse(responseData);
  } catch (error) {
    console.error("Organization orders API error:", error);
    return badRequestResponse("获取机构订单列表失败");
  }
}