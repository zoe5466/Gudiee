import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from './prisma';
import { User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

// 密碼加密
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// 密碼驗證
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// 生成 JWT Token
export function generateToken(user: User): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// 驗證 JWT Token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

// 從請求中獲取當前用戶
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }
    
    const payload = verifyToken(token);
    if (!payload) {
      return null;
    }
    
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        userProfile: true
      }
    });
    
    return user;
  } catch (error) {
    return null;
  }
}

// 檢查用戶權限
export function hasPermission(user: User, permission: string): boolean {
  if (user.role === 'ADMIN') return true;
  
  const permissions = user.permissions as string[];
  return permissions.includes(permission);
}

// 檢查用戶角色
export function hasRole(user: User, roles: string[]): boolean {
  return roles.includes(user.role);
}