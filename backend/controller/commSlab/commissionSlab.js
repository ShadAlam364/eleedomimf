import VehicleSlab from "../../models/commSlab/vehiclesslab.js";
import CompanyGrid from "../../models/commSlab/companypayout.js";
export const cvehicleSlab = async (req, res) => {
  try {
    const {
      advisorId,
      company,
      branch,
      sitcapacity,
      advisorName,
      advisorUniqueId,
      states,
      districts,
      vehicleSlab,
      cnames,
      segments,
      policytypes,
      pcodes,
      catnames,
      vage,
      vfuels,
      vncb,
      voddiscount,
      vcc,
      payoutons,
      cvpercentage,
      branchpayoutper,
      companypayoutper,
    } = req.body;
    // Create a new VehicleSlab instance
    const newVehicleSlab = new VehicleSlab({
      advisorId,
      company,
      branch,
      advisorName,
      sitcapacity,
      states,
      districts,
      advisorUniqueId,
      vehicleSlab,
      cnames,
      catnames,
      segments,
      policytypes,
      pcodes,
      vage,
      vfuels,
      vncb,
      voddiscount,
      vcc,
      payoutons,
      cvpercentage,
      branchpayoutper,
      companypayoutper,
    });
    // Save the new VehicleSlab document to the database
    await newVehicleSlab.save();
    // Respond with success message
    return res
      .status(201)
      .json({ message: "CV-VehicleSlab saved Successfully...!" });
  } catch (error) {
    // Handle errors
    console.error("Error saving CV-VehicleSlab:", error);
    return res
      .status(500)
      .json({ error: "Failed to save CV-VehicleSlab" + error });
  }
};


export const addCompGrid = async (req, res) => {
  try {
    const {
      advisorId,
      company,
      branch,
      sitcapacity,
      advisorName,
      advisorUniqueId,
      states,
      districts,
      vehicleSlab,
      cnames,
      segments,
      policytypes,
      pcodes,
      catnames,
      vage,
      vfuels,
      vncb,
      voddiscount,
      vcc,
      payoutons,
      cvpercentage,
      branchpayoutper,
      companypayoutper,
    } = req.body;
    // Create a new CompanyGrid instance
    const newVehicleSlab1 = new CompanyGrid({
      advisorId,
      company,
      branch,
      advisorName,
      sitcapacity,
      states,
      districts,
      advisorUniqueId,
      vehicleSlab,
      cnames,
      catnames,
      segments,
      policytypes,
      pcodes,
      vage,
      vfuels,
      vncb,
      voddiscount,
      vcc,
      payoutons,
      cvpercentage,
      branchpayoutper,
      companypayoutper,
    });
    // Save the new VehicleSlab document to the database
    await newVehicleSlab1.save();
    // Respond with success message
    return res
      .status(201)
      .json({ message: "Company Grid saved Successfully...!" });
  } catch (error) {
    // Handle errors
    console.error("Error saving Company Grid", error);
    return res
      .status(500)
      .json({ error: "Failed to save Company Grid" + error });
  }
};


export const viewAllCompanyGrid = async (req, res) => {
  try {
    // Fetch all VehicleSlab documents from the database
    const CompanyGrids = await CompanyGrid.find();
    // Respond with the retrieved documents
    return res.status(200).json(CompanyGrids);
  } catch (error) {
    // Handle errors
    console.error("Error fetching Company Grid", error);
    return res.status(500).json({ error: "Failed to fetch Company Grid" });
  }
};



// VIEW  ALL DATA OF VEHICLE SLAB
export const viewAllCVehicleSlab = async (req, res) => {
  try {
    // Fetch all VehicleSlab documents from the database
    const vehicleSlabs = await VehicleSlab.find();
    // Respond with the retrieved documents
    return res.status(200).json(vehicleSlabs);
  } catch (error) {
    // Handle errors
    console.error("Error fetching Payout Slab:", error);
    return res.status(500).json({ error: "Failed to fetch Payout Slab" });
  }
};

