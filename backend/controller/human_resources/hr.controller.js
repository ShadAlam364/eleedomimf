import AddHr from "../../models/hr/hr.js";
import dotenv from "dotenv";

import jwt from "jsonwebtoken";
import { generateEmpId, generatePassword } from "../generateId.js";
dotenv.config();
const { SECRET } = process.env;

export const addHrRegister = async (req, res) => {
  try {
    const {
      hrid,
      hrname,
      hremail,
      hrmobile,
      hrgender,
      hrdob,
      hrjoiningdate,
      hrbranch,
      permanenthraddress,
      currenthraddress,
      hraadharno,
      hrdesignation,
      isHr
    } = req.body;

    // Check if a file is provided in the request
    const hraadharfile =
      req.files && req.files["hraadharfile"] && req.files["hraadharfile"][0]
        ? "https://eleedomimf.onrender.com/uploads/" +
          req.files["hraadharfile"][0].filename
        : null;

    // Generate a password
    const hrpasswords = generatePassword(hremail);
    //  encrypt password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(hrpasswords, salt);
    const HrExist = await AddHr.findOne({ hrid });
    if (HrExist) {
      return res.status(400).json({
        status: "HR Already Exists",
        message: "HR with the given hrid already exists.",
      });
    }
    const hruniqueid = generateEmpId();
    console.log(hruniqueid);
    
    // Create a new hr instance
    const addnewHr = new AddHr({
      hrid: hruniqueid,
      hrname,
      hremail,
      hrmobile,
      hrpassword:hrpasswords,
      hrgender,
      hrdob,
      hrjoiningdate,
      hrbranch,
      permanenthraddress,
      currenthraddress,
      hraadharno,
      hrdesignation,
      hraadharfile,
      isHr
    });
    // Save the hr to the database
    await addnewHr.save();
    return res.status(201).json({
      status: "HR Added Successfully",
      message: {
        addnewHr,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "Error during Registration",
      message: err.message,
    });
  }
};

//######################## login HR ###########################//
export const loginHr = async (req, res) => {
  try {
    const { hremail, hrmobile, hrpassword } = req.body;
    let user;
    if (hremail) {
      user = await AddHr.findOne({ hremail });
    } else if (hrmobile) {
      user = await AddHr.findOne({ hrmobile });
    }

    if (!user) {
      return res.status(401).json({
        message: "HR Not Found",
      });
    }

    // Simple password check
    // const isValidPassword = await bcrypt.compare(hrpassword, user.hrpassword);
    if (hrpassword !== user.hrpassword) {
      return res.status(400).json({
        message: "Password is Incorrect",
      });
    }

    // User authentication successful; create a JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        hremail: user.hremail,
        isHr: user.isHr
      },
      SECRET,
      {
        expiresIn: "8h",
      }
    );

    return res.status(200).json({
      message: "Login Successfully!",
      token,
      user
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

//################### views all HR #####################/
export const viewHr = async (req, res) => {
  const hrList = await AddHr.find({});
  if (!hrList) {
    return res.status(400).json({
      status: "Error during HR lists Update",
      message: "Invalid HR selected",
    });
  } else {
    return res.status(200).json(hrList);
  }
};

// update code
export const updateHr = async (req, res) => {
  try {
    const hrId = req.params.id;
    const hrData = req.body;

    // Check if the hr exists before attempting to update
    const existingHr = await AddHr.findById(hrId);

    if (!existingHr) {
      return res.status(404).json({
        status: "HR not found",
        message: "The specified HR ID does not exist in the database",
      });
    }

    // Perform the update
    const updatedHr = await AddHr.findByIdAndUpdate(hrId, hrData, {
      new: true,
      runValidators: true, // Optional: Run Mongoose validation
    });

    return res.status(200).json({
      status: "HR Updated Successfully!",
      message: {
        updatedHr,
      },
    });
  } catch (err) {
    console.error("Error during HR Update:", err);

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












//  delete hr controller
export const deleteHr = async (req, res) => {
  try {
    const hrId = req.params.id;
    const deletedHr = await AddHr.findByIdAndDelete(hrId);
    if (!deletedHr) {
      return res.status(404).json({ message: "HR not found" });
    }
    return res.json({ message: "HR deleted successfully", deletedHr });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
