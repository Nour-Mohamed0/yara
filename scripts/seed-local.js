const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '..', 'data', 'app.db');
const dataDir = path.dirname(dbPath);

// Create data directory
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// Read and execute schema
const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');
db.exec(schema);

// Seed admin user — stable id so JWTs stay valid across re-seeds (same DB file)
const adminPassword = bcrypt.hashSync('admin123', 10);
const adminId = 'user_admin';
const adminEmail = 'admin@example.com';

const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);
if (existing) {
  db.prepare(
    `UPDATE users SET password_hash = ?, full_name = ?, updated_at = datetime('now') WHERE email = ?`
  ).run(adminPassword, 'Admin User', adminEmail);
  console.log('✓ Admin user updated: ' + adminEmail + ' / admin123');
} else {
  db.prepare(
    `INSERT INTO users (id, email, password_hash, full_name, created_at)
     VALUES (?, ?, ?, ?, datetime('now'))`
  ).run(adminId, adminEmail, adminPassword, 'Admin User');
  console.log('✓ Admin user created: ' + adminEmail + ' / admin123');
}

// Seed sample settings
try {
  const settingsId = 'settings_' + Date.now();
  db.prepare(`
    INSERT INTO settings (id, site_title, site_description, contact_email)
    VALUES (?, ?, ?, ?)
  `).run(
    settingsId,
    'English Teacher Portfolio',
    'Professional English teaching platform',
    'contact@example.com'
  );
  console.log('✓ Default settings created');
} catch (error) {
  console.log('✓ Settings already exist');
}

console.log('✓ Database seeded successfully!');
db.close();
