// hr.attendance.controller.js
import AddHr from "../../models/hr/hr.js";
import AddHrAttendance from "../../models/hr/hrattendance.js";

// markEmployeeAttendance
export const markHrAttendance = async (req, res) => {
  const { hrid } = req.params;
  console.log(hrid);
  const { status, date, time, weekday } = req.body;
  try {
    // Fetch employee information by _id
    const hr = await AddHr.findById(hrid);

    if (!hr) {
      return res.status(404).json({ message: "HR not found" });
    }

    // Check if attendance already marked for the given date
    const existingAttendance = await AddHrAttendance.findOne({
      hr_id: hr._id,
      date,
    });

    if (existingAttendance) {
      return res
        .status(400)
        .json({ message: "Attendance already marked for this date" });
    }
    // Create attendance record with the current date and time
    const attendanceRecord = new AddHrAttendance({
      hr_id: hr._id,
      hrname: hr.hrname,
      date: date,
      time: time,
      weekday: weekday,
      status: status,
    });

    // Save the attendance record
    await attendanceRecord.save();

    res.status(201).json({ message: "Attendance added successfully" });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// getEmployeeAttendance
export const getHrAttendance = async (req, res) => {
  try {
    const { hrid } = req.params;

    const attendance = await AddHrAttendance.find({ hrid }).sort({
      date: "asc",
    });

    res.status(200).json(attendance);
  } catch (error) {
    console.error("Error fetching hr attendance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
