// ============================================================================
// GET /api/activities
// 活动列表 API
// ============================================================================

import { NextRequest } from "next/server";
import { successResponse, badRequestResponse } from "@/server/api/response";
import { activityService } from "@/server/services";
import { ActivityStatus } from "@prisma/client";
import { parseBooleanQuery, parseStringArrayQuery, optionalString } from "@/server/api/validators";

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

    // keyword
    const keyword = optionalString(searchParams.get("keyword"));
    if (keyword) filters.keyword = keyword;

    // gradeScope - 支持逗号分隔或多次同名参数
    const gradeScope = parseStringArrayQuery(searchParams.getAll("gradeScope"));
    if (gradeScope.length > 0) filters.gradeScope = gradeScope;

    // genre - 支持逗号分隔或多次同名参数
    const genre = parseStringArrayQuery(searchParams.getAll("genre"));
    if (genre.length > 0) filters.genre = genre;

    // activityStatus
    const activityStatus = optionalString(searchParams.get("activityStatus"));
    if (activityStatus) filters.activityStatus = activityStatus as ActivityStatus;

    // hasPayment - 必须用 parseBooleanQuery
    const hasPayment = parseBooleanQuery(searchParams.get("hasPayment"));
    if (hasPayment !== undefined) filters.hasPayment = hasPayment;

    // hasCertificate - 必须用 parseBooleanQuery
    const hasCertificate = parseBooleanQuery(searchParams.get("hasCertificate"));
    if (hasCertificate !== undefined) filters.hasCertificate = hasCertificate;

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