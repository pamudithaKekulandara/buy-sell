import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav>
      <div>
        <Link to="/product">Products</Link>
        <Link to="/sales">Sales</Link>
        <Link to="/other-expenses">Other Expenses</Link>
        <Link to="/employees">Employees</Link>
        <Link to="/employee-attendance">Employee Attendance</Link>
        <Link to="/">Dashboard</Link>
        <Link to="/monthly-report">Monthly Report</Link>

      </div>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};

export default Navbar;