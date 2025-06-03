import GenHRSalary from "../../models/hr/genSalary.js";

export const genHrSalaryController = async (req, res) => {
  try {
    const {
      hrname,
      hrmonthlySalary,
      hrmonthlyLeave,
      genHrMonths,
      totalhrDays,
      presenthrDays,
      totalhrHalfDays,
      totalhrAbsent,
      genhrSalary,
      hrincentive,
      totalhrAmount,
      grossSalary,
      basicSalary,
      hra,
      ca, 
      medical,
      tiffin,
      companyPf,
      pf,
      esi,
      loanemi,

    } = req.body;
    // Create a new salary instance
    const genNewSalary = new GenHRSalary({   
      hrname: hrname.toString(),
      hrmonthlySalary,
      hrmonthlyLeave,
      genHrMonths,
      totalhrDays,
      presenthrDays,
      totalhrHalfDays,
      totalhrAbsent,
      genhrSalary,
      hrincentive,
      totalhrAmount,
      grossSalary,
      basicSalary,
      hra,
      ca, 
      medical,
      tiffin,
      companyPf,
      pf,
      esi,
      loanemi,
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
      status: "Error during HR Salary Update",
      message: err.message,
    });
  }
};



// LISTS
export const salaryHrList = async (req, res) => {
  const salariesList = await GenHRSalary.find({});
  if (!salariesList) {
    return res.status(400).json({
      status: "Error during Salary Update",
      message: "Invalid Salary selected",
    });
  } else {
    return res.status(200).json(salariesList);
  }
};

// update salary
export const updateHrGenSalary = async (req, res) => {
  try {
    const gensalaryId = req.params.id;
    const gensalaryData = req.body;

    // Check if the Gen Salary exists before attempting to update
    const existingGensalary = await GenHRSalary.findById(gensalaryId);

    if (!existingGensalary) {
      return res.status(404).json({
        status: "Gen Salary not found",
        message: "The specified Gen HR Salary ID does not exist in the database",
      });
    }

    // Perform the update
    const updatedGenSalary = await GenHRSalary.findByIdAndUpdate(
      gensalaryId,
      gensalaryData,
      {
        new: true,
        runValidators: true, // Optional: Run Mongoose validation
      }
    );

    return res.status(200).json({
      status: "HR Salary Generate Updated Successfully!",
      message: {
        updatedGenSalary
      },
    });
  } catch (err) {
    console.error("Error during HR Salary Generate:", err);

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
export const viewGenHrList = async (req, res) => {
  const SalaryList = await GenHRSalary.find({});
  if (!SalaryList) {
    return res.status(400).json({
      status: "Error during hr salary lists Update",
      message: "Invalid salary selected",
    });
  } else {
    return res.status(200).json(SalaryList);
  }
};

//  delete genSalary controller
export const deleteHrGenSalary = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await GenHRSalary.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ message: "HR Salary deleted successfully", deletedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
