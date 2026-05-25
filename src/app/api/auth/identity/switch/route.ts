// ============================================================================
// POST /api/auth/identity/switch
// 切换身份 API
//
// 注意：当前不做真实 session 校验，不适合生产
// 真实上线前必须加入身份校验和权限校验
// ============================================================================

import { NextRequest } from "next/server";
import { successResponse, badRequestResponse, notFoundResponse } from "@/server/api/response";
import { authService } from "@/server/services";
import { requireIdentityId } from "@/server/api/validators";

export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { identityId: rawIdentityId } = body;

    // 参数校验
    let identityId: string;
    try {
      identityId = requireIdentityId(rawIdentityId);
    } catch (error) {
      return badRequestResponse((error as Error).message);
    }

    // 调用 service 切换身份
    const result = await authService.switchIdentityContext(identityId);

    if (!result.identity) {
      return notFoundResponse("身份不存在");
    }

    // 转换日期为字符串
    const responseData = {
      identity: {
        ...result.identity,
        createdAt: result.identity.createdAt.toISOString(),
        updatedAt: result.identity.updatedAt.toISOString(),
      },
      entitlements: result.entitlements.map((e) => ({
        ...e,
        expiredAt: e.expiredAt?.toISOString(),
      })),
      membership: result.membership
        ? {
            ...result.membership,
            validFrom: result.membership.validFrom.toISOString(),
            validTo: result.membership.validTo.toISOString(),
            createdAt: result.membership.createdAt.toISOString(),
            updatedAt: result.membership.updatedAt.toISOString(),
          }
        : null,
    };

    return successResponse(responseData);
  } catch (error) {
    console.error("Switch identity API error:", error);
    return badRequestResponse("切换身份失败");
  }
}