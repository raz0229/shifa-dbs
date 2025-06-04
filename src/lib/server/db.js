// src/lib/server/db.js
import mysql from 'mysql2/promise';
import { DATABASE_HOST,
        DATABASE_USER,
        DATABASE_PASSWORD,
        DATABASE_NAME,
        DATABASE_PORT
 } from '$env/static/private';

const pool = mysql.createPool({
  host: DATABASE_HOST,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  port: DATABASE_PORT
});

export default pool;
