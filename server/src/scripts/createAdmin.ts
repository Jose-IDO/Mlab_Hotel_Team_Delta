import bcrypt from 'bcrypt';
import db from '../config/db';

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@deltahotel.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const firstName = process.env.ADMIN_FIRST_NAME || 'Admin';
  const lastName = process.env.ADMIN_LAST_NAME || 'User';

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const userResult = await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, email_verified, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO UPDATE
       SET password_hash = EXCLUDED.password_hash,
           first_name = EXCLUDED.first_name,
           last_name = EXCLUDED.last_name
       RETURNING id, email, first_name, last_name`,
      [email, passwordHash, firstName, lastName, true, true]
    );

    const userId = userResult.rows[0].id;

    const roleResult = await db.query(
      `SELECT id FROM roles WHERE name = 'super_admin'`
    );

    if (roleResult.rows.length === 0) {
      throw new Error('super_admin role not found. Run migrations first.');
    }

    const roleId = roleResult.rows[0].id;

    await db.query(
      `INSERT INTO user_roles (user_id, role_id, is_active)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, role_id) DO UPDATE
       SET is_active = EXCLUDED.is_active`,
      [userId, roleId, true]
    );

    console.log('✅ Admin user created successfully!');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: super_admin`);
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Failed to create admin user:', error.message);
    process.exit(1);
  }
}

createAdmin();

