export type UserRole = 'CREATOR' | 'EDITOR' | 'ADMIN';

export type AccountStatus = 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  auth_provider_id?: string;
  created_at: string;
  account_status: AccountStatus;
  badge?: string;
}

export interface CreatorProfile {
  user_id: string;
  channel_url: string;
  channel_name: string;
  subscribers?: string;
  niche: string;
  publishing_frequency: string;
  requirements: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  client?: string;
  video_url: string;
  thumbnail_url: string;
  duration: string;
  views?: string;
  tags: string[];
}

export interface EditorProfile {
  user_id: string;
  name: string;
  headline: string;
  bio: string;
  skills: string[];
  niches: string[];
  software: string[];
  portfolio_items: PortfolioItem[];
  price_range: string;
  hourly_rate?: number;
  fixed_rate_starting?: number;
  availability: 'AVAILABLE' | 'FEW_SLOTS' | 'BOOKED';
  turnaround_time: string;
  verification_status: 'VERIFIED' | 'PENDING' | 'COMMUNITY';
  completed_projects_count: number;
  rating: number;
  reviews_count: number;
  location: string;
}

export type ProjectStatus =
  | 'DRAFT'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'EDITOR_ASSIGNED'
  | 'EDITING'
  | 'REVIEW_REQUESTED'
  | 'CHANGES_REQUESTED'
  | 'FINAL_RENDER'
  | 'FINAL_UPLOADED'
  | 'FINAL_PAYMENT_PENDING'
  | 'COMPLETED'
  | 'DISPUTED';

export type RevisionCommentStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';

export type CommentCategory = 'B_ROLL' | 'AUDIO' | 'PACING' | 'TEXT_GRAPHICS' | 'COLOR' | 'GENERAL';

export interface RevisionComment {
  id: string;
  project_id: string;
  video_version: string; // e.g. "Draft v1", "Draft v2"
  timestamp_seconds: number; // e.g. 43 -> 00:43
  formatted_time: string; // "00:43"
  comment: string;
  category: CommentCategory;
  status: RevisionCommentStatus;
  created_by_name: string;
  created_by_role: UserRole;
  created_at: string;
  resolved_at?: string;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  uploader_id: string;
  uploader_name: string;
  file_name: string;
  storage_key: string;
  file_type: 'RAW_FOOTAGE' | 'REFERENCE' | 'DRAFT_VIDEO' | 'FINAL_MASTER' | 'ASSET';
  size_bytes: number;
  formatted_size: string;
  version: string;
  url: string;
  is_locked?: boolean;
  is_master_delivery?: boolean;
  lock_reason?: string;
  created_at: string;
  checksum?: string;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  percentage: number;
  amount: number;
  status: 'PENDING' | 'ESCROW_FUNDED' | 'RELEASED';
  released_at?: string;
}

export interface DeliverableSpec {
  aspect_ratio: '16:9' | '9:16' | '1:1' | '4:5';
  target_duration_minutes: number;
  resolution: '4K (3840x2160)' | '1080p (1920x1080)' | '720p';
  captions_included: boolean;
  thumbnail_concept: boolean;
  sound_design: boolean;
  color_grading: boolean;
}

export interface EscrowInfo {
  total_budget: number;
  upfront_percentage: number;
  upfront_amount: number;
  upfront_released: boolean;
  final_percentage: number;
  final_amount: number;
  final_released: boolean;
  platform_fee_percent?: number;
}

export interface Project {
  id: string;
  title: string;
  brief: string;
  category: 'YouTube Long-form' | 'Shorts / Reels' | 'Podcast' | 'Documentary' | 'Gaming' | 'Commercial';
  creator_id: string;
  creator_name: string;
  creator_avatar: string;
  creator_channel?: string;
  editor_id?: string;
  editor_name?: string;
  editor_avatar?: string;
  editor_headline?: string;
  budget: number;
  currency: string;
  deadline: string;
  revision_limit: number;
  revisions_used: number;
  status: ProjectStatus;
  deliverables: DeliverableSpec;
  references: string[];
  raw_footage_links: string[];
  milestones: Milestone[];
  escrow?: EscrowInfo;
  watermark_active?: boolean;
  created_at: string;
  updated_at: string;
  active_draft_url?: string;
  final_master_url?: string;
}

export interface ProjectMessage {
  id: string;
  project_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: UserRole;
  sender_avatar: string;
  message: string;
  created_at: string;
}

export interface Review {
  id: string;
  project_id: string;
  project_title: string;
  reviewer_id: string;
  reviewer_name: string;
  reviewer_role: UserRole;
  reviewee_id: string;
  rating: number; // 1 to 5
  comment: string;
  tags: string[];
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'STATUS_CHANGE' | 'NEW_COMMENT' | 'PAYMENT' | 'INVITATION' | 'DELIVERY';
  link?: string;
  read: boolean;
  created_at: string;
}

export type AccentTheme = 'CYAN' | 'PURPLE' | 'EMERALD' | 'AMBER' | 'ROSE';

