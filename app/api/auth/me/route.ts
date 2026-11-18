import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (email) {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: {
          creatorProfile: true,
          editorProfile: true,
        },
      });

      if (user) {
        return NextResponse.json({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.fullName,
            role: user.role,
            avatar: user.avatarUrl,
            creatorProfile: user.creatorProfile,
            editorProfile: user.editorProfile,
          },
        });
      }
    }

    return NextResponse.json(
      { success: false, error: 'User not specified or not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
