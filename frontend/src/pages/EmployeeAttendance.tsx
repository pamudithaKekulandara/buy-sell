import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/global.css';

const EmployeeAttendance = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [employeeId, setEmployeeId] = useState('');
  const [attendanceId, setAttendanceId] = useState<string | null>(null);
  const [workType, setWorkType] = useState<'full-day' | 'half-day' | 'absent'>('full-day');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees/attendance');
      setEmployees(response.data);
    } catch (error) {
      alert('Failed to fetch employees');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (attendanceId) {
        // Update existing attendance record
        await api.put('/employees/attendance', { employeeId, attendanceId, workType });
      } else {
        // Add new attendance record
        await api.post('/employees/attendance', { employeeId, workType });
      }
      alert('Attendance recorded successfully');
      fetchEmployees(); // Refresh employee list
      setEmployeeId('');
      setAttendanceId(null);
      setWorkType('full-day');
    } catch (error) {
      alert('Failed to record attendance');
    }
  };

  const handleEdit = (employeeId: string, record: any) => {
    setEmployeeId(employeeId);
    setAttendanceId(record._id);
    setWorkType(record.workType);
  };

  const handleDelete = async (employeeId: string, attendanceId: string) => {
    try {
      await api.delete('/employees/attendance', { data: { employeeId, attendanceId } });
      alert('Attendance deleted successfully');
      fetchEmployees(); // Refresh employee list
    } catch (error) {
      alert('Failed to delete attendance');
    }
  };

  return (
    <div className="container">
      <h1>Employee Attendance</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="employee">Select Employee</label>
            <select
              id="employee"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select an employee
              </option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.name} (${employee.salary})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="workType">Work Type</label>
            <select
              id="workType"
              value={workType}
              onChange={(e) => setWorkType(e.target.value as 'full-day' | 'half-day' | 'absent')}
              required
            >
              <option value="full-day">Full Day</option>
              <option value="half-day">Half Day</option>
              <option value="absent">Absent</option>
            </select>
          </div>
          <button type="submit" className="btn-primary">
            {attendanceId ? 'Update Attendance' : 'Record Attendance'}
          </button>
          {attendanceId && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setEmployeeId('');
                setAttendanceId(null);
                setWorkType('full-day');
              }}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>
      <h2>Employee Attendance Records</h2>
      {employees.length === 0 ? (
        <p className="no-data">No data available</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Salary</th>
              <th>Attendance</th>
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
                  <ul>
                    {employee.attendance.map((record: any, index: number) => (
                      <li key={index}>
                        {new Date(record.date).toLocaleDateString()}: {record.workType}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  {employee.attendance.map((record: any, index: number) => (
                    <div key={index}>
                      <button onClick={() => handleEdit(employee._id, record)}>Edit</button>
                      <button onClick={() => handleDelete(employee._id, record._id)}>Delete</button>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeAttendance;