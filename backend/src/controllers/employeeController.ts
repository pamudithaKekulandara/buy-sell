import { Request, Response } from 'express';
import Employee from '../models/Employee';
import Transaction from '../models/Transaction';

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch employees.' });
  }
};

export const addEmployee = async (req: Request, res: Response) => {
  const { name, position, salary } = req.body;

  try {
    const employee = new Employee({ name, position, salary });
    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add employee.' });
  }
};

export const recordAttendance = async (req: Request, res: Response): Promise<void> => {
  const { employeeId, workType } = req.body;

  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      res.status(404).json({ message: 'Employee not found.' });
      return;
    }

    // Add attendance record
    employee.attendance.push({ date: new Date(), workType });
    await employee.save();

    // Update expenses based on attendance
    let expenseAmount = 0;
    if (workType === 'absent') {
      expenseAmount = employee.salary; // Full salary deduction for absence
    } else if (workType === 'half-day') {
      expenseAmount = employee.salary / 2; // Half salary deduction for half-day
    }

    if (expenseAmount > 0) {
      const transaction = new Transaction({
        type: 'expense',
        amount: expenseAmount,
        description: `Salary deduction for ${employee.name} (${workType})`,
        date: new Date(),
      });
      await transaction.save();
    }

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Failed to record attendance.' });
  }
};

// Get all employees with attendance records
export const getEmployeesWithAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch employees.' });
  }
};

export const updateEmployee = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, position, salary } = req.body;
  try {
    const employee = await Employee.findByIdAndUpdate(
      id,
      { name, position, salary },
      { new: true }
    );
    if (!employee) {
      res.status(404).json({ message: 'Employee not found.' });
      return;
    }
    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update employee.' });
  }
};

// Delete employee
export const deleteEmployee = async (req: Request, res: Response): Promise<void> => {
  console.log("test");
  const { id } = req.params;

  try {
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      res.status(404).json({ message: 'Employee not found.' });
      return;
    }

    // Optionally, delete related transactions (e.g., salary expenses)
    await Transaction.deleteMany({ description: { $regex: employee.name, $options: 'i' } });

    res.json({ message: 'Employee deleted successfully.' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete employee.' });
  }
};

export const deleteAttendance = async (req: Request, res: Response): Promise<void> => {
  const { employeeId, attendanceId } = req.body;

  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      res.status(404).json({ message: 'Employee not found.' });
      return;
    }

    // Remove the attendance record using Mongoose's pull method
    employee.attendance.pull(attendanceId);
    await employee.save();

    // Recalculate expenses
    await recalculateExpenses(employee);

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete attendance.' });
  }
};

export const updateAttendance = async (req: Request, res: Response): Promise<void> => {
  const { employeeId, attendanceId, workType } = req.body;

  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      res.status(404).json({ message: 'Employee not found.' });
      return;
    }

    // Find the attendance subdocument using Mongoose's id method
    const attendance = employee.attendance.id(attendanceId);
    if (!attendance) {
      res.status(404).json({ message: 'Attendance record not found.' });
      return;
    }

    // Update the attendance record
    attendance.workType = workType;
    await employee.save();

    // Recalculate expenses
    await recalculateExpenses(employee);

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update attendance.' });
  }
};

// Helper function to recalculate expenses
const recalculateExpenses = async (employee: any) => {
  // Delete existing salary-related transactions
  await Transaction.deleteMany({ description: { $regex: employee.name, $options: 'i' } });

  // Calculate new expenses based on attendance
  for (const record of employee.attendance) {
    let expenseAmount = 0;
    if (record.workType === 'absent') {
      expenseAmount = employee.salary; // Full salary deduction for absence
    } else if (record.workType === 'half-day') {
      expenseAmount = employee.salary / 2; // Half salary deduction for half-day
    }

    if (expenseAmount > 0) {
      const transaction = new Transaction({
        type: 'expense',
        amount: expenseAmount,
        description: `Salary deduction for ${employee.name} (${record.workType})`,
        date: record.date,
      });
      await transaction.save();
    }
  }
};