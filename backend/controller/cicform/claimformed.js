import ClaimFormDB from "../../models/cicform/claimformDB.js";

export const createClaim = async (req, res) => {
  try {
    const {
      date,
      companyName,
      claimType,
      policyNo,
      insuredName,
      contactNo,
      vehicleRegNo,
      vehicleType,
      policyExpiryDate,
      intimationDate,
      claimNo,
      advisor,
      branch,
      claimStatus,
      claimAmount,
      surveyorName,
      surveyorContactNo,
      remarks,
    } = req.body;

    const newClaim = new ClaimFormDB({
      date,
      companyName,
      claimType,
      policyNo,
      insuredName,
      contactNo,
      vehicleRegNo,
      vehicleType,
      policyExpiryDate,
      intimationDate,
      claimNo,
      advisor,
      branch,
      claimStatus,
      claimAmount,
      surveyorName,
      surveyorContactNo,
      remarks,
    });

    const savedClaim = await newClaim.save();
    return res
      .status(201)
      .json({
        message: `${savedClaim.insuredName} Claim Added Successfully...!`,
      });
  } catch (error) {
    res.status(500).json({ message: "Failed to add claim", error });
  }
};

// Controller to get all claim data
export const getAllClaims = async (req, res) => {
  try {
    const claims = await ClaimFormDB.find();
    return res.status(200).json(claims);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve claims", error });
  }
};

// Controller to get claim data by branch
export const getClaimsByBranch = async (req, res) => {
  const { branch } = req.params;
  try {
    const claims = await ClaimFormDB.find({ branch });
    return res
      .status(200)
      .json(claims);
  } catch (error) {
    return res
      .status(500)
      .json({
        message: `Failed to retrieve claims for branch: ${branch}`,
        error,
      });
  }
};

export const updateClaim = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedClaim = await ClaimFormDB.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedClaim) {
      return res
        .status(404)
        .json({
          status: "Claim not found",
          message: "Claim not found in the database",
        });
    }

    return res.status(200).json({
      // status: "Claim Updated Successfully",
      message: `${updatedClaim.insuredName} Claim Updated Successfully....!`,
    });
  } catch (err) {
    console.error(err);

    // Handle specific errors if needed
    if (err.name === "ValidationError") {
      return res.status(400).json({
        status: "Validation Error",
        message: err.message,
      });
    }

    // Handle other errors
    return res.status(500).json({
      status: "Internal Server Error",
      message: err.message,
    });
  }
};

// Controller to delete a claim
export const deleteClaimed = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedClaim = await ClaimFormDB.findByIdAndDelete(id);

    if (!deletedClaim) {
      return res.status(404).json({ message: "Claim not found" });
    }
    return res.status(200).json({ message: `${deletedClaim.insuredName} Claim Deleted Successfully....!` });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete claim", error });
  }
};
