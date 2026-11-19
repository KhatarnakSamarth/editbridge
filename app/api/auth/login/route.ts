import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, signSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Query user from Prisma
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        creatorProfile: true,
        editorProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Return safe user payload
    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.fullName,
      role: user.role,
      avatar: user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      account_status: 'ACTIVE',
      badge:
        user.role === 'ADMIN'
          ? 'Platform Ops Arbiter'
          : user.role === 'EDITOR'
          ? 'Verified Pro Editor'
          : 'Verified Creator',
      creatorProfile: user.creatorProfile,
      editorProfile: user.editorProfile,
    };

    // Sign session token
    const token = await signSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role as 'CREATOR' | 'EDITOR' | 'ADMIN',
      name: user.fullName,
    });

    const response = NextResponse.json({
      success: true,
      user: safeUser,
      token,
      message: `Authenticated successfully as ${user.role}`,
    });

    // Set secure HttpOnly session cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication service error' },
      { status: 500 }
    );
  }
}
