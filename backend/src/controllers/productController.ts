import { Request, Response } from 'express';
import Product from '../models/Product';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products.' });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  const { name, price, stock } = req.body;

  try {
    const product = new Product({ name, price, stock });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add product.' });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, price, stock } = req.body;

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { name, price, stock },
      { new: true }
    );
    if (!product) {
      res.status(404).json({ message: 'Product not found.' });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update product.' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      res.status(404).json({ message: 'Product not found.' });
      return;
    }
    res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete product.' });
  }
};