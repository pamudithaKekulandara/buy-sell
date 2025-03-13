import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/global.css';

const MonthlyReport = () => {
  const [monthlyReport, setMonthlyReport] = useState<any>(null);

  useEffect(() => {
    fetchMonthlyReport();
  }, []);

  const fetchMonthlyReport = async () => {
    try {
      const response = await api.get('/transactions/monthly');
      setMonthlyReport(response.data);
    } catch (error) {
      alert('Failed to fetch monthly report');
    }
  };

  return (
    <div className="container">
      <h1>Monthly Report</h1>
      <div className="grid">
        <div className="card">
          <h3>Monthly Income</h3>
          <p>${monthlyReport?.income || 0}</p>
        </div>
        <div className="card">
          <h3>Monthly Expenses</h3>
          <p>${monthlyReport?.expenses || 0}</p>
        </div>
        <div className="card">
          <h3>Net Profit</h3>
          <p>${monthlyReport?.netProfit || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReport;