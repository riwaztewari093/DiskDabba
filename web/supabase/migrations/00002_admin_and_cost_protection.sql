-- Migration: 00002_admin_and_cost_protection.sql
-- Adds administrator privileges, system settings, and bandwidth auditing

-- 1. Add is_admin column to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- Index for admin lookups
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin) WHERE is_admin = TRUE;

-- 2. System Settings table for runtime configurable caps
CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed default settings (matching ₹300/mo budget and safety caps)
INSERT INTO public.system_settings (key, value)
VALUES
    ('budget', '{"monthly_budget_inr": 300, "storage_cost_per_gb_inr": 0.50, "download_cost_per_gb_inr": 0.84}'::jsonb),
    ('limits', '{"max_file_size_mb": 100, "default_user_quota_bytes": 5368709120, "max_uploads_per_hour": 20}'::jsonb),
    ('protection', '{"maintenance_mode": false, "circuit_breaker_triggered": false}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 3. Bandwidth / Download Audit Log
CREATE TABLE IF NOT EXISTS public.bandwidth_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    file_id UUID REFERENCES public.files(id) ON DELETE SET NULL,
    bytes_served BIGINT NOT NULL,
    ip_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for bandwidth metric aggregation
CREATE INDEX IF NOT EXISTS idx_bandwidth_created_at ON public.bandwidth_logs(created_at);

-- 4. Enable RLS on new tables
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bandwidth_logs ENABLE ROW LEVEL SECURITY;

-- Admins can read/modify system settings
CREATE POLICY "Admins can view system settings"
    ON public.system_settings FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
        )
    );

CREATE POLICY "Admins can update system settings"
    ON public.system_settings FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
        )
    );

-- Admins can view all bandwidth logs
CREATE POLICY "Admins can view bandwidth logs"
    ON public.bandwidth_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
        )
    );
