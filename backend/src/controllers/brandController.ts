import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getAllBrands = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM brands ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getBrandById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM brands WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createBrand = async (req: Request, res: Response) => {
  const data = req.body;
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = values.map((_, i) => '$' + (i + 1)).join(', ');
  
  try {
    const result = await pool.query(
      'INSERT INTO brands (' + keys.join(', ') + ') VALUES (' + placeholders + ') RETURNING *',
      values
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateBrand = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const keys = Object.keys(data);
  const values = Object.values(data);
  
  const setString = keys.map((key, i) => key + ' = $' + (i + 1)).join(', ');
  values.push(id);
  
  try {
    const result = await pool.query(
      'UPDATE brands SET ' + setString + ' WHERE id = $' + values.length + ' RETURNING *',
      values
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM brands WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};