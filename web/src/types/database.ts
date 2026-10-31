/**
 * TypeScript type definitions for DiskDabba.
 * These mirror the database schema.
 */

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  storage_used: number;
  storage_limit: number;
  is_admin?: boolean;
  referral_code?: string | null;
  referred_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Folder {
  id: string;
  user_id: string;
  parent_id: string | null;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface DiskFile {
  id: string;
  user_id: string;
  folder_id: string | null;
  name: string;
  mime_type: string | null;
  size: number;
  r2_key: string;
  sha256: string | null;
  visibility: "public" | "unlisted" | "private";
  view_count: number;
  download_count: number;
  is_trashed: boolean;
  trashed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Share {
  id: string;
  file_id: string | null;
  folder_id: string | null;
  created_by: string;
  token: string;
  permission: "view" | "download";
  password_hash: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance_inr: number;
  total_earned_inr: number;
  total_withdrawn_inr: number;
  cpm_rate_inr: number;
  created_at: string;
  updated_at: string;
}

export interface ViewsLog {
  id: string;
  file_id: string;
  creator_id: string;
  viewer_ip_hash: string | null;
  is_monetized: boolean;
  earned_inr: number;
  created_at: string;
}

export interface WithdrawalRequest {
  id: string;
  user_id: string;
  amount_inr: number;
  payment_method: "UPI" | "PhonePe" | "GooglePay" | "BankTransfer";
  payment_address: string;
  status: "pending" | "approved" | "rejected" | "sandbox_paused";
  rejection_reason?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Database type helper for Supabase client.
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };
      folders: {
        Row: Folder;
        Insert: Omit<Folder, "id" | "created_at" | "updated_at"> &
          Partial<Pick<Folder, "id" | "created_at" | "updated_at">>;
        Update: Partial<Folder>;
      };
      files: {
        Row: DiskFile;
        Insert: Partial<DiskFile> & { user_id: string; name: string; size: number; r2_key: string };
        Update: Partial<DiskFile>;
      };
      shares: {
        Row: Share;
        Insert: Omit<Share, "id" | "created_at"> &
          Partial<Pick<Share, "id" | "created_at">>;
        Update: Partial<Share>;
      };
      wallets: {
        Row: Wallet;
        Insert: Partial<Wallet> & { user_id: string };
        Update: Partial<Wallet>;
      };
      views_log: {
        Row: ViewsLog;
        Insert: Partial<ViewsLog> & { file_id: string; creator_id: string };
        Update: Partial<ViewsLog>;
      };
      withdrawal_requests: {
        Row: WithdrawalRequest;
        Insert: Partial<WithdrawalRequest> & { user_id: string; amount_inr: number; payment_address: string };
        Update: Partial<WithdrawalRequest>;
      };
    };
  };
}
