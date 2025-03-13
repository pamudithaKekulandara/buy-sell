import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/global.css';

const Dashboard = () => {
  const [dailySummary, setDailySummary] = useState<any>(null);

  useEffect(() => {
    fetchDailySummary();
  }, []);

  const fetchDailySummary = async () => {
    try {
      const response = await api.get('/transactions/daily');
      setDailySummary(response.data);
    } catch (error) {
      alert('Failed to fetch daily summary');
    }
  };

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <div className="grid">
        <div className="card">
          <h3>Daily Income</h3>
          <p>Rs.{dailySummary?.income || 0}</p>
        </div>
        <div className="card">
          <h3>Daily Expenses</h3>
          <p>Rs.{dailySummary?.expenses || 0}</p>
        </div>
        <div className="card">
          <h3>Net Profit</h3>
          <p>Rs.{dailySummary?.netProfit || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;