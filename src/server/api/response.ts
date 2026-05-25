// ============================================================================
// API Response Utilities
// 统一响应格式
// ============================================================================

/**
 * 成功响应
 */
export function successResponse<T>(data: T): Response {
  return Response.json({
    success: true,
    data,
  });
}

/**
 * 错误响应
 */
export function errorResponse(
  message: string,
  statusCode: number = 500,
  code?: string
): Response {
  return Response.json(
    {
      success: false,
      error: {
        message,
        code: code || String(statusCode),
      },
    },
    { status: statusCode }
  );
}

/**
 * 参数错误响应
 */
export function badRequestResponse(message: string, code?: string): Response {
  return errorResponse(message, 400, code);
}

/**
 * 未找到响应
 */
export function notFoundResponse(message: string, code?: string): Response {
  return errorResponse(message, 404, code);
}

/**
 * 权限不足响应
 */
export function forbiddenResponse(message: string, code?: string): Response {
  return errorResponse(message, 403, code);
}

/**
 * 服务器错误响应
 */
export function serverErrorResponse(message: string, code?: string): Response {
  return errorResponse(message, 500, code);
}