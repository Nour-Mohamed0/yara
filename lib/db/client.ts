/**
 * D1 Database Client
 * This client provides a wrapper around the Cloudflare D1 database binding.
 * In development, we'll use a mock implementation.
 */

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<T[]>;
  dump(): Promise<ArrayBuffer>;
  exec(query: string): Promise<D1ExecResult>;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<D1Result<T>>;
  run(): Promise<D1Result>;
}

export interface D1Result<T = unknown> {
  success: boolean;
  results?: T[];
  meta: {
    duration: number;
    last_row_id: number | null;
    changes: number | null;
    served_by: string;
    internal_stats: string;
  };
}

export interface D1ExecResult {
  success: boolean;
  count: number;
  duration: number;
}

/**
 * Get the D1 database instance
 * In production, this will be bound via wrangler.toml
 * In development, we need to handle it appropriately
 */
export function getDB(): D1Database {
  // In production/edge runtime - use Cloudflare D1
  if (typeof global !== 'undefined' && (global as any).DB) {
    return (global as any).DB;
  }

  // In development - use local SQLite
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    return getLocalDatabase();
  }

  throw new Error('Database not available');
}

/**
 * Local SQLite database for development
 */
let localDb: any = null;

function getLocalDatabase(): D1Database {
  if (!localDb) {
    try {
      const Database = require('better-sqlite3');
      const path = require('path');
      const dbPath = path.join(process.cwd(), 'data', 'app.db');
      
      // Create data directory if it doesn't exist
      const fs = require('fs');
      const dataDir = path.dirname(dbPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      const db = new Database(dbPath);
      
      // Initialize schema if database is empty
      const tables = db.prepare(
        "SELECT name FROM sqlite_master WHERE type='table'"
      ).all();
      
      if (tables.length === 0) {
        const fs = require('fs');
        const schemaPath = path.join(process.cwd(), 'db', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf-8');
        db.exec(schema);
      }
      
      localDb = db;
    } catch (error) {
      console.error('[v0] SQLite initialization failed:', error);
      return createMockDatabase();
    }
  }
  
  return wrapSqliteAsD1(localDb);
}

/**
 * Wrap better-sqlite3 to match D1 interface
 */
function wrapSqliteAsD1(sqlite: any): D1Database {
  return {
    prepare: (query: string) => {
      const stmt = sqlite.prepare(query);
      return {
        bind: function(...values: unknown[]) {
          this._values = values;
          return this;
        },
        first: async function<T>(): Promise<T | null> {
          try {
            const result = this._values ? stmt.get(...this._values) : stmt.get();
            return result as T || null;
          } catch (error) {
            console.error('[v0] Query error:', error);
            return null;
          }
        },
        all: async function<T>(): Promise<D1Result<T>> {
          try {
            const results = this._values ? stmt.all(...this._values) : stmt.all();
            return {
              success: true,
              results: results as T[],
              meta: { duration: 0, last_row_id: null, changes: null, served_by: 'local-sqlite', internal_stats: '' }
            };
          } catch (error) {
            console.error('[v0] Query error:', error);
            return {
              success: false,
              results: [],
              meta: { duration: 0, last_row_id: null, changes: null, served_by: 'local-sqlite', internal_stats: '' }
            };
          }
        },
        run: async function() {
          try {
            const info = this._values ? stmt.run(...this._values) : stmt.run();
            return {
              success: true,
              meta: {
                duration: 0,
                last_row_id: info.lastInsertRowid || null,
                changes: info.changes || null,
                served_by: 'local-sqlite',
                internal_stats: ''
              }
            };
          } catch (error) {
            console.error('[v0] Query error:', error);
            return {
              success: false,
              meta: { duration: 0, last_row_id: null, changes: null, served_by: 'local-sqlite', internal_stats: '' }
            };
          }
        },
        _values: []
      };
    },
    batch: async (statements: D1PreparedStatement[]) => {
      const results = [];
      for (const stmt of statements) {
        const result = await stmt.run();
        results.push(result);
      }
      return results;
    },
    dump: async () => new ArrayBuffer(0),
    exec: async (query: string) => {
      try {
        sqlite.exec(query);
        return { success: true, count: 0, duration: 0 };
      } catch (error) {
        console.error('[v0] Exec error:', error);
        return { success: false, count: 0, duration: 0 };
      }
    }
  };
}

/**
 * Mock database for development (fallback)
 */
function createMockDatabase(): D1Database {
  return {
    prepare: () => ({
      bind: function() { return this; },
      first: async () => null,
      all: async () => ({ success: true, results: [], meta: { duration: 0, last_row_id: null, changes: null, served_by: '', internal_stats: '' } }),
      run: async () => ({ success: true, meta: { duration: 0, last_row_id: null, changes: null, served_by: '', internal_stats: '' } }),
    }),
    batch: async () => [],
    dump: async () => new ArrayBuffer(0),
    exec: async () => ({ success: true, count: 0, duration: 0 }),
  };
}
