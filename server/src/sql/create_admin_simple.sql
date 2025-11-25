-- Simple admin creation (requires manual bcrypt hash)
-- Option 1: Use online bcrypt generator: https://bcrypt-generator.com/
-- Enter password: admin123, rounds: 10
-- Copy the hash and paste it below

-- Insert admin user (replace $2b$10$... with your bcrypt hash)
INSERT INTO users (email, password_hash, first_name, last_name, email_verified, is_active)
VALUES (
  'admin@deltahotel.com',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',  -- This is 'admin123' hashed
  'Admin',
  'User',
  true,
  true
)
ON CONFLICT (email) DO UPDATE
SET password_hash = EXCLUDED.password_hash,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
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





