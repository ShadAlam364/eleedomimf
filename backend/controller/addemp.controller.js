import AddEmployee from "../models/addempSchema.js";
// import { Leave } from "../models/addempSchema.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Mailgen from 'mailgen';
import bcrypt from "bcryptjs";
dotenv.config();
const { SECRET, EMAIL, PASSWORD, LINK3 } = process.env;

export const addempRegister = async (req, res) => {
  try {
    const {
      empid,
      flags,
      empname,
      empemail,
      leavebalance,
      defaultLeaveBalances,
      empmobile,
      empgender,
      empdob,
      empjoiningdate,
      empbranch,
      permanentempaddress,
      currentempaddress,
      empaadharno,
      accNumber,
      ifsc,
      bankName,
      staffType,  
      pan,
      emppassword,
      empdesignation,
    } = req.body;

     // Check if a file is provided in the request
     const empaadharfile = req.files && req.files["empaadharfile"] && req.files["empaadharfile"][0]
     ? "https://eleedomimf.onrender.com/uploads/" + req.files["empaadharfile"][0].filename
     : null;
    //  const panno = req.files && req.files["panno"] && req.files["panno"][0]
    //  ? "https://eleedomimf.onrender.com/uploads/" + req.files["panno"][0].filename
    //  : null;

       // Generate a password
    const empExist = await AddEmployee.findOne({ empid });
    // Check if empExist is not null
    if (empExist) {
      return res.status(400).json({
        status: "Employee Already Exists",
        message: "Employee with the given empid already exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(emppassword, salt);
    
    // Create a new employee instance
    const addnewEmployee = new AddEmployee({
      empid,
      uniqueid: empid,
      flags,
      empname,
      empemail,
      empmobile,
      emppassword: hashedPassword,
      confirmemp_password: hashedPassword,
      empgender,
      empdob,
      empjoiningdate,
      empbranch,
      permanentempaddress,
      currentempaddress,
      empaadharno,
      staffType,
      accNumber,
      ifsc,
      bankName,
      pan,
      leavebalance: leavebalance || defaultLeaveBalances,
      empdesignation,
      empaadharfile,
    });
    // Save the employee to the database
    await addnewEmployee.save();

// Send email to the newly registered user
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL, // Your email id
    pass: PASSWORD, // Your email password
  },
});

// Mailgen setup
const mailGenerator = new Mailgen({
theme: "cerberus",
product: {
  name: "Eleedom IMF Pvt Ltd",
  link: "https://mailgen.js/",
  // Adjust the following line accordingly
  // This will be displayed in the footer of the email
  copyright: `Copyright © ${new Date().getFullYear()} Eleedom IMF Pvt Ltd. All rights reserved.`,
},
});

// Prepare email content
const response = {
body: {
  name: empname,
  intro: [
      "Welcome to My Company!.",
      "Your account has been successfully created with the following credentials:",
  ],
  
  action: [{
      button: {
          color: "#209320",
          text: `Email:   ${empemail}`,
      }, 
  },
  {
    button: {
      color: "#209320",
      text: `Password:   ${emppassword}`, 
  },
  }
],
  
  outro: "You can now log in to your account and start using our services.",
},
};

// Generate email
const mail = mailGenerator.generate(response);

const mailOptions = {
  from: `Eleedom IMF Pvt Ltd (${staffType}) your_email@gmail.com`, // Sender address
  to: empemail, // Receiver's email address
  subject: "Welcome to Our Eleedom IMF Pvt Ltd!", // Email subject
  html: mail
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log(error);
    return res.status(500).json({
      status: "Email not sent",
      message: "Error sending welcome email",
    }, error);
  }
  return res.status(200).json("Email sent successfully...!" + info.response);
});

    return res.status(201).json({
      status: "Employee Added Successfully",
      message: {
        addnewEmployee,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: err,
      message: err.message,
    });
  }
};

