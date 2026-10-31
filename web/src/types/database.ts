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

/**
 * Database type helper for Supabase client.
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at"> &
          Partial<Pick<Profile, "created_at" | "updated_at">>;
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
        Insert: Omit<DiskFile, "id" | "is_trashed" | "trashed_at" | "created_at" | "updated_at"> &
          Partial<Pick<DiskFile, "id" | "is_trashed" | "trashed_at" | "created_at" | "updated_at">>;
        Update: Partial<DiskFile>;
      };
      shares: {
        Row: Share;
        Insert: Omit<Share, "id" | "created_at"> &
          Partial<Pick<Share, "id" | "created_at">>;
        Update: Partial<Share>;
      };
    };
  };
}
