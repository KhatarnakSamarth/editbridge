import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { INITIAL_MESSAGES } from '@/lib/mockData';
import { ProjectMessage, UserRole } from '@/types';

let runtimeMessages: ProjectMessage[] = [...INITIAL_MESSAGES];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    const dbMessages = await prisma.message.findMany({
      where: projectId ? { projectId } : undefined,
      include: { sender: true },
      orderBy: { createdAt: 'asc' },
    });

    if (dbMessages && dbMessages.length > 0) {
      const mapped = dbMessages.map((m) => ({
        id: m.id,
        project_id: m.projectId,
        sender_id: m.senderId,
        sender_name: m.sender.fullName,
        sender_role: m.sender.role as UserRole,
        sender_avatar: m.sender.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        message: m.text,
        created_at: m.createdAt.toISOString(),
      }));

      return NextResponse.json({
        success: true,
        source: 'prisma-sqlite',
        data: mapped,
      });
    }

    const filtered = projectId
      ? runtimeMessages.filter((m) => m.project_id === projectId)
      : runtimeMessages;

    return NextResponse.json({
      success: true,
      source: 'memory-fallback',
      data: filtered,
    });
  } catch (error) {
    console.error('Messages GET error:', error);
    return NextResponse.json({
      success: true,
      source: 'memory-fallback',
      data: runtimeMessages,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      project_id,
      sender_id,
      sender_name,
      sender_role,
      sender_avatar,
      message,
      text,
    } = body;

    const content = message || text;
    if (!project_id || !content) {
      return NextResponse.json(
        { success: false, error: 'project_id and message are required' },
        { status: 400 }
      );
    }

    try {
      const dbMsg = await prisma.message.create({
        data: {
          id: `msg-${Date.now()}`,
          projectId: project_id,
          senderId: sender_id || 'user-creator-1',
          text: String(content),
        },
        include: { sender: true },
      });

      return NextResponse.json({
        success: true,
        source: 'prisma-sqlite',
        data: {
          id: dbMsg.id,
          project_id: dbMsg.projectId,
          sender_id: dbMsg.senderId,
          sender_name: dbMsg.sender.fullName,
          sender_role: dbMsg.sender.role as UserRole,
          sender_avatar: dbMsg.sender.avatarUrl,
          message: dbMsg.text,
          created_at: dbMsg.createdAt.toISOString(),
        },
      });
    } catch {
      const newMessage: ProjectMessage = {
        id: `msg-${Date.now()}`,
        project_id,
        sender_id: sender_id || 'user-creator-1',
        sender_name: sender_name || 'Marcus Sterling',
        sender_role: (sender_role as UserRole) || 'CREATOR',
        sender_avatar:
          sender_avatar ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        message: String(content),
        created_at: new Date().toISOString(),
      };

      runtimeMessages.push(newMessage);

      return NextResponse.json({
        success: true,
        source: 'memory-fallback',
        data: newMessage,
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
