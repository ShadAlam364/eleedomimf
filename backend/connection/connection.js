import dotenv from "dotenv";
import Mongoose from "mongoose";
import cron from 'node-cron';
import AddEmployee from "../models/addempSchema.js";
dotenv.config();
const { MONGODB_URI, DB_NAME } = process.env;

const connectDB = async() => {
  try {
    const connectionIns = await Mongoose.connect(`${MONGODB_URI}/${DB_NAME}`);
    console.log(
      `MongoDB connected !! DB Host: ${connectionIns.connection.host}`
    );
  } catch (error) {
    console.log("Mongo connection error", error);
    process.exit(1);
  }
};

export default connectDB;

// USING NODE-CRON SCHEDULER TO UPDATE EVERY YEAR ON 1ST APRIL
const resetFinancialYear = async () => {
  try {
    // Fetch all employee documents
    const employees = await AddEmployee.find({});

    for (const employee of employees) {
      // Reset leave balances
      employee.leavebalance = [
        { restLeave: "CL", num: 6 },
        { restLeave: "SL", num: 4 },
        { restLeave: "PL", num: 2 },
        { restLeave: "EL", num: 0 }
      ];

      // Save the updated employee document
      await employee.save();
    }

    console.log('Financial year leave balance reset successfully...!');
  } catch (err) {
    console.error('Error resetting financial year leave balance:', err);
  }
};

// Schedule the task to run at 00:00 on April 1st every year
//            mm hh date month
cron.schedule('0 0 1 4 *', () => {
  console.log('Running the financial year reset job...');
  resetFinancialYear();
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});



// // Define function to update employee flags
// const updateEmployeeFlags = async () => {
//   try {
//     // Update all documents
//     const updateResult = await GenSalary.updateMany({}, { flags: false });
//     console.log(`Updated ${updateResult.nModified} employee records.`);
//   } catch (error) {
//     console.error('Error updating employee flags:', error);
//   }
// };

// // Schedule the update to run every day at midnight
// //             mm hh date month year
// cron.schedule('05 12 17 6 *', () => {
//   console.log('Running employee flags update task...');
//   updateEmployeeFlags();
// });
