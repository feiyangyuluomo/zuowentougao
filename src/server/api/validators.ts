// ============================================================================
// API Validators
// 基础参数校验函数
// ============================================================================

import { NextRequest } from "next/server";
import { badRequestResponse } from "@/server/api/response";

// ============================================================================
// 基础类型校验
// ============================================================================

/**
 * 要求值是字符串
 */
export function requireString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${fieldName} 必须是字符串且不能为空`);
  }
  return value.trim();
}

/**
 * 要求值是字符串（可选）
 */
export function optionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  if (value.trim() === "") return undefined;
  return value.trim();
}

/**
 * 要求 identityId
 */
export function requireIdentityId(value: unknown): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error("identityId 不能为空");
  }
  return value.trim();
}

/**
 * 要求手机号
 */
export function requirePhone(value: unknown): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error("手机号不能为空");
  }
  const phone = value.trim();
  // 简单校验：中国手机号格式
  if (!/^1\d{10}$/.test(phone)) {
    throw new Error("手机号格式不正确");
  }
  return phone;
}

// ============================================================================
// Query 参数解析
// ============================================================================

/**
 * 解析布尔值 query 参数
 */
export function parseBooleanQuery(
  value: string | string[] | null | undefined
): boolean | undefined {
  if (value === null || value === undefined) return undefined;
  if (Array.isArray(value)) value = value[0];
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

/**
 * 解析字符串数组 query 参数
 * 支持逗号分隔或多次同名参数
 */
export function parseStringArrayQuery(
  value: string | string[] | null | undefined
): string[] {
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) {
    return value.map((v) => String(v)).filter((v) => v.trim() !== "");
  }
  // 支持逗号分隔
  return String(value)
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v !== "");
}

/**
 * 从 request 获取 identityId（从 query 或 body）
 */
export async function getIdentityIdFromRequest(
  request: NextRequest
): Promise<string | null> {
  // 尝试从 query 获取
  const { searchParams } = new URL(request.url);
  const queryIdentityId = searchParams.get("identityId");
  if (queryIdentityId) return queryIdentityId;

  // 尝试从 body 获取
  try {
    const body = await request.clone().json();
    if (body?.identityId && typeof body.identityId === "string") {
      return body.identityId;
    }
  } catch {
    // body 解析失败
  }

  return null;
}

/**
 * 从 request 获取手机号
 */
export async function getPhoneFromRequest(
  request: NextRequest
): Promise<string | null> {
  try {
    const body = await request.clone().json();
    if (body?.phone && typeof body.phone === "string") {
      return body.phone.trim();
    }
  } catch {
    // body 解析失败
  }
  return null;
}