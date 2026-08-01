import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || "postgresql://galeotekbd:galeotek1029bd@82.208.23.125:7006/kaizen";

export const pool = new Pool({
  connectionString,
  ssl: false
});

// Probar conexión
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database', err.stack);
  } else {
    console.log('Connected to PostgreSQL Database:', res.rows[0]);
  }
});
