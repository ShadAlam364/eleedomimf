import AddBranch from '../models/addbranchSchema.js'; // Replace with the actual path to your AdminLogin model
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import Mailgen from 'mailgen';
import dotenv from "dotenv";
// Function to generate unique ID for branches
dotenv.config();
const { EMAIL, PASSWORD } = process.env;

export const addbranchRegister = async (req, res) => {
  try {
    const {
      concernperson,
      branchname,
      branchcode,
      branchemail,
      branchmobile,
      branchphone,
      branchaddress,
      branchdistrict,
      branchstate,
      branchpincode,
      password
    } = req.body;

    // Check if the branch with the given branchcode already exists
    const branchExist = await AddBranch.findOne({ branchemail });
    if (branchExist) {
      return res.status(400).json({
        status: "Branch Already Exists",
        message: "This branch already exists.",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new branch
    const addnewBranch = new AddBranch({
      // branchid,
      concernperson,
      branchname,
      branchcode,
      branchemail,
      branchmobile,
      branchphone,
      branchaddress,
      branchdistrict,
      branchstate,
      branchpincode,
      password: hashedPassword
    });

    // Save the new branch to the database
    await addnewBranch.save();

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
      name: branchname,
      intro: [
          "Welcome to My Company!.",
          "Your account has been successfully created with the following credentials:",
        
      ],
      
      action: [{
          button: {
              color: "#209320",
              text: `Email:   ${branchemail}`,
          },
         
      },
      {
        button: {
          color: "#209320",
          text: `Password:   ${password}`, 
      },
      }
    ],
      
      outro: "You can now log in to your account and start using our services.",
  },
};

// Generate email
const mail = mailGenerator.generate(response);




    const mailOptions = {
      from: `"Eleedom IMF Pvt Ltd (Branch)" your_email@gmail.com`, // Sender address
      to: branchemail, // Receiver's email address
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
      status: "Branch added Successfully!",
      message: {
        addnewBranch,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "Error during registration",
      message: err.message,
    });
  }
};
//################### views all branchs #####################/
export const viewBranch= async (req, res) => {
    const branchList = await AddBranch.find({});
    if (!branchList) {
     return res.status(400).json({
       status: "Error during branch lists Update",
       message: "Invalid branch selected",
     });
   }else{
     return res.status(200).json(branchList);
   }
 }

// update code 
export const updateBranch = async (req, res) => {
  try {
    const branchId = req.params.id;
    const branchData = req.body;

    // Check if the contact exists before attempting to update
    const existingBranch = await AddBranch.findById(branchId);

    if (!existingBranch) {
      return res.status(404).json({
        status: "Branch not found",
        message: "The specified Branch ID does not exist in the database",
      });
    }

    // Perform the update
    const updatedBranch = await AddBranch.findByIdAndUpdate(
      branchId,
      branchData,
      {
        new: true,
        runValidators: true, // Optional: Run Mongoose validation
      }
    );

    return res.status(200).json({
      status: "Branch Updated Successfully!",
      message: {
        updatedBranch,
      },
    });
  } catch (err) {
    console.error("Error during Contact Update:", err);

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


//  delete branch controller
export const deleteBranch = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const deletedUser = await AddBranch.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "Branch not found" });
    }
    return res.json({ message: "Branch deleted successfully", deletedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};