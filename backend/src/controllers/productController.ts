import { Request, Response } from 'express';
import { pool } from '../config/db';

const sanitizeKeys = (data: Record<string, any>) => {
  const cleanData = { ...data };
  delete cleanData.id;
  delete cleanData.created_at;
  delete cleanData.updated_at;
  delete cleanData.collection_name;
  delete cleanData.brand_name;
  delete cleanData.category_name;

  const validKeys = Object.keys(cleanData).filter((key) => /^[a-zA-Z0-9_]+$/.test(key));
  const validValues = validKeys.map((key) => cleanData[key]);

  return { validKeys, validValues };
};

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { validKeys, validValues } = sanitizeKeys(req.body);
  if (validKeys.length === 0) {
    return res.status(400).json({ error: 'No valid fields provided' });
  }

  const placeholders = validValues.map((_, i) => '$' + (i + 1)).join(', ');

  try {
    const result = await pool.query(
      `INSERT INTO products (${validKeys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      validValues
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { validKeys, validValues } = sanitizeKeys(req.body);
  if (validKeys.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  const setString = validKeys.map((key, i) => `${key} = $${i + 1}`).join(', ');
  validValues.push(id);

  try {
    const result = await pool.query(
      `UPDATE products SET ${setString} WHERE id = $${validValues.length} RETURNING *`,
      validValues
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};