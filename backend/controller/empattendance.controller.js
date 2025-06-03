// attendance.controller.js
import EmpAttendance from "../models/empattendanceSchema.js";
import AddEmployee from "../models/addempSchema.js";


export const markAttendance = async (req, res) => {
  const { employeeId } = req.params;
  const { status, date, time, weekday } = req.body;
  try {
    // Fetch employee information by _id
    const employee = await AddEmployee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if attendance already marked for the given date
    const existingAttendance = await EmpAttendance.findOne({
      employee_id: employee._id,
      date,
    });

    if (existingAttendance) {
      return res
        .status(400)
        .json({ message: "Attendance already marked for this date" });
    }

    // Create attendance record with the current date and time
    const attendanceRecord = new EmpAttendance({
      employee_id: employee._id,
      empname: employee.empname,
      date: date,
      time: time,
      weekday: weekday,
      status: status,
    });
    // Save the attendance record
    await attendanceRecord.save();
    res.status(201).json({
      message: `Attendance marked for ${employee.empname} today!`,
      data: {
        _id: attendanceRecord._id,
      },
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};





export const markLeaveAttendance = async (req, res) => {
  const { employeeId } = req.params;
  const { status, date, time, weekday } = req.body;
  try {
    // Fetch employee information by _id
    const employee = await AddEmployee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    // Check if attendance already marked for the given date
    const existingAttendance = await EmpAttendance.findOne({
      employee_id: employee._id,
      date,
     
    });

    if (existingAttendance) {
      return res
        .status(400)
        .json({ message: "Leave already marked for this date" });
    }

    // Create attendance record with the current date and time
    const attendanceRecord = new EmpAttendance({
      employee_id: employee._id,
      empname: employee.empname,
      date: date,
      time: time,
      weekday: weekday,
      status: status,
    });
    // Save the attendance record
    await attendanceRecord.save();
    res.status(201).json({ message: "Leave Attendance Marked Successfully.....!" });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// getEmployeeAttendance
export const getEmployeeAttendance = async (req, res) => {
  try {
    const { employee_id } = req.params;
    const attendance = await EmpAttendance.find({ employee_id });
    res.status(200).json(attendance);
  } catch (error) {
    console.error("Error fetching employee attendance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const updateEmpAttendance = async (req, res) => {
  try {
    const { employee_id } = req.params;
    const { status, date, empname, time, weekday } = req.body;

    // Find employee attendance by empid and date
    const employeeAttendance = await EmpAttendance.findOneAndUpdate(
      { employee_id: employee_id, date: date },
      { empname, status, time, weekday },
      { new: true, upsert: true }
    );

    if (!employeeAttendance) {
      return res.status(404).json({
        status: "Employee Attendance not found",
        message: "The specified Employee Attendance does not exist in the database for the given date",
      });
    }

    return res.status(200).json({
      status: "Employee Attendance Updated Successfully",
      data: employeeAttendance,
    });
  } catch (err) {
    console.error("Error during Employee Attendance Update:", err);

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        status: "Validation Error",
        message: err.message,
      });
    }

    return res.status(500).json({
      status: "Internal Server Error",
      message: err.message,
    });
  }
};


export const updateEmpLogoutTime = async (req, res) => {
  try {
    const { employee_id, id } = req.params;
    const { logouttime } = req.body;

    // Find employee attendance by empid and date
    const employeeAttendance = await EmpAttendance.findOneAndUpdate(
      { employee_id: employee_id,  _id: id},
      { logouttime },
      { new: true, upsert: true }
    );

    if (!employeeAttendance) {
      return res.status(404).json({
        status: "Employee Logout Time not found",
        message: "The specified Employee Logout Time does not exist in the database for the given date",
      });
    }

    return res.status(200).json({
      status: "Employee Logout Time Updated Successfully",
      data: employeeAttendance,
    });
  } catch (err) {
    console.error("Error during Employee Logout Time Update:", err);

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        status: "Validation Error",
        message: err.message,
      });
    }

    return res.status(500).json({
      status: "Internal Server Error",
      message: err.message,
    });
  }
};