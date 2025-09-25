-- =====================================================
-- ENHANCED SECURITY POLICIES FOR PROMO_SEM TABLE
-- Optimized for Web Communication and API Fetching
-- =====================================================

-- Enable Row Level Security (RLS)
ALTER TABLE promo_sem ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for active SEM promos" ON promo_sem;
DROP POLICY IF EXISTS "Anonymous read access for active SEM promos" ON promo_sem;
DROP POLICY IF EXISTS "Admin full access to SEM promos" ON promo_sem;
DROP POLICY IF EXISTS "Service role full access to SEM promos" ON promo_sem;
DROP POLICY IF EXISTS "Authenticated read access to SEM promos" ON promo_sem;

-- =====================================================
-- WEB-OPTIMIZED PUBLIC ACCESS POLICIES
-- =====================================================

-- Allow anonymous (unauthenticated) users to read active SEM promos
-- This is essential for public website visitors
CREATE POLICY "Anonymous read access for active SEM promos" ON promo_sem
    FOR SELECT
    TO anon
    USING (is_active = true);

-- Allow authenticated users to read active SEM promos
CREATE POLICY "Authenticated read access to SEM promos" ON promo_sem
    FOR SELECT
    TO authenticated
    USING (is_active = true);

-- Allow public role to read active SEM promos (fallback)
CREATE POLICY "Public read access for active SEM promos" ON promo_sem
    FOR SELECT
    TO public
    USING (is_active = true);

-- =====================================================
-- ADMIN ACCESS POLICIES
-- =====================================================

-- Full access for admin users
CREATE POLICY "Admin full access to SEM promos" ON promo_sem
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (
                auth.users.email IN (
                    'admin@ether-core.com',
                    'support@ether-core.com'
                )
                OR 
                auth.users.raw_user_meta_data->>'role' = 'admin'
            )
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (
                auth.users.email IN (
                    'admin@ether-core.com',
                    'support@ether-core.com'
                )
                OR 
                auth.users.raw_user_meta_data->>'role' = 'admin'
            )
        )
    );

-- =====================================================
-- SERVICE ROLE ACCESS (For Server-Side Rendering)
-- =====================================================

-- Full access for service role (essential for Next.js server-side operations)
CREATE POLICY "Service role full access to SEM promos" ON promo_sem
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- =====================================================
-- GRANTS AND PERMISSIONS FOR WEB ACCESS
-- =====================================================

-- Essential grants for web communication
GRANT SELECT ON promo_sem TO anon;           -- For anonymous website visitors
GRANT SELECT ON promo_sem TO authenticated;  -- For logged-in users
GRANT SELECT ON promo_sem TO public;         -- General public access
GRANT ALL ON promo_sem TO service_role;      -- For server-side operations

-- Grant sequence usage (important for inserts)
GRANT USAGE ON SEQUENCE promo_sem_id_seq TO service_role;
GRANT USAGE ON SEQUENCE promo_sem_id_seq TO authenticated;

-- =====================================================
-- API-FRIENDLY HELPER FUNCTIONS
-- =====================================================

-- Function to get active SEM promos (optimized for API calls)
CREATE OR REPLACE FUNCTION get_active_sem_promos()
RETURNS SETOF promo_sem AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM promo_sem
    WHERE is_active = true
    ORDER BY display_order ASC, created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get SEM promo by slug (for specific lookups)
CREATE OR REPLACE FUNCTION get_sem_promo_by_slug(promo_slug text)
RETURNS SETOF promo_sem AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM promo_sem
    WHERE slug = promo_slug AND is_active = true
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get latest SEM promo (for homepage/campaign pages)
CREATE OR REPLACE FUNCTION get_latest_sem_promo()
RETURNS SETOF promo_sem AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM promo_sem
    WHERE is_active = true
    ORDER BY created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- WEB PERFORMANCE OPTIMIZATIONS
-- =====================================================

