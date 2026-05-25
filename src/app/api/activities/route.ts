// ============================================================================
// GET /api/activities
// 活动列表 API
// ============================================================================

import { NextRequest } from "next/server";
import { successResponse, badRequestResponse } from "@/server/api/response";
import { activityService } from "@/server/services";
import { ActivityStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 解析筛选参数
    const filters: {
      gradeScope?: string[];
      genre?: string[];
      activityStatus?: ActivityStatus;
      keyword?: string;
      hasPayment?: boolean;
      hasCertificate?: boolean;
    } = {};

    const keyword = searchParams.get("keyword");
    if (keyword) filters.keyword = keyword;

    const gradeScope = searchParams.getAll("gradeScope");
    if (gradeScope.length > 0) filters.gradeScope = gradeScope;

    const genre = searchParams.getAll("genre");
    if (genre.length > 0) filters.genre = genre;

    const activityStatus = searchParams.get("activityStatus");
    if (activityStatus) filters.activityStatus = activityStatus as ActivityStatus;

    const hasPayment = searchParams.get("hasPayment");
    if (hasPayment !== null) filters.hasPayment = hasPayment === "true";

    const hasCertificate = searchParams.get("hasCertificate");
    if (hasCertificate !== null) filters.hasCertificate = hasCertificate === "true";

    // 调用 service 获取活动列表
    const activities = await activityService.filterActivities(filters);

    // 转换日期为字符串
    const responseData = activities.map((a) => ({
      ...a,
      deadline: a.deadline?.toISOString(),
    }));

    return successResponse(responseData);
  } catch (error) {
    console.error("Activities API error:", error);
    return badRequestResponse("获取活动列表失败");
  }
}