// ============================================================================
// /api/students
// 学生相关 API
// ============================================================================

import { NextRequest } from "next/server";
import { successResponse, badRequestResponse, errorResponse } from "@/server/api/response";
import { studentRepository } from "@/server/repositories/student.repository";
import { getIdentityFromRequest } from "@/server/api/auth-context";

export async function GET(request: NextRequest) {
  try {
    const identity = await getIdentityFromRequest(request);
    if (!identity) {
      return errorResponse("未登录", 401);
    }

    const students = await studentRepository.findByOwner(identity.id);
    return successResponse(students);
  } catch (error) {
    console.error("Students API error:", error);
    return badRequestResponse("获取学生列表失败");
  }
}

export async function POST(request: NextRequest) {
  try {
    const identity = await getIdentityFromRequest(request);
    if (!identity) {
      return errorResponse("未登录", 401);
    }

    const body = await request.json();
    const { studentName, school, grade, gender, phone, parentPhone, guideTeacher, address, birthday, organizationId, classId } = body;

    if (!studentName) {
      return badRequestResponse("学生姓名不能为空");
    }

    const student = await studentRepository.create({
      ownerIdentityId: identity.id,
      studentName,
      school,
      grade,
      gender,
      phone,
      parentPhone,
      guideTeacher,
      address,
      birthday: birthday ? new Date(birthday) : undefined,
      organizationId,
      classId,
    });

    return successResponse(student);
  } catch (error) {
    console.error("Create student API error:", error);
    return badRequestResponse("创建学生失败");
  }
}