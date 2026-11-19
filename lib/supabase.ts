import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'project-videos';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sbxuqkwxnouafwyhjrmf.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

let browserClient: SupabaseClient | null = null;

/**
 * Returns a Supabase client suitable for browser / client-side operations.
 */
export function getSupabaseClient(): SupabaseClient {
  if (typeof window !== 'undefined' && browserClient) {
    return browserClient;
  }
  const client = createClient(supabaseUrl, supabaseAnonKey);
  if (typeof window !== 'undefined') {
    browserClient = client;
  }
  return client;
}

/**
 * Returns a privileged Supabase client for server-side / route handler operations.
 */
export function getSupabaseAdmin(): SupabaseClient {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Ensures the target storage bucket exists and is public for fast media playback.
 */
export async function ensureStorageBucket(
  client: SupabaseClient = getSupabaseAdmin()
): Promise<boolean> {
  try {
    const { data: buckets, error: listError } = await client.storage.listBuckets();
    if (listError) {
      console.warn('Storage listBuckets note:', listError.message);
      return false;
    }
    const exists = buckets?.some((b) => b.name === SUPABASE_STORAGE_BUCKET);
    if (!exists) {
      const { error: createError } = await client.storage.createBucket(
        SUPABASE_STORAGE_BUCKET,
        {
          public: true,
          fileSizeLimit: 1024 * 1024 * 1024 * 2, // 2GB
        }
      );
      if (createError) {
        console.warn('Could not auto-create storage bucket:', createError.message);
        return false;
      }
    }
    return true;
  } catch (err) {
    console.warn('ensureStorageBucket exception:', err);
    return false;
  }
}

/**
 * Uploads a video file or ArrayBuffer to Supabase Storage and returns the public persistent URL.
 */
export async function uploadToSupabaseStorage(
  fileOrBuffer: Blob | ArrayBuffer | Buffer,
  storagePath: string,
  contentType: string = 'video/mp4',
  client: SupabaseClient = getSupabaseAdmin()
): Promise<{ success: boolean; publicUrl?: string; error?: string }> {
  try {
    await ensureStorageBucket(client);

    const { error: uploadError } = await client.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .upload(storagePath, fileOrBuffer, {
        contentType,
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    const { data } = client.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .getPublicUrl(storagePath);

    return {
      success: true,
      publicUrl: data.publicUrl,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to upload to Supabase Storage',
    };
  }
}

/**
 * Removes a file from Supabase Storage by its storage key/path.
 */
export async function deleteFromSupabaseStorage(
  storagePath: string,
  client: SupabaseClient = getSupabaseAdmin()
): Promise<{ success: boolean; error?: string }> {
  try {
    const cleanPath = storagePath.startsWith('/') ? storagePath.slice(1) : storagePath;
    const { error } = await client.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .remove([cleanPath]);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to delete from Supabase Storage',
    };
  }
}
