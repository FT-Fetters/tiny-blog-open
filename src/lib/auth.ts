import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRES_IN = '24h';

export interface JWTPayload {
  userId: string;
  role: 'admin';
  iat?: number;
  exp?: number;
}

/**
 * 生成JWT Token
 */
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * 验证JWT Token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return payload;
  } catch (error) {
    console.error('JWT验证失败:', error);
    return null;
  }
}

/**
 * 从请求中提取JWT Token
 */
export function extractTokenFromRequest(request: NextRequest): string | null {
  // 首先检查Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // 然后检查cookies
  const token = request.cookies.get('admin-token')?.value;
  return token || null;
}

/**
 * 验证管理员密码
 */
export function verifyAdminPassword(password: string): boolean {
  // 这里使用简单的密码验证，生产环境建议使用加密
  const adminPassword = process.env.ADMIN_PASSWORD || '123456';
  return password === adminPassword;
}

/**
 * 生成安全的管理员Token
 */
export function generateAdminToken(): string {
  return generateToken({
    userId: 'admin',
    role: 'admin'
  });
}