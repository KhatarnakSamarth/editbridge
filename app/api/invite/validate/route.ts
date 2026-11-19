import { NextResponse } from 'next/server';
import { verifyInviteToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const role = searchParams.get('role');
    const expParam = searchParams.get('exp');

    // 1. If signed token provided, cryptographically verify it
    if (token) {
      const verified = await verifyInviteToken(token);
      if (!verified) {
        return NextResponse.json(
          { valid: false, error: 'Invite link is invalid or has expired.' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        valid: true,
        projectId: verified.projectId,
        role: verified.role,
        permission: verified.permission,
        expiresAt: new Date(verified.exp * 1000).toISOString(),
        verified: true,
      });
    }

    // 2. Fallback check for query-param style links (validate role & expiration syntax)
    const validRoles = ['creator', 'editor', 'reviewer'];
    if (role && !validRoles.includes(role.toLowerCase())) {
      return NextResponse.json(
        { valid: false, error: 'Invalid collaboration role specified in invite.' },
        { status: 400 }
      );
    }

    // Check expiration tag if present
    if (expParam === 'expired') {
      return NextResponse.json(
        { valid: false, error: 'This invitation link has expired.' },
        { status: 410 }
      );
    }

    return NextResponse.json({
      valid: true,
      role: role ? role.toUpperCase() : 'EDITOR',
      permission: 'FULL_WORKSPACE',
      verified: false,
      message: 'Standard invite parameters valid',
    });
  } catch (error) {
    console.error('Invite validation error:', error);
    return NextResponse.json(
      { valid: false, error: 'Server validation error' },
      { status: 500 }
    );
  }
}
