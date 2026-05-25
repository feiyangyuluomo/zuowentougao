// ============================================================================
// GET /api/activities/[id]
// 活动详情 API
// ============================================================================

import { NextRequest } from "next/server";
import { successResponse, badRequestResponse, notFoundResponse } from "@/server/api/response";
import { activityService } from "@/server/services";
import { requireIdentityId } from "@/server/api/validators";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;

    // 参数校验
    let id: string;
    try {
      id = requireIdentityId(rawId);
    } catch (error) {
      return badRequestResponse((error as Error).message);
    }

    // 调用 service 获取活动详情
    const activity = await activityService.getActivityById(id);

    if (!activity) {
      return notFoundResponse("活动不存在");
    }

    // 转换日期为字符串
    const responseData = {
      ...activity,
      deadline: activity.deadline?.toISOString(),
    };

    return successResponse(responseData);
  } catch (error) {
    console.error("Activity detail API error:", error);
    return badRequestResponse("获取活动详情失败");
  }
}