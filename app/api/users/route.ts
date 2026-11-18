import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    const users = await prisma.user.findMany({
      where: role ? { role: role.toUpperCase() } : undefined,
      include: {
        creatorProfile: true,
        editorProfile: true,
        _count: {
          select: {
            createdProjects: true,
            editedProjects: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const safeUsers = users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.fullName,
      role: u.role,
      avatar: u.avatarUrl,
      created_at: u.createdAt.toISOString(),
      account_status: 'ACTIVE',
      badge:
        u.role === 'ADMIN'
          ? 'Root Arbiter'
          : u.role === 'EDITOR'
          ? 'Verified Pro Editor'
          : 'Verified Creator',
      creatorProfile: u.creatorProfile,
      editorProfile: u.editorProfile,
      projectCount: u.role === 'CREATOR' ? u._count.createdProjects : u._count.editedProjects,
    }));

    return NextResponse.json({
      success: true,
      users: safeUsers,
    });
  } catch (error) {
    console.error('Users API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve users' },
      { status: 500 }
    );
  }
}
