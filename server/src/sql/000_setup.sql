-- ============================================================================
-- MLAB HOTEL DATABASE - COMPLETE SETUP SCRIPT
-- ============================================================================
-- This script sets up the entire database schema for the hotel management system
-- Run this once in pgAdmin Query Tool or psql
-- ============================================================================

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- SECTION 1: ROOMS TABLES
-- ============================================================================

-- Rooms table: stores room types (Ocean Suite, Deluxe King, etc.)
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_name TEXT NOT NULL,
  room_type TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  max_guests INT NOT NULL DEFAULT 1,
  bed_type TEXT NOT NULL,
  number_of_beds INT NOT NULL DEFAULT 1,
  room_size_sqm NUMERIC(10,2) NOT NULL DEFAULT 0,
  amenities TEXT[] NOT NULL DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Room units: stores individual sellable units (101, 102, 103, etc.)
CREATE TABLE IF NOT EXISTS room_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
);

-- Indexes for rooms
CREATE INDEX IF NOT EXISTS idx_room_units_room ON room_units(room_id);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);

COMMENT ON TABLE rooms IS 'Room types with pricing, amenities, and specifications';
COMMENT ON TABLE room_units IS 'Individual room units linked to room types';

-- ============================================================================
-- SECTION 2: USERS AND AUTHENTICATION
-- ============================================================================

-- Users table: stores all user accounts (customers, admins, hotel managers)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    profile_image_url TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Indexes for users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active) WHERE is_active = TRUE;

COMMENT ON TABLE users IS 'All user accounts in the system';
COMMENT ON COLUMN users.password_hash IS 'Bcrypt hashed password, NULL if OAuth only';

-- OAuth accounts table: for social media login (Google, Facebook, etc.)
CREATE TABLE IF NOT EXISTS oauth_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(provider, provider_user_id)
);

CREATE INDEX IF NOT EXISTS idx_oauth_user_id ON oauth_accounts(user_id);
COMMENT ON TABLE oauth_accounts IS 'Social media login accounts (Google, Facebook, etc.)';

-- ============================================================================
-- SECTION 3: ROLES AND PERMISSIONS
-- ============================================================================

-- Roles table: defines user roles
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name);

-- Pre-populate system roles
INSERT INTO roles (name, display_name, description, is_system_role) 
VALUES
('super_admin', 'Super Administrator', 'Full system access', TRUE),
('hotel_manager', 'Hotel Manager', 'Manage own properties', TRUE),
('support_agent', 'Support Agent', 'Help customers', TRUE),
('customer', 'Customer', 'Book accommodations', TRUE)
ON CONFLICT (name) DO NOTHING;

-- User roles table: links users to their roles (many-to-many)
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    granted_by UUID REFERENCES users(id),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (user_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_active ON user_roles(user_id, is_active);
COMMENT ON TABLE user_roles IS 'Links users to their roles (many-to-many)';

-- ============================================================================
-- SECTION 4: TRIGGERS AND FUNCTIONS
-- ============================================================================

-- Function: Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update rooms.updated_at
DROP TRIGGER IF EXISTS update_rooms_updated_at ON rooms;
CREATE TRIGGER update_rooms_updated_at
BEFORE UPDATE ON rooms
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update users.updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update roles.updated_at
DROP TRIGGER IF EXISTS update_roles_updated_at ON roles;
CREATE TRIGGER update_roles_updated_at
BEFORE UPDATE ON roles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Function: Auto-assign 'customer' role to new users
CREATE OR REPLACE FUNCTION assign_customer_role()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_roles (user_id, role_id)
    SELECT NEW.id, r.id
    FROM roles r
    WHERE r.name = 'customer';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-assign customer role on user creation
DROP TRIGGER IF EXISTS auto_assign_customer_role ON users;
CREATE TRIGGER auto_assign_customer_role
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION assign_customer_role();

COMMENT ON FUNCTION assign_customer_role() IS 'Automatically gives new users the customer role';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Display created tables
DO $$
BEGIN
    RAISE NOTICE '=================================================';
    RAISE NOTICE 'DATABASE SETUP COMPLETE!';
    RAISE NOTICE '=================================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Created Tables:';
    RAISE NOTICE '  ✓ rooms (with status column)';
    RAISE NOTICE '  ✓ room_units';
    RAISE NOTICE '  ✓ users';
    RAISE NOTICE '  ✓ oauth_accounts';
    RAISE NOTICE '  ✓ roles (with 4 default roles)';
    RAISE NOTICE '  ✓ user_roles';
    RAISE NOTICE '';
    RAISE NOTICE 'Created Triggers:';
    RAISE NOTICE '  ✓ Auto-update timestamps';
    RAISE NOTICE '  ✓ Auto-assign customer role';
    RAISE NOTICE '';
    RAISE NOTICE 'You can now:';
    RAISE NOTICE '  1. Start the backend server (npm run dev)';
    RAISE NOTICE '  2. Register new users via /auth/register';
    RAISE NOTICE '  3. Create rooms via /admin/rooms';
    RAISE NOTICE '=================================================';
END $$;

-- Optional: Display table counts
SELECT 
    'rooms' as table_name, 
    COUNT(*) as record_count 
FROM rooms
UNION ALL
SELECT 'room_units', COUNT(*) FROM room_units
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'roles', COUNT(*) FROM roles
UNION ALL
SELECT 'user_roles', COUNT(*) FROM user_roles
UNION ALL
SELECT 'oauth_accounts', COUNT(*) FROM oauth_accounts;