// attendance.model.js
import mongoose from 'mongoose';

const AttendHrSchema = new mongoose.Schema(
  {
    hr_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AddHr',
      required: true,
    },
    hrname: {
      type: String,
      ref: 'AddHr',
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    weekday: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'halfday', 'holiday'],
      // required: true,
    },
  },
  { timestamps: true }
);

const HrAttendance = mongoose.model('HrAttendance', AttendHrSchema);

export default HrAttendance;
