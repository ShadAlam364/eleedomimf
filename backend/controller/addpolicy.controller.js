import AddPolicy from "../models/addpolicySchema.js";
// import AddEmployee from "../models/addempSchema.js";
export const addpolicyRegister = async (req, res) => {
  try {
    const { addpolicytype, addpolicytitle, addpolicydesc, addpolicycname } =
      req.body;

    // Check if files are provided in the request
    const addpolicyimage =
      req.files && req.files["addpolicyimage"] && req.files["addpolicyimage"][0]
        ? "https://eleedomimf.onrender.com/uploads/" +
          req.files["addpolicyimage"][0].filename
        : null;

    const addpolicylogo =
      req.files && req.files["addpolicylogo"] && req.files["addpolicylogo"][0]
        ? "https://eleedomimf.onrender.com/uploads/" +
          req.files["addpolicylogo"][0].filename
        : null;

    // Create a new employee instance
    const addnewPolicy = new AddPolicy({
      addpolicytype: addpolicytype.toString(),
      addpolicytitle,
      addpolicydesc,
      addpolicyimage,
      addpolicycname,
      addpolicylogo,
    });
    // Save the employee to the database
    await addnewPolicy.save();
    return res.status(201).json({
      status: "Policy Added Successfully",
      message: {
        addnewPolicy,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "Error during Registration",
      message: err.message,
    });
  }
};

// ************************* view plicylist ************************* //
export const viewPolicy = async (req, res) => {
  const PolicyList = await AddPolicy.find({});
  if (!PolicyList) {
    return res.status(400).json({
      status: "Error during policy lists Update",
      message: "Invalid policy selected",
    });
  } else {
    return res.status(200).json(PolicyList);
  }
};

// Controller function to handle updating specific fields of a Policy
export const updatePolicy = async (req, res) => {
  try {
    const policyId = req.params.id;
    const policyData = req.body;

    // Check if the policy exists before attempting to update
    const existingPolicy = await AddPolicy.findById(policyId);

    if (!existingPolicy) {
      return res.status(404).json({
        status: "Policy not found",
        message: "The specified Policy ID does not exist in the database",
      });
    }

    // Perform the update
    const updatedPolicy = await AddPolicy.findByIdAndUpdate(
      policyId,
      policyData,
      {
        new: true,
        runValidators: true, // Optional: Run Mongoose validation
      }
    );

    return res.status(200).json({
      status: "Policy Updated Successfully!",
      message: {
        updatedPolicy,
      },
    });
  } catch (err) {
    console.error("Error during Policy Update:", err);

    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
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



//  delete policy controller
export const deletePolicy = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedPolicy = await AddPolicy.findByIdAndDelete(userId);
    if (!deletedPolicy) {
      return res.status(404).json({ message: "Policy not found" });
    }
    return res.json({ message: "Policy deleted successfully", deletedPolicy });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
