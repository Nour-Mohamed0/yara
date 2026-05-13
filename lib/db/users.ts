import { getDB } from './client';
import { nanoid } from 'nanoid';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = getDB();
  const result = await db
    .prepare('SELECT * FROM users WHERE email = ?')
    .bind(email)
    .first<User & { password_hash: string }>();

  return result ? { ...result } : null;
}

export async function getUserById(id: string): Promise<User | null> {
  const db = getDB();
  const result = await db
    .prepare('SELECT id, email, full_name, bio, avatar_url, created_at, updated_at FROM users WHERE id = ?')
    .bind(id)
    .first<User>();

  return result || null;
}

export async function createUser(
  email: string,
  passwordHash: string,
  fullName?: string
): Promise<User> {
  const db = getDB();
  const id = nanoid();
  const now = new Date().toISOString();

  await db
    .prepare(
      'INSERT INTO users (id, email, password_hash, full_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .bind(id, email, passwordHash, fullName || null, now, now)
    .run();

  return {
    id,
    email,
    full_name: fullName || null,
    bio: null,
    avatar_url: null,
    created_at: now,
    updated_at: now,
  };
}

export async function updateUser(
  id: string,
  updates: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>
): Promise<User | null> {
  const db = getDB();
  const now = new Date().toISOString();

  const entries = Object.entries(updates).filter(([, v]) => v !== undefined);
  const fields = entries.map(([key]) => `${key} = ?`).join(', ');

  if (!fields) return getUserById(id);

  const values = entries.map(([, v]) => v);

  await db
    .prepare(`UPDATE users SET ${fields}, updated_at = ? WHERE id = ?`)
    .bind(...values, now, id)
    .run();

  return getUserById(id);
}

export async function getUserPasswordHash(userId: string): Promise<string | null> {
  const db = getDB();
  const result = await db
    .prepare('SELECT password_hash FROM users WHERE id = ?')
    .bind(userId)
    .first<{ password_hash: string }>();

  return result?.password_hash || null;
}

export async function updateUserPassword(userId: string, passwordHash: string): Promise<void> {
  const db = getDB();
  const now = new Date().toISOString();

  await db
    .prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?')
    .bind(passwordHash, now, userId)
    .run();
}
