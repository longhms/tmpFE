/**
 * Copyright(C) [2026] [Luvina Software Company]
 * [token.ts], [Apr, 2026] [ntlong]
 * quản lý JWT access token ở phía client.
 *
 * Cơ chế lưu trữ:
 * - Sử dụng localStorage để giữ trạng thái đăng nhập giữa các lần mở trình duyệt.
 *   (~6 ngày 16 giờ theo Constants.JWT_EXPIRATION bên BE).
 * - Token vẫn có thời hạn nhờ claim "exp" trong payload JWT, được kiểm tra bởi
 *   isTokenExpired() và server-side (JwtTokenProvider.validateToken).
 */

/** Key dùng để lưu access token trong localStorage */
const ACCESS_TOKEN_KEY = 'access_token';

/** Key dùng để lưu token type (Bearer) trong localStorage */
const TOKEN_TYPE_KEY = 'token_type';

/**
 * Lưu JWT access token vào localStorage để persist giữa các phiên.
 *
 * @param token     Chuỗi JWT nhận từ API /login
 * @param tokenType Loại token (thường là "Bearer")
 */
export function storeToken(token: string, tokenType: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  localStorage.setItem(TOKEN_TYPE_KEY, tokenType);
}

/**
 * Lấy token đã lưu. Trả về null nếu chưa đăng nhập.
 *
 * @returns { accessToken, tokenType } hoặc null nếu không có token
 */
export function getToken(): { accessToken: string; tokenType: string } | null {
  if (typeof window === 'undefined') return null; // SSR safety
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const tokenType = localStorage.getItem(TOKEN_TYPE_KEY);

  if (accessToken && tokenType) {
    return { accessToken, tokenType };
  }
  return null;
}

/**
 * Xoá token khỏi localStorage (dùng khi logout hoặc token hết hạn).
 */
export function removeToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(TOKEN_TYPE_KEY);
}

/**
 * Kiểm tra JWT đã hết hạn chưa dựa trên claim "exp".
 * Nếu decode lỗi (token sai format) -> coi như đã hết hạn.
 *
 * @param token Chuỗi JWT
 * @returns true nếu token hết hạn hoặc không hợp lệ
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}