//######################## login employee ###########################//
export const loginEmployee = async (req, res) => {
  try {
    const { empemail, empmobile, emppassword } = req.body;
    let user;
    if (empemail) {
      user = await AddEmployee.findOne({ empemail });
    } else if (empmobile) {
      user = await AddEmployee.findOne({ empmobile });
    }

    if (!user) {
      return res.status(401).json({
        message: "Employee Not Found",
      });
    }
      // Check if user.flags is true
      if (!user.flags) {
        return res.status(401).json({
          message: "Access denied. Please contact your administrator/hr.",
        });
      }

    const isValidPassword = await bcrypt.compare(emppassword, user.emppassword);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Password is Incorrect" });
    }

    // User authentication successful; create a JWT token
    const token = jwt.sign(
      {
        userId: user._id,

      },
      SECRET,
      {
        expiresIn: "24h",
      }
    );

    return res.status(200).json({
      message: "Login Successfully!",
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
}

// #################view nly employee ##############//
export const empListed = async (req, res) => {
  try {
    const employeeList = await AddEmployee.find( { flags: true }, {
      _id: 1,
      empid: 1,
      uniqueid: 1,
      empname: 1,
      empgender: 1,
      empemail: 1,
      empmobile: 1,
      empjoiningdate: 1,
      empbranch: 1,
      permanentempaddress: 1,
      currentempaddress: 1,
      empaadharno: 1,
      accNumber: 1,
      bankName: 1,
      pan: 1,
      empdesignation: 1,
      createdAt: 1,
      updatedAt: 1,
      ifsc: 1,
      staffType: 1,
      leavemonth: 1,
      salary: 1,
      incmoney: 1,
      incdate: 1,
      currDate: 1,
      terminatedate: 1
    });
    
    if (!employeeList || employeeList.length === 0) {
      return res.status(400).json({
        status: "Error during Salary Update",
        message: "Invalid employee selected",
      });
    }
    employeeList.sort((a, b) => {
      const empidA = parseInt(a.empid.split('-')[1]);
      const empidB = parseInt(b.empid.split('-')[1]);
      return empidA - empidB;
    });
    return res.status(200).json(employeeList);
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      message: "Internal Server Error",
      error: error.message
    });
  }
};


//################### views all employees #####################/

export const viewEmployee = async (req, res) => {
  try {
    const result = await AddEmployee.aggregate([
      {
        $lookup: {
          from: "empattendances",
          localField: "_id",
          foreignField: "employee_id",
          as: "employeeDetails"
        }
      },
    ]);
    res.json(result);
  } catch (error) {
    console.error("Error fetching employee attendance list:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//####### list of employee name based on staff type #######/
export const listOfEmp = async (req, res) => {
  try {
    // Aggregate to filter employees by flags and group them by staffType, pushing empname into an array
    const aggregatedResult = await AddEmployee.aggregate([
      {
        $match: {
          flags: true
        }
      },
      {
        $group: {
          _id: "$staffType",
          empnames: { $push: { _id: "$_id", empname: "$empname" } }
        }
      }
    ]);

    if (!aggregatedResult || aggregatedResult.length === 0) {
      return res.status(404).json({
        status: "Error",
        message: "No data found"
      });
    }
    return res.status(200).json(aggregatedResult);
  } catch (error) {
    console.error("Error during aggregation:", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal server error"
    });
  }
};


//################ update code ########################/
export const updateEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const employeeData = req.body;

    // Check if the empoyee exists before attempting to update
    const existingEmployee = await AddEmployee.findById(employeeId);

    if (!existingEmployee) {
      return res.status(404).json({
        status: "Employee not found",
        message: "The specified Employee ID does not exist in the database",
      });
    }

    // Perform the update
    const updatedEmployee = await AddEmployee.findByIdAndUpdate(
      employeeId,
      employeeData,
      {
        new: true,
        runValidators: true, // Optional: Run Mongoose validation
      }
    );

    return res.status(200).json({
      status: "Employee Updated Successfully!",
      message: {
        updatedEmployee,
      },
    });
  } catch (err) {
    console.error("Error during Employee Update:", err);

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

export const viewByIdEmp = async (req, res) => {
  const empId = req.params.empId; // Correct the parameter name to match the route
  try {
    const empData = await AddEmployee.findById(empId); // Use findById without object syntax
    if (!empData) {
      return res.status(404).json({
        status: "Error",
        message: "Employee not found",
      });
    } else {
      return res.status(200).json(empData);
    }
  } catch (error) {
    console.error("Error fetching employee data:", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
};

// .................................Forgot Page Logic......................................//
export const forgotEmpPassword = async (req, res) => {
  try {
    const { empemail } = req.body;
    const user = await AddEmployee.findOne({ empemail });
    if (!user) {
      return res.status(400).json("Email not found. Register Now!");
    }

    // Generate a random token
    const secret = user._id + SECRET;
    const token = jwt.sign({ userId: user._id }, secret, {
      expiresIn: "15m",
    });

    // Generate reset password link
    const link = `${LINK3}/${user._id}/${token}`;
   
    // Nodemailer setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL, // Your email id
        pass: PASSWORD, // Your email password
      },
    });

    // Mailgen setup
    const mailGenerator = new Mailgen({
      theme: "cerberus",
      product: {
        name: "Eleedom IMF Pvt Ltd",
        link: "https://mailgen.js/",
        // Adjust the following line accordingly
        // This will be displayed in the footer of the email
        copyright: `Copyright © ${new Date().getFullYear()} Eleedom IMF Pvt Ltd. All rights reserved.`,
      },
    });

    // Prepare email content
    const response = {
      body: {
        name: user.empname,
        intro: [
          "You have received this email because a password reset request for your account was received.",
          "Valid for 15 Minutes only!",
        ],
        action: {
          instructions: "Click the button below to reset your password:",
          // instructions: link,
          button: {
            color: "#A31217",
            text: "Reset your password",
            link: link,
          },
        },

        outro:
          "If you did not request a password reset, no further action is required on your part.",
      },
    };

    // Generate email
    const mail = mailGenerator.generate(response);

    // Send email
    transporter.sendMail(
      {
        from: '"Eleedom IMF Pvt Ltd" <example@gmail.com>', // Sender address
        to: user.empemail, // Receiver's email address
        subject: "Password Reset Request", // Email subject
        html: mail, // Email content
      },
      (error, info) => {
        if (error) {
          return res
            .status(500)
            .json("Email not sent. Register Yourself!", error);
        }
        return res
          .status(200)
          .json("Email sent successfully...!" + info.response);
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json("An error occurred..!", error);
  }
};

// update forgetted [password]
// .......................................Update Password..................................//
export const empPasswordReset = async (req, res) => {
  const { emppassword, confirmemp_password } = req.body;
  const { id, token } = req.params; // Access id from params
  const user = await AddEmployee.findById(id);
  const new_secret = user._id + SECRET;

  try {
    jwt.verify(token, new_secret);

    if (emppassword && confirmemp_password) {
      if (emppassword !== confirmemp_password) {
        return res.status(400).json("Passwords doesn't Match. Try Again..!");
      } 
      
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(emppassword, salt);
        const hashedPassword1 = await bcrypt.hash(confirmemp_password, salt);
        await AddEmployee.findByIdAndUpdate(user._id, {
          $set: {
            emppassword: hashedPassword,
            confirmemp_password: hashedPassword1,
          },
        });

        // Send email to user with the updated password
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: EMAIL,
            pass: PASSWORD,
          },
        });

        // Mailgen setup
const mailGenerator = new Mailgen({
    theme: "cerberus",
    product: {
        name: "Eleedom IMF Pvt Ltd",
        link: "https://mailgen.js/",
        // Adjust the following line accordingly
        // This will be displayed in the footer of the email
        copyright: `Copyright ©${new Date().getFullYear()} Eleedom IMF Pvt Ltd. All rights reserved.`,
    },
  });
// Prepare email content
const response = {
    body: {
        name: `, ${user.empname}`,
        intro: [
            "You have received this email because a password reset request.",
            "Your password has been successfully reset. Your new password is:",
        ],
        action: {
            button: {
                color: "#A31217",
                text: `${emppassword}`,  
            },
        },
    //   utro: "If you did not request a password reset, no further action is required on your part.",
    },
  };
  
  // Generate email
  const mail = mailGenerator.generate(response);
        const mailOptions = {
          from: "Eleedom IMF Pvt Ltd <your_email@gmail.com>",
          to: user.empemail,
          subject: "Your Password has been Reset",
          html: mail
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res
              .status(500)
              .json("Error occurred while sending email..!" + error);
          } else {
            return res.status(200).json("Email sent" + info.response);
          }
        });
        return res.status(200).json("Password Updated Successfully..!");
      
    }
  } catch (error) {
    return res.status(500).json("Invalid Link or Expired..!" + error);
  }
};


