// ============================================================================
// POST /api/auth/login
// 手机号登录 API
//
// 注意：当前是 mock/test login，不适合生产
// 真实上线前必须加入 session/JWT/cookie 校验
// ============================================================================

import { NextRequest } from "next/server";
import { successResponse, badRequestResponse, notFoundResponse } from "@/server/api/response";
import { authService } from "@/server/services";
import { requirePhone } from "@/server/api/validators";

// 允许测试的手机号（开发阶段）
const ALLOWED_TEST_PHONES = [
  "13800138001", // 付费家长
  "13800138002", // 运营小王
  "13800138003", // 张老师
  "13800138004", // 李管理员
  "13800138005", // 王老师
];

export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { phone: rawPhone } = body;

    // 参数校验
    let phone: string;
    try {
      phone = requirePhone(rawPhone);
    } catch (error) {
      return badRequestResponse((error as Error).message);
    }

    // 开发阶段：限制测试手机号
    if (process.env.NODE_ENV === "production" && !ALLOWED_TEST_PHONES.includes(phone)) {
      return badRequestResponse("无效的手机号");
    }

    // 调用 service 登录
    const result = await authService.getUserWithIdentities(phone);

    if (!result.user) {
      return notFoundResponse("用户不存在");
    }

    // 转换日期为字符串（JSON 序列化需要）
    const responseData = {
      user: {
        ...result.user,
        createdAt: result.user.createdAt.toISOString(),
        updatedAt: result.user.updatedAt.toISOString(),
      },
      identities: result.identities.map((i) => ({
        ...i,
        createdAt: i.createdAt.toISOString(),
        updatedAt: i.updatedAt.toISOString(),
      })),
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
      currentIdentity: result.currentIdentity
        ? {
            ...result.currentIdentity,
            createdAt: result.currentIdentity.createdAt.toISOString(),
            updatedAt: result.currentIdentity.updatedAt.toISOString(),
          }
        : null,
    };

    return successResponse(responseData);
  } catch (error) {
    console.error("Login API error:", error);
    return badRequestResponse("登录失败");
  }
}