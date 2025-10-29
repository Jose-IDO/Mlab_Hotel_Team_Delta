import pool from '../config/db';
import { User } from '../types/user.types';

type CreateUserDTO = {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
};

function rowToUser(row: any): User {
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    profileImageUrl: row.profile_image_url,
    emailVerified: row.email_verified,
    isActive: row.is_active,
    roles: row.roles || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastLoginAt: row.last_login_at
  };
}

class UserRepository {
  async findByEmail(email: string): Promise<(User & { passwordHash?: string }) | null> {
    const sql = `
      SELECT 
        u.*,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT('name', r.name, 'displayName', r.display_name)
          ) FILTER (WHERE r.id IS NOT NULL),
          '[]'
        ) AS roles
      FROM users u
      LEFT JOIN user_roles ur ON ur.user_id = u.id AND ur.is_active = TRUE
      LEFT JOIN roles r ON r.id = ur.role_id
      WHERE u.email = $1
      GROUP BY u.id;
    `;
    const { rows } = await pool.query(sql, [email]);
    if (!rows[0]) return null;
    
    return {
      ...rowToUser(rows[0]),
      passwordHash: rows[0].password_hash
    };
  }

  async findById(id: string): Promise<User | null> {
    const sql = `
      SELECT 
        u.*,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT('name', r.name, 'displayName', r.display_name)
          ) FILTER (WHERE r.id IS NOT NULL),
          '[]'
        ) AS roles
      FROM users u
      LEFT JOIN user_roles ur ON ur.user_id = u.id AND ur.is_active = TRUE
      LEFT JOIN roles r ON r.id = ur.role_id
      WHERE u.id = $1
      GROUP BY u.id;
    `;
    const { rows } = await pool.query(sql, [id]);
    return rows[0] ? rowToUser(rows[0]) : null;
  }

  async create(userData: CreateUserDTO): Promise<User> {
    const sql = `
      INSERT INTO users (email, password_hash, first_name, last_name, phone)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [
      userData.email,
      userData.passwordHash,
      userData.firstName,
      userData.lastName,
      userData.phone || null
    ];
    
    const { rows } = await pool.query(sql, values);
    
    // Fetch with roles (trigger auto-assigns customer role)
    const userWithRoles = await this.findById(rows[0].id);
    return userWithRoles!;
  }

  async updateLastLogin(userId: string): Promise<void> {
    await pool.query(
      'UPDATE users SET last_login_at = NOW() WHERE id = $1',
      [userId]
    );
  }
}

export const userRepository = new UserRepository();
