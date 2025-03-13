import React, { JSX } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Employees from './pages/Employees';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import './styles/global.css';
import Dashboard from './pages/Dashboard';
import MonthlyReport from './pages/MonthlyReport';
import EmployeeAttendance from './pages/EmployeeAttendance';
import OtherExpenses from './pages/OtherExpenses';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/product"
            element={
              <PrivateRoute>
                <Products />
              </PrivateRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <PrivateRoute>
                <Sales />
              </PrivateRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <PrivateRoute>
                <Employees />
              </PrivateRoute>
            }
          />
          <Route
  path="/"
  element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  }
/>
<Route
  path="/monthly-report"
  element={
    <PrivateRoute>
      <MonthlyReport />
    </PrivateRoute>
  }/>

<Route
  path="/employee-attendance"
  element={
    <PrivateRoute>
      <EmployeeAttendance />
    </PrivateRoute>
  }/>

<Route
  path="/other-expenses"
  element={
    <PrivateRoute>
      <OtherExpenses />
    </PrivateRoute>
  }
/>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;