export const viewBranchwiseSlab = async (req, res) => {
  const { branch } = req.query; // Extracting the branch value from req.query

  // Check if branch is provided
  if (!branch) {
    return res.status(400).json({ error: "Branch parameter is required" });
  }

  try {
    // Fetch all VehicleSlab documents from the database that match the branch
    const vehicleSlabs = await CompanyGrid.find({ branch: { $regex: new RegExp(branch, "i") } });

    // Respond with the retrieved documents
    return res.status(200).json(vehicleSlabs);
  } catch (error) {
    // Handle errors
    console.error("Error fetching Payout Slab:", error);
    return res.status(500).json({ error: "Failed to fetch Payout Slab" });
  }
};



export const updateCompGrid = async (req, res) => {
  try {
    const cId = req.params.id;
    const updateDetails = req.body;
    // Check if the insurace lists exists before attempting to update
    const existingDetails = await CompanyGrid.findById(cId);

    if (!existingDetails) {
      return res.status(404).json({
        status: " Company Grid Details not found",
        message: "The specified Payout ID does not exists in the database",
      });
    }

    // Perform the update
    const updatedDetails = await CompanyGrid.findByIdAndUpdate(
      cId,
      updateDetails,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      status: "Slab Updated Successfully..! ",
      message: {
        updatedDetails,
      },
    });
  } catch (err) {
    console.error(err);

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


// UPDATE A VEHICLE SLAB RECORD
export const updateCVehicleSlab = async (req, res) => {
  try {
    const vId = req.params.id;
    const updateDetails = req.body;
    // Check if the insurace lists exists before attempting to update
    const existingDetails = await VehicleSlab.findById(vId);

    if (!existingDetails) {
      return res.status(404).json({
        status: "Payout Slab Details not found",
        message: "The specified Payout ID does not exists in the database",
      });
    }

    // Perform the update
    const updatedDetails = await VehicleSlab.findByIdAndUpdate(
      vId,
      updateDetails,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      status: "Slab Updated Successfully..! ",
      message: {
        updatedDetails,
      },
    });
  } catch (err) {
    console.error(err);

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


export const deleteCompGrid = async (req, res) => {
  try {
    const comId = req.params.id;

    const deletedCom = await CompanyGrid.findByIdAndDelete(comId);
    if (!deletedCom) {
      return res.status(404).json({ message: "Company Grid not found...." });
    }
    return res.json({
      message: "Company Grid deleted successfully...!",
      deletedCom,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const delVehicleSlab = async (req, res) => {
  try {
    const vehId = req.params.id;

    const deletedVeh = await VehicleSlab.findByIdAndDelete(vehId);
    if (!deletedVeh) {
      return res.status(404).json({ message: "Slab not found...." });
    }
    return res.json({
      message: "Slab deleted successfully...!",
      deletedVeh,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};









// PRIVATE CAR
export const TWvehicleSlab = async (req, res) => {
  try {
    const {
      advisorId,
      advisorName,
      sitcapacity,
      advisorUniqueId,
      vehicleSlab,
      states,
      districts,
      cnames,
      catnames,
      segments,
      policytypes,
      pcodes,
      vage,
      payoutons,
      cvpercentage,
      vfuels,
      vncb,
      voddiscount,
      vcc,
      branchpayoutper,
      companypayoutper,
    } = req.body;
    // Create a new VehicleSlab instance
    const newVehicleSlab = new VehicleSlab({
      advisorId,
      advisorName,
      sitcapacity,
      states,
      districts,
      advisorUniqueId,
      vehicleSlab,
      cnames,
      catnames,
      segments,
      policytypes,
      pcodes,
      vage,
      payoutons,
      cvpercentage,
      vfuels,
      vncb,
      voddiscount,
      vcc,
      branchpayoutper,
      companypayoutper,
    });
    // Save the new VehicleSlab document to the database
    await newVehicleSlab.save();
    // Respond with success message
    return res
      .status(201)
      .json({ message: "TW Commission saved Successfully...!" });
  } catch (error) {
    // Handle errors
    console.error("Error saving TW Slab:", error);
    return res.status(500).json({ error: "Failed to save TW Slab" + error });
  }
};


// export const delTwSlab = async (req, res) => {
//   try {
//     const vehId = req.params.id;

//     const deletedVeh = await VehicleSlab.findByIdAndDelete(vehId);
//     if (!deletedVeh) {
//       return res.status(404).json({ message: "Slab not found...." });
//     }
//     return res.json({
//       message: "Slab deleted successfully...!",
//       deletedVeh,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };