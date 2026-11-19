import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySessionToken(sessionCookie);

    const { searchParams } = new URL(request.url);
    const emailParam = searchParams.get('email');

    const targetEmail = session?.email || emailParam?.toLowerCase();

    if (targetEmail) {
      const user = await prisma.user.findUnique({
        where: { email: targetEmail },
        include: {
          creatorProfile: true,
          editorProfile: true,
        },
      });

      if (user) {
        return NextResponse.json({
          success: true,
          authenticated: Boolean(session),
          user: {
            id: user.id,
            email: user.email,
            name: user.fullName,
            role: user.role,
            avatar: user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            creatorProfile: user.creatorProfile,
            editorProfile: user.editorProfile,
          },
        });
      }
    }

    return NextResponse.json(
      { success: false, error: 'Unauthenticated or user not found' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user session' },
      { status: 500 }
    );
  }
}
