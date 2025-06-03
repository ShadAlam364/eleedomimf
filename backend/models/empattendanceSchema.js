// attendance.model.js
import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AddEmployee',
      required: true,
    },
    empname: {
      type: String,
      ref: 'AddEmployee',
      required: true,
    },
    date: {
      type: String,
      // required: true,
    },
    time: {
      type: String,
      // required: true,
    },
    logouttime: {
      type: String,
    },
    totalHours:{
      type: String
    },
    weekday: {
      type: String,
      // required: true,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'halfday', 'holiday'],
      // required: true,
    },
  },
  { timestamps: true }
);

const EmpAttendance = mongoose.model('EmpAttendance', AttendanceSchema);

export default EmpAttendance;
