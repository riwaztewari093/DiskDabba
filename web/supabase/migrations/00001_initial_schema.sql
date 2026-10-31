-- DiskDabba Initial Schema
-- Migration: 00001_initial_schema.sql
-- Creates the core tables: profiles, folders, files, shares

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- PROFILES: Extends Supabase Auth users with app-specific data
-- ============================================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    storage_used BIGINT NOT NULL DEFAULT 0,           -- bytes currently used
    storage_limit BIGINT NOT NULL DEFAULT 5368709120,  -- 5 GB default
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- FOLDERS: Tree structure for organising files
-- ============================================================
CREATE TABLE public.folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Prevent duplicate folder names in the same parent
    UNIQUE(user_id, parent_id, name)
);

-- Index for fast lookup of subfolders
CREATE INDEX idx_folders_parent ON public.folders(user_id, parent_id);

-- ============================================================
-- FILES: Metadata for files stored in Cloudflare R2
-- ============================================================
CREATE TABLE public.files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    mime_type TEXT,
    size BIGINT NOT NULL,
    r2_key TEXT NOT NULL UNIQUE,           -- object key in the R2 bucket
    sha256 TEXT,                           -- content hash for deduplication
    is_trashed BOOLEAN NOT NULL DEFAULT FALSE,
    trashed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for listing files in a folder
CREATE INDEX idx_files_folder ON public.files(user_id, folder_id) WHERE NOT is_trashed;

-- Index for listing trashed files
CREATE INDEX idx_files_trashed ON public.files(user_id) WHERE is_trashed;

-- Index for deduplication lookup
CREATE INDEX idx_files_sha256 ON public.files(user_id, sha256) WHERE sha256 IS NOT NULL;

-- ============================================================
-- SHARES: Link-based sharing of files and folders
-- ============================================================
CREATE TABLE public.shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID REFERENCES public.files(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,             -- public share token in the URL
    permission TEXT NOT NULL DEFAULT 'view', -- 'view' | 'download'
    password_hash TEXT,                      -- optional password protection
    expires_at TIMESTAMPTZ,                  -- optional expiration
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Must share either a file or a folder (not both, not neither)
    CONSTRAINT shares_target_check CHECK (
        (file_id IS NOT NULL AND folder_id IS NULL) OR
        (file_id IS NULL AND folder_id IS NOT NULL)
    )
);

-- Index for looking up shares by token (used on the public share page)
CREATE INDEX idx_shares_token ON public.shares(token);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shares ENABLE ROW LEVEL SECURITY;

-- PROFILES: Users can only read/update their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- FOLDERS: Users can only CRUD their own folders
CREATE POLICY "Users can view own folders"
    ON public.folders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own folders"
    ON public.folders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own folders"
    ON public.folders FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own folders"
    ON public.folders FOR DELETE
    USING (auth.uid() = user_id);

-- FILES: Users can only CRUD their own files
CREATE POLICY "Users can view own files"
    ON public.files FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own files"
    ON public.files FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own files"
    ON public.files FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own files"
    ON public.files FOR DELETE
    USING (auth.uid() = user_id);

-- SHARES: Users can manage their own shares; anyone can read by token
CREATE POLICY "Users can view own shares"
    ON public.shares FOR SELECT
    USING (auth.uid() = created_by);

CREATE POLICY "Users can create shares"
    ON public.shares FOR INSERT
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete own shares"
    ON public.shares FOR DELETE
    USING (auth.uid() = created_by);

-- Public share access (unauthenticated users can read a share by its token)
CREATE POLICY "Anyone can view share by token"
    ON public.shares FOR SELECT
    USING (true);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_folders_updated_at
    BEFORE UPDATE ON public.folders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_files_updated_at
    BEFORE UPDATE ON public.files
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
