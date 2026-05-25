// ============================================================================
// /api/essays
// 作文相关 API
// ============================================================================

import { NextRequest } from "next/server";
import { successResponse, badRequestResponse, errorResponse } from "@/server/api/response";
import { essayRepository } from "@/server/repositories/essay.repository";
import { getIdentityFromRequest } from "@/server/api/auth-context";

export async function GET(request: NextRequest) {
  try {
    const identity = await getIdentityFromRequest(request);
    if (!identity) {
      return errorResponse("未登录", 401);
    }

    const essays = await essayRepository.findByOwner(identity.id);
    return successResponse(essays);
  } catch (error) {
    console.error("Essays API error:", error);
    return badRequestResponse("获取作文列表失败");
  }
}

export async function POST(request: NextRequest) {
  try {
    const identity = await getIdentityFromRequest(request);
    if (!identity) {
      return errorResponse("未登录", 401);
    }

    const body = await request.json();
    const { studentId, title, content, wordCount, genre, themeTags } = body;

    if (!title || !content) {
      return badRequestResponse("标题和内容不能为空");
    }

    const essay = await essayRepository.create({
      ownerIdentityId: identity.id,
      studentId,
      title,
      content,
      wordCount,
      genre,
      themeTags,
    });

    return successResponse(essay);
  } catch (error) {
    console.error("Create essay API error:", error);
    return badRequestResponse("创建作文失败");
  }
}