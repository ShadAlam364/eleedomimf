import GenSalary from "../models/genSalarySchema.js";

export const genSalaryController = async (req, res) => {
  
  try {
    const {
      empid,
      salDate,
      empdesignation,
      empbranch,
      location,
      accNum,
      totalMonthDays,
      empName,
      monthsalary,
      sundays,
      email,
      mobile,
      holidayCount,
      monthleave,
      totalDays,
      presentDays,
      totalHalfDays,
      totalAbsent,
      genSalary,
      genMonths,
      incentive,
      empgrossSalary,
      empbasicSalary,
      emphra,
      empca,
      empmedical,
      emptiffin,
      empcompanyPf,
      emppf,
      kit,
      additional,
      finalAmountSalary,
      otherDeduction,
      finalDeduction,
      empesi,
      emploanemi,
      totalAmount,
      arrear,
      bankNamed,
      fuelExpense,
      otherExpense,
      inWords,
      flags,
      empUniqueId,
    } = req.body;

    // Check if the salary for the given empName and genMonths already exists
    const existingSalary = await GenSalary.findOne({ empName, genMonths });

    if (existingSalary) {
      return res.status(400).json({
        message: "Error",
        status: `Salary for ${genMonths} for ${empName} is already available! Please update it instead.`,
      });
    }
    // Create a new salary instance
    const genNewSalary = new GenSalary({
     
      empid,
      salDate,
      sundays,
      empdesignation,
      empbranch,
      email,
      mobile,
      location,
      accNum,
      empName: empName.toString(),
      monthsalary,
      monthleave,
      totalDays,
      totalMonthDays,
      presentDays,
      totalHalfDays,
      holidayCount,
      totalAbsent,
      genSalary,
      genMonths,
      incentive, 
      empgrossSalary,
      empbasicSalary,
      emphra,
      empca,
      empmedical,
      emptiffin,
      kit,
      additional,
      empcompanyPf,
      emppf,
      empesi,
      emploanemi,
      finalAmountSalary,
      otherDeduction,
      finalDeduction,
      totalAmount,
      arrear,
      bankNamed,
      fuelExpense,
      otherExpense,
      inWords,
      flags,
      empUniqueId,
    });
    // Save the salary to the database
    await genNewSalary .save();
    return res.status(201).json({
      status: "Salary Generated Successfully",
      message: {
        genNewSalary ,
        // Include the list of salary in the response
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "Error during Salary Update",
      message: err.message,
    });
  }
};



// LISTS
// export const salaryList = async (req, res) => {
//   const salariesList = await GenSalary.find({});
//   if (!salariesList) {
//     return res.status(400).json({
//       status: "Error during Salary Update",
//       message: "Invalid Salary selected",
//     });
//   } else {
//     return res.status(200).json(salariesList);
//   }
// };









//shad code 


export const salaryList = async (req, res) => {
  try {
    const { page = 1, limit = 50, month, year } = req.query;
    const skip = (page - 1) * limit;
    console.log("month", month);
      console.log("year", year);

    // Build the query object
    let query = {};
    if (month && year) {
      // Ensure month is two digits (e.g., "01" for January)
      // const formattedMonth = month.padStart(2, "0");
      // console.log("month", month);
      // console.log("year", year);
      
      query.genMonths = `${month}/${year}`;
    }

    const [salariesList, totalCount] = await Promise.all([
       GenSalary.find(query).skip(skip).limit(parseInt(limit)),
       GenSalary.countDocuments(query),
    ]);

    if (!salariesList || salariesList.length === 0) {
      return res.status(404).json({
        status: "Error",
        message: "No salaries found for the selected month and year",
      });
    }

    return res.status(200).json({
      data: salariesList,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
};






//gaurav code
// export const salaryList = async (req, res) => {
//   try {
//     const { page = 1, limit = 50 } = req.query;
//     const skip = (page - 1) * limit;

//     const [salariesList, totalCount] = await Promise.all([
//       GenSalary.find({}).skip(skip).limit(parseInt(limit)),
//       GenSalary.countDocuments({})
//     ]);

//     if (!salariesList) {
//       return res.status(400).json({
//         status: "Error during Salary Update",
//         message: "Invalid Salary selected",
//       });
//     } else {
//       return res.status(200).json({
//         data: salariesList,
//         totalCount,
//         totalPages: Math.ceil(totalCount / limit),
//         currentPage: parseInt(page)
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       status: "Error",
//       message: "Internal server error"
//     });
//   }
// };

// update salary
export const updateGenSalary = async (req, res) => {
  try {
    const gensalaryId = req.params.id;
    const gensalaryData = req.body;

    // Check if the Gen Salary exists before attempting to update
    const existingGensalary = await GenSalary.findById(gensalaryId);

    if (!existingGensalary) {
      return res.status(404).json({
        status: "Gen Salary not found",
        message: "The specified Gen Salary ID does not exist in the database",
      });
    }

    // Perform the update
    const updatedGenSalary = await GenSalary.findByIdAndUpdate(
      gensalaryId,
      gensalaryData,
      {
        new: true,
        runValidators: true, // Optional: Run Mongoose validation
      }
    );

    return res.status(200).json({
      status: "Salary Generate Updated Successfully!",
      message: {
        updatedGenSalary
      },
    });
  } catch (err) {
    console.error("Error during Salary Generate:", err);

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

// ************************* view salarylist ************************* //
export const viewGenList = async (req, res) => {
  const SalaryList = await GenSalary.find({});
  if (!SalaryList) {
    return res.status(400).json({
      status: "Error during salary lists Update",
      message: "Invalid salary selected",
    });
  } else {
    return res.status(200).json(SalaryList);
  }
};

//  delete genSalary controller
export const deleteGenSalary = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await GenSalary.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ message: "Salary deleted successfully", deletedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