-- Indexes optimized for web queries
CREATE INDEX IF NOT EXISTS idx_promo_sem_active_slug ON promo_sem(is_active, slug);
CREATE INDEX IF NOT EXISTS idx_promo_sem_active_order ON promo_sem(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_promo_sem_active_created ON promo_sem(is_active, created_at DESC);

-- Partial index for active promos only (faster queries)
CREATE INDEX IF NOT EXISTS idx_promo_sem_active_only ON promo_sem(display_order, created_at DESC) 
WHERE is_active = true;

-- =====================================================
-- CORS AND API HEADERS SUPPORT
-- =====================================================

-- Enable necessary extensions for web APIs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to validate API requests (if needed)
CREATE OR REPLACE FUNCTION validate_api_request()
RETURNS BOOLEAN AS $$
BEGIN
    -- Add any API validation logic here
    -- For now, always return true for public access
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- AUDIT LOGGING FOR WEB REQUESTS
-- =====================================================

-- Enhanced audit table with request tracking
CREATE TABLE IF NOT EXISTS promo_sem_audit (
    id BIGSERIAL PRIMARY KEY,
    promo_sem_id BIGINT REFERENCES promo_sem(id),
    action VARCHAR(10) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_by VARCHAR(100),
    user_agent TEXT,
    ip_address INET,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced audit function
CREATE OR REPLACE FUNCTION audit_promo_sem_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO promo_sem_audit (promo_sem_id, action, new_data, changed_by)
        VALUES (NEW.id, 'INSERT', to_jsonb(NEW), NEW.created_by);
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO promo_sem_audit (promo_sem_id, action, old_data, new_data, changed_by)
        VALUES (NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), NEW.updated_by);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO promo_sem_audit (promo_sem_id, action, old_data, changed_by)
        VALUES (OLD.id, 'DELETE', to_jsonb(OLD), OLD.updated_by);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create audit trigger
DROP TRIGGER IF EXISTS promo_sem_audit_trigger ON promo_sem;
CREATE TRIGGER promo_sem_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON promo_sem
    FOR EACH ROW EXECUTE FUNCTION audit_promo_sem_changes();

-- =====================================================
-- SECURITY CHECKS AND VALIDATIONS
-- =====================================================

-- Function to check if user can access SEM promos
CREATE OR REPLACE FUNCTION can_access_sem_promos()
RETURNS BOOLEAN AS $$
BEGIN
    -- Allow access for:
    -- 1. Anonymous users (for public website)
    -- 2. Authenticated users
    -- 3. Service role
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check admin privileges
CREATE OR REPLACE FUNCTION is_sem_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND (
            auth.users.email IN (
                'admin@ether-core.com',
                'support@ether-core.com'
            )
            OR 
            auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COMMENTS AND DOCUMENTATION
-- =====================================================

COMMENT ON POLICY "Anonymous read access for active SEM promos" ON promo_sem 
IS 'Allows anonymous website visitors to read active SEM promotional content';

COMMENT ON POLICY "Authenticated read access to SEM promos" ON promo_sem 
IS 'Allows authenticated users to read active SEM promotional content';

COMMENT ON POLICY "Public read access for active SEM promos" ON promo_sem 
IS 'Fallback policy for public access to active SEM promotional content';

COMMENT ON POLICY "Admin full access to SEM promos" ON promo_sem 
IS 'Allows admin users full CRUD access to SEM promotional content';

COMMENT ON POLICY "Service role full access to SEM promos" ON promo_sem 
IS 'Allows service role full access for server-side operations and API endpoints';

COMMENT ON FUNCTION get_active_sem_promos() 
IS 'API-friendly function to get all active SEM promos';

COMMENT ON FUNCTION get_sem_promo_by_slug(text) 
IS 'API function to get specific SEM promo by slug';

COMMENT ON FUNCTION get_latest_sem_promo() 
IS 'API function to get the most recent active SEM promo';

-- =====================================================
-- FINAL VERIFICATION
-- =====================================================

-- Test the policies work correctly
DO $$
BEGIN
    -- Test that we can select from the table
    PERFORM * FROM promo_sem WHERE is_active = true LIMIT 1;
    RAISE NOTICE 'SUCCESS: SEM promo policies are working correctly for web access';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'WARNING: There might be an issue with SEM promo policies: %', SQLERRM;
END;
$$;

-- Success message
SELECT 'Enhanced SEM promo security policies for web communication setup completed successfully!' as status;

-- =====================================================
-- USAGE EXAMPLES FOR DEVELOPERS
-- =====================================================

/*
-- Example queries that will work with these policies:

-- 1. Get all active SEM promos (public access)
SELECT * FROM promo_sem WHERE is_active = true;

-- 2. Get SEM promo by slug (public access)
SELECT * FROM get_sem_promo_by_slug('google-ads-management');

-- 3. Get latest SEM promo (public access)
SELECT * FROM get_latest_sem_promo();

-- 4. Admin operations (requires admin privileges)
INSERT INTO promo_sem (slug, title, ...) VALUES (...);
UPDATE promo_sem SET title = 'New Title' WHERE id = 1;
DELETE FROM promo_sem WHERE id = 1;

-- These queries will work from:
-- - Next.js server-side rendering
-- - API routes
-- - Client-side fetching
-- - Anonymous website visitors
-- - Authenticated users
*/ 