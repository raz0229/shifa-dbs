// src/routes/api/query/+server.js
import pool from '$lib/server/db.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { query } = body;

    if (typeof query !== 'string' || !query.trim()) {
      return json({ error: 'Invalid query' }, { status: 400 });
    }

    const [results] = await pool.query(query);

    return json({ success: true, results });

  } catch (err) {
    console.error('Query error:', err);
    return json({ error: err.message || 'Query failed' }, { status: 500 });
  }
}
