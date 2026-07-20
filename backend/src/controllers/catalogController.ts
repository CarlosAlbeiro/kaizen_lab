import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getProfile = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT * FROM profile WHERE is_active = true ORDER BY updated_at DESC LIMIT 1`
    );
    res.json(result.rows[0] || null);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getContactInfo = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT * FROM contact_info WHERE is_active = true ORDER BY updated_at DESC LIMIT 1`
    );
    res.json(result.rows[0] || null);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getCollections = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT c.*, cat.name AS category_name
      FROM collections c
      LEFT JOIN categories cat ON cat.id = c.category_id
      WHERE c.is_active = true
      ORDER BY c.created_at ASC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.name AS collection_name, b.name AS brand_name
      FROM products p
      LEFT JOIN collections c ON c.id = p.collection_id
      LEFT JOIN brands b ON b.id = p.brand_id
      WHERE p.is_active = true
      ORDER BY p.created_at ASC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getBrands = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM brands WHERE is_active = true ORDER BY created_at ASC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
