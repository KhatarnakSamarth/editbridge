import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ProjectFile } from '@/types';
import { uploadToSupabaseStorage } from '@/lib/supabase';
import { verifySessionToken } from '@/lib/auth';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const projectId = formData.get('projectId') as string | null;
    const fileType = (formData.get('fileType') as string) || 'DRAFT_VIDEO';
    const version = (formData.get('version') as string) || 'Draft Cut';
    const uploaderId = (formData.get('uploaderId') as string) || 'user-creator-1';
    const uploaderName = (formData.get('uploaderName') as string) || 'Creator';

    if (!file || !projectId) {
      return NextResponse.json(
        { success: false, error: 'Both file and projectId are required' },
        { status: 400 }
      );
    }

    // Verify session
    const cookieHeader = request.headers.get('cookie') || '';
    const sessionMatch = cookieHeader.match(/editbridge_session=([^;]+)/);
    const sessionToken = sessionMatch ? sessionMatch[1] : null;
    let userId = uploaderId;
    if (sessionToken) {
      const payload = await verifySessionToken(sessionToken);
      if (payload) {
        userId = payload.userId;
      }
    }

    // Sanitize filename and storage path
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${projectId}/${Date.now()}-${sanitizedFileName}`;

    // Read bytes
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const uploadResult = await uploadToSupabaseStorage(
      buffer,
      storagePath,
      file.type || 'video/mp4'
    );

    if (!uploadResult.success || !uploadResult.publicUrl) {
      return NextResponse.json(
        {
          success: false,
          error: uploadResult.error || 'Failed to upload video to cloud storage',
        },
        { status: 500 }
      );
    }

    const publicUrl = uploadResult.publicUrl;

    // Persist in PostgreSQL
    const dbFile = await prisma.projectFile.create({
      data: {
        id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        projectId,
        name: file.name,
        fileType,
        sizeBytes: file.size,
        storageUrl: publicUrl,
        isMasterDelivery: fileType === 'FINAL_MASTER',
        isLocked: fileType === 'FINAL_MASTER',
        uploadedBy: userId,
      },
    });

    // Always update Project.activeDraftUrl on ANY video upload
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const isVideo =
      fileType === 'DRAFT_VIDEO' ||
      fileType === 'FINAL_MASTER' ||
      fileType === 'RAW_FOOTAGE' ||
      (file.type && file.type.startsWith('video/')) ||
      ['mp4', 'mov', 'webm', 'mkv', 'm4v', 'avi'].includes(ext);

    let updatedDraftUrl = publicUrl;
    if (isVideo) {
      const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: {
          activeDraftUrl: publicUrl,
          status: 'REVIEW_REQUESTED',
        },
      });
      updatedDraftUrl = updatedProject.activeDraftUrl || publicUrl;
    }

    const mapped: ProjectFile = {
      id: dbFile.id,
      project_id: dbFile.projectId,
      uploader_id: dbFile.uploadedBy,
      uploader_name: uploaderName,
      file_name: dbFile.name,
      storage_key: storagePath,
      file_type: dbFile.fileType as ProjectFile['file_type'],
      size_bytes: dbFile.sizeBytes,
      formatted_size: formatBytes(dbFile.sizeBytes),
      version,
      url: dbFile.storageUrl,
      is_locked: dbFile.isLocked,
      is_master_delivery: dbFile.isMasterDelivery,
      created_at: dbFile.createdAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: mapped,
      file: mapped,
      activeDraftUrl: updatedDraftUrl,
      message: 'Video successfully uploaded to Supabase Storage and saved to database',
    });
  } catch (error: any) {
    console.error('Files upload error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Server upload failed' },
      { status: 500 }
    );
  }
}
