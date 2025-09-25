-- =====================================================
-- PROMO TABLES SECURITY POLICIES
-- =====================================================
-- Security policies for promo_seo and promo_automation tables
-- Following Row Level Security (RLS) best practices

-- Enable Row Level Security on both tables
ALTER TABLE promo_seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_automation ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROMO_SEO TABLE POLICIES
-- =====================================================

-- Policy 1: Public read access for active SEO promos
CREATE POLICY "Public can view active SEO promos" ON promo_seo
    FOR SELECT
    USING (is_active = true);

-- Policy 2: Authenticated users can view all SEO promos (including inactive)
CREATE POLICY "Authenticated users can view all SEO promos" ON promo_seo
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy 3: Only admin users can insert SEO promos
CREATE POLICY "Admin can insert SEO promos" ON promo_seo
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.jwt() ->> 'role' = 'admin' OR
        auth.jwt() ->> 'user_role' = 'admin' OR
        auth.jwt() ->> 'app_role' = 'admin'
    );

-- Policy 4: Only admin users can update SEO promos
CREATE POLICY "Admin can update SEO promos" ON promo_seo
    FOR UPDATE
    TO authenticated
    USING (
        auth.jwt() ->> 'role' = 'admin' OR
        auth.jwt() ->> 'user_role' = 'admin' OR
        auth.jwt() ->> 'app_role' = 'admin'
    )
    WITH CHECK (
        auth.jwt() ->> 'role' = 'admin' OR
        auth.jwt() ->> 'user_role' = 'admin' OR
        auth.jwt() ->> 'app_role' = 'admin'
    );

-- Policy 5: Only admin users can delete SEO promos
CREATE POLICY "Admin can delete SEO promos" ON promo_seo
    FOR DELETE
    TO authenticated
    USING (
        auth.jwt() ->> 'role' = 'admin' OR
        auth.jwt() ->> 'user_role' = 'admin' OR
        auth.jwt() ->> 'app_role' = 'admin'
    );

-- Policy 6: Service role can perform all operations (for server-side operations)
CREATE POLICY "Service role full access to SEO promos" ON promo_seo
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- =====================================================
-- PROMO_AUTOMATION TABLE POLICIES
-- =====================================================

-- Policy 1: Public read access for active automation promos
CREATE POLICY "Public can view active automation promos" ON promo_automation
    FOR SELECT
    USING (is_active = true);

-- Policy 2: Authenticated users can view all automation promos (including inactive)
CREATE POLICY "Authenticated users can view all automation promos" ON promo_automation
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy 3: Only admin users can insert automation promos
CREATE POLICY "Admin can insert automation promos" ON promo_automation
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.jwt() ->> 'role' = 'admin' OR
        auth.jwt() ->> 'user_role' = 'admin' OR
        auth.jwt() ->> 'app_role' = 'admin'
    );

-- Policy 4: Only admin users can update automation promos
CREATE POLICY "Admin can update automation promos" ON promo_automation
    FOR UPDATE
    TO authenticated
    USING (
        auth.jwt() ->> 'role' = 'admin' OR
        auth.jwt() ->> 'user_role' = 'admin' OR
        auth.jwt() ->> 'app_role' = 'admin'
    )
    WITH CHECK (
        auth.jwt() ->> 'role' = 'admin' OR
        auth.jwt() ->> 'user_role' = 'admin' OR
        auth.jwt() ->> 'app_role' = 'admin'
    );

-- Policy 5: Only admin users can delete automation promos
CREATE POLICY "Admin can delete automation promos" ON promo_automation
    FOR DELETE
    TO authenticated
    USING (
        auth.jwt() ->> 'role' = 'admin' OR
        auth.jwt() ->> 'user_role' = 'admin' OR
        auth.jwt() ->> 'app_role' = 'admin'
    );

-- Policy 6: Service role can perform all operations (for server-side operations)
CREATE POLICY "Service role full access to automation promos" ON promo_automation
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- =====================================================
-- ADDITIONAL SECURITY FUNCTIONS
-- =====================================================

-- Function to check if user is admin (can be used in policies)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN (
        auth.jwt() ->> 'role' = 'admin' OR
        auth.jwt() ->> 'user_role' = 'admin' OR
        auth.jwt() ->> 'app_role' = 'admin'
    );
