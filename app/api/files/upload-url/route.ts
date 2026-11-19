import { NextResponse } from 'next/server';
import { getSupabaseAdmin, ensureStorageBucket, SUPABASE_STORAGE_BUCKET } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { projectId, fileName } = await request.json();

    if (!projectId || !fileName) {
      return NextResponse.json(
        { success: false, error: 'projectId and fileName are required' },
        { status: 400 }
      );
    }

    const admin = getSupabaseAdmin();
    await ensureStorageBucket(admin);

    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${projectId}/${Date.now()}-${sanitizedFileName}`;

    const { data, error } = await admin.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .createSignedUploadUrl(storagePath);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    const { data: publicData } = admin.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .getPublicUrl(storagePath);

    return NextResponse.json({
      success: true,
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path,
      publicUrl: publicData.publicUrl,
    });
  } catch (error: any) {
    console.error('Upload URL generation error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to generate signed upload URL' },
      { status: 500 }
    );
  }
}
