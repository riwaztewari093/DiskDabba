-- DiskDabba Migration 00003: Complete Platform Integration
-- Adds file visibility, views tracking, creator monetization wallets, withdrawal requests, and referrals.

-- 1. FILE VISIBILITY & COUNTERS
ALTER TABLE public.files
ADD COLUMN IF NOT EXISTS visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'unlisted', 'private')),
ADD COLUMN IF NOT EXISTS view_count BIGINT NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS download_count BIGINT NOT NULL DEFAULT 0;

-- Index for public/unlisted searches
CREATE INDEX IF NOT EXISTS idx_files_visibility ON public.files(visibility) WHERE NOT is_trashed;

-- Update RLS on files so public/unlisted files (or files with an active share) can be fetched by viewers
DROP POLICY IF EXISTS "Anyone can view public or shared files" ON public.files;
CREATE POLICY "Anyone can view public or shared files"
    ON public.files FOR SELECT
    USING (
        visibility IN ('public', 'unlisted')
        OR auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM public.shares
            WHERE shares.file_id = files.id
            AND (shares.expires_at IS NULL OR shares.expires_at > now())
        )
    );

-- 2. REFERRALS & USER PROFILES ENHANCEMENT
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Automatically generate random referral codes for existing and new profiles
UPDATE public.profiles
SET referral_code = LOWER(SUBSTRING(MD5(id::text || clock_timestamp()::text) FROM 1 FOR 8))
WHERE referral_code IS NULL;

-- 3. CREATOR WALLETS & MONETIZATION
CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    balance_inr NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_earned_inr NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_withdrawn_inr NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    cpm_rate_inr NUMERIC(10, 2) NOT NULL DEFAULT 85.00, -- ₹85 (~$1.00) CPM base rate
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wallets_user ON public.wallets(user_id);

-- Auto-create wallet for every profile
CREATE OR REPLACE FUNCTION public.handle_new_wallet()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.wallets (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created_wallet ON public.profiles;
CREATE TRIGGER on_profile_created_wallet
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_wallet();

-- Backfill wallets for existing profiles
INSERT INTO public.wallets (user_id)
SELECT id FROM public.profiles
ON CONFLICT (user_id) DO NOTHING;

-- 4. VIEWS & EARNINGS LOG
CREATE TABLE IF NOT EXISTS public.views_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID NOT NULL REFERENCES public.files(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    viewer_ip_hash TEXT,
    is_monetized BOOLEAN NOT NULL DEFAULT TRUE,
    earned_inr NUMERIC(10, 4) NOT NULL DEFAULT 0.0850, -- ₹85/1000 views = ₹0.085 per view
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_views_creator ON public.views_log(creator_id, created_at);
CREATE INDEX IF NOT EXISTS idx_views_file ON public.views_log(file_id);

-- 5. WITHDRAWAL REQUESTS
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount_inr NUMERIC(10, 2) NOT NULL CHECK (amount_inr >= 100),
    payment_method TEXT NOT NULL DEFAULT 'UPI', -- 'UPI' | 'PhonePe' | 'GooglePay' | 'BankTransfer'
    payment_address TEXT NOT NULL,              -- e.g. vpa@upi or Account number
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'sandbox_paused')),
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_withdrawals_user ON public.withdrawal_requests(user_id);

-- 6. RPC: RECORD VIEW & CREDIT CREATOR
CREATE OR REPLACE FUNCTION public.record_file_view(
    p_file_id UUID,
    p_viewer_ip_hash TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_file RECORD;
    v_creator_id UUID;
    v_cpm_rate NUMERIC;
    v_earned NUMERIC;
    v_already_viewed BOOLEAN;
BEGIN
    -- 1. Fetch file info
    SELECT id, user_id INTO v_file
    FROM public.files
    WHERE id = p_file_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'File not found');
    END IF;

    v_creator_id := v_file.user_id;

    -- Increment file view count
    UPDATE public.files
    SET view_count = view_count + 1
    WHERE id = p_file_id;

    -- Deduplicate views within 24 hours per IP hash
    IF p_viewer_ip_hash IS NOT NULL THEN
        SELECT EXISTS (
            SELECT 1 FROM public.views_log
            WHERE file_id = p_file_id
              AND viewer_ip_hash = p_viewer_ip_hash
              AND created_at > (now() - INTERVAL '24 hours')
        ) INTO v_already_viewed;
    ELSE
        v_already_viewed := false;
    END IF;

    -- If eligible view for monetization
    IF NOT v_already_viewed THEN
        -- Get creator's CPM rate
        SELECT cpm_rate_inr INTO v_cpm_rate
        FROM public.wallets
        WHERE user_id = v_creator_id;

        IF v_cpm_rate IS NULL THEN
            v_cpm_rate := 85.00;
        END IF;

        v_earned := ROUND(v_cpm_rate / 1000.0, 4);

        -- Record view log
        INSERT INTO public.views_log (file_id, creator_id, viewer_ip_hash, is_monetized, earned_inr)
        VALUES (p_file_id, v_creator_id, p_viewer_ip_hash, TRUE, v_earned);

        -- Credit creator wallet
        UPDATE public.wallets
        SET balance_inr = balance_inr + v_earned,
            total_earned_inr = total_earned_inr + v_earned,
            updated_at = now()
        WHERE user_id = v_creator_id;
    END IF;

    RETURN jsonb_build_object('success', true, 'monetized', NOT v_already_viewed);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. ROW LEVEL SECURITY POLICIES
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.views_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- WALLETS: Users can view their own wallet
CREATE POLICY "Users can view own wallet"
    ON public.wallets FOR SELECT
    USING (auth.uid() = user_id);

-- VIEWS LOG: Creators can view their own views log
CREATE POLICY "Creators can view own views"
    ON public.views_log FOR SELECT
    USING (auth.uid() = creator_id);

-- WITHDRAWAL REQUESTS: Users can view and submit their own requests
CREATE POLICY "Users can view own withdrawals"
    ON public.withdrawal_requests FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own withdrawals"
    ON public.withdrawal_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ADMIN POLICIES FOR ALL NEW TABLES
CREATE POLICY "Admins can view all wallets"
    ON public.wallets FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
        )
    );

CREATE POLICY "Admins can manage all withdrawals"
    ON public.withdrawal_requests FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
        )
    );