END;
$$;

-- Function to get current user ID
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN auth.jwt() ->> 'sub';
END;
$$;

-- =====================================================
-- AUDIT TRIGGERS (Optional - for tracking changes)
-- =====================================================

-- Create audit log table for promo changes
CREATE TABLE IF NOT EXISTS promo_audit_log (
    id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id BIGINT NOT NULL,
    operation VARCHAR(10) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    user_id TEXT,
    user_role TEXT,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit function for promo tables
CREATE OR REPLACE FUNCTION audit_promo_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO promo_audit_log (
            table_name, record_id, operation, new_values, user_id, user_role
        ) VALUES (
            TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(NEW),
            get_current_user_id(), auth.jwt() ->> 'role'
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO promo_audit_log (
            table_name, record_id, operation, old_values, new_values, user_id, user_role
        ) VALUES (
            TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(OLD), to_jsonb(NEW),
            get_current_user_id(), auth.jwt() ->> 'role'
        );
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO promo_audit_log (
            table_name, record_id, operation, old_values, user_id, user_role
        ) VALUES (
            TG_TABLE_NAME, OLD.id, TG_OP, to_jsonb(OLD),
            get_current_user_id(), auth.jwt() ->> 'role'
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

-- Create audit triggers for both tables
CREATE TRIGGER promo_seo_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON promo_seo
    FOR EACH ROW EXECUTE FUNCTION audit_promo_changes();

CREATE TRIGGER promo_automation_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON promo_automation
    FOR EACH ROW EXECUTE FUNCTION audit_promo_changes();

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Additional indexes for security and performance
CREATE INDEX IF NOT EXISTS idx_promo_seo_created_by ON promo_seo(created_by);
CREATE INDEX IF NOT EXISTS idx_promo_seo_updated_by ON promo_seo(updated_by);
CREATE INDEX IF NOT EXISTS idx_promo_automation_created_by ON promo_automation(created_by);
CREATE INDEX IF NOT EXISTS idx_promo_automation_updated_by ON promo_automation(updated_by);

-- Index for audit log
CREATE INDEX IF NOT EXISTS idx_promo_audit_log_table_record ON promo_audit_log(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_promo_audit_log_user ON promo_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_promo_audit_log_changed_at ON promo_audit_log(changed_at);

-- =====================================================
-- GRANTS AND PERMISSIONS
-- =====================================================

-- Grant appropriate permissions to anon role (public access)
GRANT SELECT ON promo_seo TO anon;
GRANT SELECT ON promo_automation TO anon;

-- Grant permissions to authenticated role
GRANT SELECT ON promo_seo TO authenticated;
GRANT SELECT ON promo_automation TO authenticated;

-- Grant full permissions to service_role (for server-side operations)
GRANT ALL ON promo_seo TO service_role;
GRANT ALL ON promo_automation TO service_role;
GRANT ALL ON promo_audit_log TO service_role;

-- Grant sequence permissions
GRANT USAGE, SELECT ON SEQUENCE promo_seo_id_seq TO service_role;
GRANT USAGE, SELECT ON SEQUENCE promo_automation_id_seq TO service_role;
GRANT USAGE, SELECT ON SEQUENCE promo_audit_log_id_seq TO service_role;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON POLICY "Public can view active SEO promos" ON promo_seo IS 
'Allows anonymous users to view only active SEO promotional content';

COMMENT ON POLICY "Public can view active automation promos" ON promo_automation IS 
'Allows anonymous users to view only active automation promotional content';

COMMENT ON FUNCTION is_admin() IS 
'Helper function to check if the current user has admin privileges';

COMMENT ON TABLE promo_audit_log IS 
'Audit trail for all changes made to promo tables';

-- =====================================================
-- SECURITY VALIDATION QUERIES
-- =====================================================

-- Test queries to validate security (uncomment to test)
/*
-- Test 1: Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('promo_seo', 'promo_automation');

-- Test 2: List all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('promo_seo', 'promo_automation');

-- Test 3: Check permissions
SELECT table_name, privilege_type, grantee 
FROM information_schema.table_privileges 
WHERE table_name IN ('promo_seo', 'promo_automation');
*/

-- Success message
SELECT 'Promo tables security policies applied successfully!' as status; 