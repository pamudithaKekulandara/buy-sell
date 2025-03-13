import { Request, Response } from 'express';
import Sale from '../models/Sales';
import Product from '../models/Product';
import Transaction from '../models/Transaction';


// Optional: Fetch all sales
export const getSales = async (req: Request, res: Response) => {
  try {
    const sales = await Sale.find().populate('product', 'name price');
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sales.' });
  }
};

export const updateSale = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { productId, quantity, saleDate } = req.body;

  try {
    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found.' });
      return;
    }

    // Calculate total price
    const totalPrice = product.price * quantity;

    // Update the sale
    const sale = await Sale.findByIdAndUpdate(
      id,
      { product: productId, quantity, totalPrice, saleDate },
      { new: true }
    ).populate('product');
    if (!sale) {
      res.status(404).json({ message: 'Sale not found.' });
      return;
    }

    // Update the corresponding transaction
    await Transaction.findOneAndUpdate(
      { description: { $regex: `Sale of ${sale.quantity} units of ${sale.product}`, $options: 'i' } },
      { amount: totalPrice, description: `Sale of ${quantity} units of ${product.name}` }
    );

    res.json(sale);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update sale.' });
  }
};

export const deleteSale = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    // Find the sale
    const sale = await Sale.findByIdAndDelete(id).populate('product');
    if (!sale) {
      res.status(404).json({ message: 'Sale not found.' });
      return;
    }

    // Delete the corresponding transaction
    await Transaction.deleteOne({ description: { $regex: `Sale of ${sale.quantity} units of ${sale.product}`, $options: 'i' } });

    res.json({ message: 'Sale deleted successfully.' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete sale.' });
  }
};

export const recordSale = async (req: Request, res: Response): Promise<void> => {
  const { productId, quantity, saleDate } = req.body;

  try {
    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found.' });
      return;
    }

    // Check if there's enough stock
    if (product.stock < quantity) {
      res.status(400).json({ message: 'Insufficient stock.' });
      return;
    }

    // Calculate total price
    const totalPrice = product.price * quantity;

    // Create a new sale record
    const sale = new Sale({
      product: productId,
      quantity,
      totalPrice,
      saleDate,
    });
    await sale.save();

    // Update product stock
    product.stock -= quantity;
    await product.save();

    // Create a transaction record for income
    const transaction = new Transaction({
      type: 'income',
      amount: totalPrice,
      description: `Sale of ${quantity} units of ${product.name}`,
      date: saleDate || new Date(),
    });
    await transaction.save();

    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: 'Failed to record sale.' });
  }
};