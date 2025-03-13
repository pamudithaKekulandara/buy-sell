import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/global.css';

const Employees = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState(0);
  const [editEmployeeId, setEditEmployeeId] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      alert('Failed to fetch employees');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editEmployeeId) {
        // Update existing employee
        await api.put(`/employees/${editEmployeeId}`, { name, position, salary });
        setEditEmployeeId(null);
      } else {
        // Add new employee
        await api.post('/employees', { name, position, salary });
      }
      fetchEmployees();
      setName('');
      setPosition('');
      setSalary(0);
    } catch (error) {
      alert('Failed to save employee');
    }
  };

  const handleEdit = (employee: any) => {
    setName(employee.name);
    setPosition(employee.position);
    setSalary(employee.salary);
    setEditEmployeeId(employee._id);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (error) {
      alert('Failed to delete employee');
    }
  };

  return (
    <div className="container">
      <h1>Employees</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Employee Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter employee name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="position">Position</label>
            <input
              type="text"
              id="position"
              placeholder="Enter position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="salary">Salary</label>
            <input
              type="number"
              id="salary"
              placeholder="Enter salary"
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            {editEmployeeId ? 'Update Employee' : 'Add Employee'}
          </button>
          {editEmployeeId && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setName('');
                setPosition('');
                setSalary(0);
                setEditEmployeeId(null);
              }}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>
      <h2>Employee List</h2>
      {employees.length === 0 ? (
        <p className="no-data">No data available</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.name}</td>
                <td>{employee.position}</td>
                <td>${employee.salary}</td>
                <td>
                  <button onClick={() => handleEdit(employee)}>Edit</button>
                  <button onClick={() => handleDelete(employee._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Employees;