//  delete employee controller
export const deleteEmployee = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedEmployee = await AddEmployee.findByIdAndDelete(userId);
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    return res.json({ message: "User deleted successfully", deletedEmployee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const updateLeaveStatus = async (req, res) => {
  try {
    const { empid, id } = req.params;
    const { status, remarks } = req.body;

    // Find the employee by ID
    const employee = await AddEmployee.findById(empid);

    // Check if employee exists
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Find the leave detail with the given ID within the employee's leaveDetails array
    const leaveDetail = employee.leaveDetails.find(detail => detail._id.toString() === id);

    // Check if leave detail exists
    if (!leaveDetail) {
      return res.status(404).json({ error: 'Leave detail not found' });
    }

    // Update the status and remarks of the leave detail
    leaveDetail.status = status;
    leaveDetail.remarks = remarks;

    // Update the leave balance if the leave is approved
    if (status === 'approved') {
      const leaveBalance = employee.leavebalance.find(balance => balance.restLeave === leaveDetail.leavetype);
      if (leaveBalance) {
        leaveBalance.num -= leaveDetail.counts;
      }
    }

    // Save the updated employee document
    await employee.save();

    // Respond with success or failure message based on status
    let message = '';
    if (status === 'approved') {
      message = 'Leave Granted Successfully...!';
    } else if (status === 'rejected') {
      message = 'Leave Cancelled Successfully...!';
    }

    return res.json({ message, empname: employee.empname, leaveDetail });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

