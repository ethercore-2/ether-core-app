-- =====================================================
-- SECURITY POLICIES FOR PROMO_SEM TABLE
-- =====================================================

-- Enable Row Level Security (RLS)
ALTER TABLE promo_sem ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for active SEM promos" ON promo_sem;
DROP POLICY IF EXISTS "Admin full access to SEM promos" ON promo_sem;
DROP POLICY IF EXISTS "Service role full access to SEM promos" ON promo_sem;

-- =====================================================
-- PUBLIC ACCESS POLICIES
-- =====================================================

-- Allow public read access to active SEM promos only
CREATE POLICY "Public read access for active SEM promos" ON promo_sem
    FOR SELECT
    TO public
    USING (is_active = true);

-- =====================================================
-- ADMIN ACCESS POLICIES
-- =====================================================

-- Full access for admin users (assuming admin role exists)
CREATE POLICY "Admin full access to SEM promos" ON promo_sem
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email IN (
                'admin@ether-core.com',
                'support@ether-core.com'
            )
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email IN (
                'admin@ether-core.com',
                'support@ether-core.com'
            )
        )
    );

-- =====================================================
-- SERVICE ROLE ACCESS
-- =====================================================

-- Full access for service role (for server-side operations)
CREATE POLICY "Service role full access to SEM promos" ON promo_sem
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- =====================================================
-- GRANTS AND PERMISSIONS
-- =====================================================

-- Grant necessary permissions
GRANT SELECT ON promo_sem TO anon;
GRANT SELECT ON promo_sem TO authenticated;
GRANT ALL ON promo_sem TO service_role;

-- Grant usage on the sequence
GRANT USAGE ON SEQUENCE promo_sem_id_seq TO service_role;

-- =====================================================
-- AUDIT LOGGING (Optional)
-- =====================================================

-- Create audit log table for SEM promos
CREATE TABLE IF NOT EXISTS promo_sem_audit (
    id BIGSERIAL PRIMARY KEY,
    promo_sem_id BIGINT REFERENCES promo_sem(id),
    action VARCHAR(10) NOT NULL, -- INSERT, UPDATE, DELETE
    old_data JSONB,
    new_data JSONB,
    changed_by VARCHAR(100),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit function
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
-- HELPER FUNCTIONS
-- =====================================================

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION is_sem_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email IN (
            'admin@ether-core.com',
            'support@ether-core.com'
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get active SEM promos
CREATE OR REPLACE FUNCTION get_active_sem_promos()
RETURNS SETOF promo_sem AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM promo_sem
    WHERE is_active = true
    ORDER BY display_order ASC, created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- PERFORMANCE OPTIMIZATIONS
-- =====================================================

-- Additional indexes for better performance
CREATE INDEX IF NOT EXISTS idx_promo_sem_display_order ON promo_sem(display_order);
CREATE INDEX IF NOT EXISTS idx_promo_sem_created_at ON promo_sem(created_at);
CREATE INDEX IF NOT EXISTS idx_promo_sem_updated_at ON promo_sem(updated_at);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_promo_sem_active_display ON promo_sem(is_active, display_order);

-- =====================================================
-- COMMENTS AND DOCUMENTATION
-- =====================================================

COMMENT ON POLICY "Public read access for active SEM promos" ON promo_sem 
IS 'Allows public users to read only active SEM promotional content';

COMMENT ON POLICY "Admin full access to SEM promos" ON promo_sem 
IS 'Allows admin users full CRUD access to SEM promotional content';

COMMENT ON POLICY "Service role full access to SEM promos" ON promo_sem 
IS 'Allows service role full access for server-side operations';

COMMENT ON FUNCTION is_sem_admin() 
IS 'Helper function to check if current user has admin privileges for SEM promos';

COMMENT ON FUNCTION get_active_sem_promos() 
IS 'Returns all active SEM promos ordered by display_order and creation date';

-- Success message
SELECT 'SEM promo security policies setup completed successfully!' as status; 