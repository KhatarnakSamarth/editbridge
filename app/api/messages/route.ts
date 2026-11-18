import { NextResponse } from 'next/server';
import { INITIAL_MESSAGES } from '@/lib/mockData';
import { ProjectMessage, UserRole } from '@/types';

let runtimeMessages: ProjectMessage[] = [...INITIAL_MESSAGES];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json({
      success: true,
      data: runtimeMessages,
    });
  }

  const filtered = runtimeMessages.filter((m) => m.project_id === projectId);
  return NextResponse.json({
    success: true,
    data: filtered,
  });
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
      data: newMessage,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
