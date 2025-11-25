-- Create admin user with password 'admin123'
-- This uses PostgreSQL's crypt function (requires pgcrypto extension)

-- Enable pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert admin user (password: admin123)
INSERT INTO users (email, password_hash, first_name, last_name, email_verified, is_active)
VALUES (
  'admin@deltahotel.com',
  crypt('admin123', gen_salt('bf', 10)),
  'Admin',
  'User',
  true,
  true
)
ON CONFLICT (email) DO UPDATE
SET password_hash = crypt('admin123', gen_salt('bf', 10)),
    first_name = 'Admin',
    last_name = 'User',
    email_verified = true,
    is_active = true
RETURNING id, email;

-- Assign super_admin role
INSERT INTO user_roles (user_id, role_id, is_active)
SELECT 
  u.id,
  r.id,
  true
FROM users u, roles r
WHERE u.email = 'admin@deltahotel.com'
  AND r.name = 'super_admin'
ON CONFLICT (user_id, role_id) DO UPDATE
SET is_active = true;

-- Verify admin was created
SELECT 
  u.email,
  u.first_name,
  u.last_name,
  r.name as role_name
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'admin@deltahotel.com';





