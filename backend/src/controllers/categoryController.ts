import { Request, Response } from 'express';
import { pool } from '../config/db';

const sanitizeKeys = (data: Record<string, any>) => {
  const cleanData = { ...data };
  delete cleanData.id;
  delete cleanData.created_at;
  delete cleanData.updated_at;
  delete cleanData.category_name;
  delete cleanData.collection_name;
  delete cleanData.brand_name;

  const validKeys = Object.keys(cleanData).filter((key) => /^[a-zA-Z0-9_]+$/.test(key));
  const validValues = validKeys.map((key) => cleanData[key]);

  return { validKeys, validValues };
};

export const getAllCategorys = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { validKeys, validValues } = sanitizeKeys(req.body);
  if (validKeys.length === 0) {
    return res.status(400).json({ error: 'No valid fields provided' });
  }

  const placeholders = validValues.map((_, i) => '$' + (i + 1)).join(', ');

  try {
    const result = await pool.query(
      `INSERT INTO categories (${validKeys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      validValues
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { validKeys, validValues } = sanitizeKeys(req.body);
  if (validKeys.length === 0) {
    return res.status(400).json({ error: 'No valid fields provided' });
  }

  const setString = validKeys.map((key, i) => `${key} = $${i + 1}`).join(', ');
  validValues.push(id);

  try {
    const result = await pool.query(
      `UPDATE categories SET ${setString} WHERE id = $${validValues.length} RETURNING *`,
      validValues
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};