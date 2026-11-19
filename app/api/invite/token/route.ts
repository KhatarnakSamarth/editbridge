import { NextResponse } from 'next/server';
import { signInviteToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId, role, permission, expiration } = body;

    let seconds = 30 * 24 * 60 * 60; // 30 days default
    if (expiration === '7_DAYS') seconds = 7 * 24 * 60 * 60;
    if (expiration === 'NEVER') seconds = 365 * 24 * 60 * 60;

    const token = await signInviteToken(
      {
        projectId: projectId || 'proj-demo-1',
        role: (role?.toUpperCase() as any) || 'EDITOR',
        permission: (permission?.toUpperCase() as any) || 'FULL_WORKSPACE',
      },
      seconds
    );

    return NextResponse.json({
      success: true,
      token,
      expiresInSeconds: seconds,
    });
  } catch (error) {
    console.error('Invite token generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Could not generate secure invite token' },
      { status: 500 }
    );
  }
}
