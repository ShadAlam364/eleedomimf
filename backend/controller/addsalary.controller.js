import AddEmployee from "../models/addempSchema.js";
// export const addsalaryController = async (req, res) => {
//   try {
//     const { empName, salmonth, saleavemonth } = req.body;
//     // Create a new salary instance
//     const addnewSalary = new AddSalary({
//       empName: empName.toString(),
//       salmonth,
//       saleavemonth,
//     });
//     // Save the salary to the database
//     await addnewSalary.save();
//     return res.status(201).json({
//       status: "Salary Added Successfully",
//       message: {
//         addnewSalary,
//         // Include the list of employees in the response
//       },
//     });
//   } catch (err) {
//     return res.status(400).json({
//       status: "Error during Salary Update",
//       message: err.message,
//     });
//   }
// };
// ************************* List of employeelist ************************* //
export const empList = async (req, res) => {
  const employeeList = await AddEmployee.find({}, "empid empname");
  if (!employeeList) {
    return res.status(400).json({
      status: "Error during Salary Update",
      message: "Invalid employee selected",
    });
  } else {
    return res.status(200).json(employeeList);
  }
};

// **************************** view salarylist **************************** //
// export const viewSalary = async (req, res) => {
//   const SalaryList = await AddSalary.find({});
//   if (!SalaryList) {
//     return res.status(400).json({
//       status: "Error during salary lists Update",
//       message: "Invalid salary selected",
//     });
//   } else {
//     return res.status(200).json(SalaryList);
//   }
// };

// update  salary code 
export const updateSalary = async (req, res) => {
  try {
    const salaryId = req.params.id;
    const salaryData = req.body;
    // Check if the empoyee exists before attempting to update
    const existingSalary = await AddEmployee.findById(salaryId);
    if (!existingSalary) {
      return res.status(404).json({
        status: "Salary not found",
        message: "The specified Salary ID does not exist in the database",
      });
    }
    // Perform the update
    const updatedSalary = await AddEmployee.findByIdAndUpdate(
      salaryId,
      salaryData,
      {
        new: true,
        runValidators: true, // Optional: Run Mongoose validation
      }
    );

    return res.status(200).json({
      status: `Salary Updated Successfully of ${updatedSalary.empname}`,
      message: {
        updatedSalary
      },
    });
  } catch (err) {
    console.error("Error during Salary Update:", err);
    // Handle Mongoose validation errors
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




// // ******************** delete employee controller ************************* //
// export const deleteSalary = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const deletedSalary = await AddSalary.findByIdAndDelete(userId);
//     if (!deletedSalary) {
//       return res.status(404).json({ message: "Salary not found" });
//     }
//     return res.json({ message: "Salary deleted successfully", deletedSalary });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
