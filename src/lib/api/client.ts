// ============================================================================
// API Client Utilities
// 客户端 API 调用封装
// ============================================================================

/**
 * API 基础地址
 */
const API_BASE = "/api";

/**
 * 请求超时时间（毫秒）
 */
const REQUEST_TIMEOUT = 30000;

/**
 * 默认请求头
 */
function getDefaultHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
  };
}

/**
 * 通用 GET 请求
 */
export async function apiGet<T = unknown>(
  url: string,
  options?: {
    params?: Record<string, string | string[] | undefined>;
    headers?: HeadersInit;
  }
): Promise<T> {
  const { params, headers } = options || {};

  // 构建 URL
  let fullUrl = `${API_BASE}${url}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, v));
        } else {
          searchParams.append(key, value);
        }
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      fullUrl += `?${queryString}`;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        ...getDefaultHeaders(),
        ...headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return handleResponse<T>(response);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("请求超时");
    }
    throw error;
  }
}

/**
 * 通用 POST 请求
 */
export async function apiPost<T = unknown>(
  url: string,
  data?: unknown,
  options?: {
    headers?: HeadersInit;
  }
): Promise<T> {
  const { headers } = options || {};

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE}${url}`, {
      method: "POST",
      headers: {
        ...getDefaultHeaders(),
        ...headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return handleResponse<T>(response);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("请求超时");
    }
    throw error;
  }
}

/**
 * 处理响应
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const result = await response.json();

  if (!response.ok) {
    const errorMessage =
      result?.error?.message || `请求失败 (${response.status})`;
    throw new Error(errorMessage);
  }

  if (result.success === false) {
    throw new Error(result.error?.message || "请求失败");
  }

  return result.data as T;
}

// ============================================================================
// 类型定义
// ============================================================================

/**
 * API 响应结构
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

/**
 * 分页参数
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

/**
 * 分页结果
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}