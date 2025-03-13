import { Request, Response } from 'express';
import OtherExpense from '../models/OtherExpensess';
import Transaction from '../models/Transaction';

// Add other expense
export const addOtherExpense = async (req: Request, res: Response): Promise<void> => {
  const { description, amount } = req.body;

  try {
    // Create the expense
    const expense = new OtherExpense({ description, amount });
    await expense.save();

    // Create a corresponding transaction
    const transaction = new Transaction({
      type: 'expense',
      amount,
      description: `Other Expense: ${description}`,
      date: new Date(),
    });
    await transaction.save();

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add other expense.' });
  }
};

// Update other expense
export const updateOtherExpense = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { description, amount } = req.body;

  try {
    // Find the expense
    const expense = await OtherExpense.findByIdAndUpdate(
      id,
      { description, amount },
      { new: true }
    );
    if (!expense) {
      res.status(404).json({ message: 'Expense not found.' });
      return;
    }

    // Update the corresponding transaction
    await Transaction.findOneAndUpdate(
      { description: { $regex: `Other Expense: ${expense.description}`, $options: 'i' } },
      { amount, description: `Other Expense: ${description}` }
    );

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update expense.' });
  }
};

// Delete other expense
export const deleteOtherExpense = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    // Find the expense
    const expense = await OtherExpense.findByIdAndDelete(id);
    if (!expense) {
      res.status(404).json({ message: 'Expense not found.' });
      return;
    }

    // Delete the corresponding transaction
    await Transaction.deleteOne({ description: { $regex: `Other Expense: ${expense.description}`, $options: 'i' } });

    res.json({ message: 'Expense deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete expense.' });
  }
};

// Fetch all other expenses
export const getOtherExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const expenses = await OtherExpense.find();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch other expenses.' });
  }
};
