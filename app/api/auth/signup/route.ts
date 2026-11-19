import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, signSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      fullName,
      role = 'CREATOR',
      channelName,
      platform = 'YouTube',
      bio,
      niches,
      hourlyRate,
      primarySoftware,
    } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { success: false, error: 'Full name, email, and password are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const validRole = ['CREATOR', 'EDITOR', 'ADMIN'].includes(role) ? role : 'CREATOR';

    // Create user and profile
    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        fullName: fullName.trim(),
        role: validRole,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normalizedEmail)}`,
        ...(validRole === 'CREATOR'
          ? {
              creatorProfile: {
                create: {
                  channelName: channelName || `${fullName}'s Channel`,
                  platform: platform || 'YouTube',
                  subscriberTier: '10K_TO_50K',
                  totalSpend: 0.0,
                  verifiedBadge: false,
                },
              },
            }
          : {}),
        ...(validRole === 'EDITOR'
          ? {
              editorProfile: {
                create: {
                  bio: bio || 'Professional video editor specializing in modern retention editing.',
                  hourlyRate: Number(hourlyRate) || 45.0,
                  niches: niches || 'YouTube Long-form, Tech, Storytelling',
                  primarySoftware: primarySoftware || 'DaVinci Resolve & Premiere Pro',
                  portfolioUrls: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                  totalEarnings: 0.0,
                  rating: 5.0,
                  verifiedBadge: false,
                  disputeRate: 0.0,
                  turnaroundDays: 3,
                },
              },
            }
          : {}),
      },
      include: {
        creatorProfile: true,
        editorProfile: true,
      },
    });

    const safeUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.fullName,
      role: newUser.role,
      avatar: newUser.avatarUrl,
      account_status: 'ACTIVE',
      badge: validRole === 'CREATOR' ? 'Creator (New)' : 'Editor (New)',
      creatorProfile: newUser.creatorProfile,
      editorProfile: newUser.editorProfile,
    };

    // Sign session token
    const token = await signSessionToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role as 'CREATOR' | 'EDITOR' | 'ADMIN',
      name: newUser.fullName,
    });

    const response = NextResponse.json({
      success: true,
      user: safeUser,
      token,
      message: `Account created successfully as ${validRole}`,
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
