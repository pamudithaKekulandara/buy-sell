import { Request, Response } from 'express';
import Transaction from '../models/Transaction';

export const addTransaction = async (req: Request, res: Response): Promise<void> => {
  const { type, amount, description } = req.body;

  try {
    const transaction = new Transaction({ type, amount, description });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add transaction.' });
  }
};

export const getMonthlyReport = async (req: Request, res: Response): Promise<void> => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  try {
    const transactions = await Transaction.find({ date: { $gte: startOfMonth } });
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    res.json({ income, expenses, netProfit: income - expenses });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch monthly report.' });
  }
};

export const getDailySummary = async (req: Request, res: Response): Promise<void> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    try {
      const transactions = await Transaction.find({ date: { $gte: today } });
      const income = transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const expenses = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      res.json({ income, expenses, netProfit: income - expenses });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch daily summary.' });
    }
  };