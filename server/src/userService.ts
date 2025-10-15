import { pool } from './database.js';

export interface User {
  id: number;
  auth0_id: string;
  email: string;
  name: string;
  picture: string;
}

export const findOrCreateUser = async (auth0Id: string, email: string, name?: string, picture?: string): Promise<User> => {
  const client = await pool.connect();
  try {
    // Try to find existing user
    let result = await client.query(
      'SELECT * FROM users WHERE auth0_id = $1',
      [auth0Id]
    );

    if (result.rows.length > 0) {
      // Update last login
      await client.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [result.rows[0].id]
      );
      return result.rows[0];
    }

    // Create new user
    result = await client.query(
      `INSERT INTO users (auth0_id, email, name, picture) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [auth0Id, email, name, picture]
    );

    return result.rows[0];
  } finally {
    client.release();
  }
};

export const getUserByAuth0Id = async (auth0Id: string): Promise<User | null> => {
  const result = await pool.query(
    'SELECT * FROM users WHERE auth0_id = $1',
    [auth0Id]
  );
  
  return result.rows[0] || null;
};

