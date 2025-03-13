import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/global.css';

const OtherExpenses = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const [editExpenseId, setEditExpenseId] = useState<string | null>(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await api.get('/other-expenses');
      setExpenses(response.data);
    } catch (error) {
      alert('Failed to fetch expenses');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editExpenseId) {
        // Update existing expense
        await api.put(`/other-expenses/${editExpenseId}`, { description, amount });
        setEditExpenseId(null);
      } else {
        // Add new expense
        await api.post('/other-expenses', { description, amount });
      }
      fetchExpenses(); // Refresh expenses list
      setDescription('');
      setAmount(0);
    } catch (error) {
      alert('Failed to save expense');
    }
  };

  const handleEdit = (expense: any) => {
    setDescription(expense.description);
    setAmount(expense.amount);
    setEditExpenseId(expense._id);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/other-expenses/${id}`);
      fetchExpenses(); // Refresh expenses list
    } catch (error) {
      alert('Failed to delete expense');
    }
  };

  return (
    <div className="container">
      <h1>Other Expenses</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            {editExpenseId ? 'Update Expense' : 'Add Expense'}
          </button>
          {editExpenseId && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setDescription('');
                setAmount(0);
                setEditExpenseId(null);
              }}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>
      <h2>Expense List</h2>
      {expenses.length === 0 ? (
        <p className="no-data">No data available</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id}>
                <td>{expense.description}</td>
                <td>${expense.amount}</td>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleEdit(expense)}>Edit</button>
                  <button onClick={() => handleDelete(expense._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OtherExpenses;