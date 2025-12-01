import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!jwtSecret || !jwtRefreshSecret) {
      return NextResponse.json(
        { error: '伺服器設定錯誤' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { error: '未提供 refresh token' },
        { status: 400 }
      );
    }

    // 驗證 refresh token
    const decoded = jwt.verify(refreshToken, jwtRefreshSecret) as any;

    // 生成新的 access token
    const newToken = jwt.sign(
      {
        userId: decoded.userId,
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    // 生成新的 refresh token
    const newRefreshToken = jwt.sign(
      { userId: decoded.userId },
      jwtRefreshSecret,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      token: newToken,
      refreshToken: newRefreshToken
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Token 無效或已過期' },
      { status: 401 }
    );
  }
}