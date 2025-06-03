import OpsAdmin from "../../models/ops/opsadmin.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import Mailgen from 'mailgen';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();
const { SECRET, LINK2, EMAIL, PASSWORD } = process.env;
// register ops
export const addOpsRegister = async (req, res) => {
  try {
    const {
      opsid,
      opsname,
      opsemail,
      opsmobile,
      opsgender,
      opsdate,
      opsjoiningdate,
      permanentopsaddress,
      currentopsaddress,
      opspassword,
      isOps
    } = req.body;

    const OpsExist = await OpsAdmin.findOne({ opsemail });
    if (OpsExist) {
      return res.status(400).json({
        status: "ops Already Exists",
        message: "ops with the given opsid already exists.",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(opspassword, salt);
    
    // Create a new ops instance
    const newOps = new OpsAdmin({
        opsid,
        opsname,
        opsemail,
        opsmobile,
        opsgender,
        opspassword: hashedPassword,
        opsdate,
        opsjoiningdate,
        permanentopsaddress,
        currentopsaddress,
        isOps
    });
    // Save the hr to the database
    await newOps.save();

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
  name: opsname,
  intro: [
      "Welcome to My Company!.",
      "Your account has been successfully created with the following credentials:",
  ],
  
  action: [{
      button: {
          color: "#209320",
          text: `Email:   ${opsemail}`,
      }, 
  },
  {
    button: {
      color: "#209320",
      text: `Password:   ${opspassword}`, 
  },
  }
],
  
  outro: "You can now log in to your account and start using our services.",
},
};

// Generate email
const mail = mailGenerator.generate(response);

const mailOptions = {
  from: `"Eleedom IMF Pvt Ltd (OPS Admin)" your_email@gmail.com`, // Sender address
  to: opsemail, // Receiver's email address
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
      status: "Ops Admin Added Successfully",
      message: {
        newOps,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "Error during Registration",
      message: err.message,
    } + err);
  }
};

//######################## login ops ###########################//
export const loginOps = async (req, res) => {
  try {
    const { opsemail, opsmobile, opspassword } = req.body;
    let user;

    if (opsemail) {
      user = await OpsAdmin.findOne({ opsemail });
    } else if (opsmobile) {
      user = await OpsAdmin.findOne({ opsmobile });
    }

    if (!user) {
      return res.status(401).json({
        message: "OPS Admin Not Found",
      });
    }

    const isValidPassword = await bcrypt.compare(opspassword, user.opspassword);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Password is Incorrect" });
    }

    // User authentication successful; create a JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        opsemail: user.opsemail,
        isOps: user.isOps
      },
      SECRET,
      {
        expiresIn: "24h",
      }
    );

    return res.status(200).json({
      message: "Login Successfully!",
      token,
      user
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};



// .................................Forgot Page Logic......................................//
export const forgotOpsPassword = async (req, res) => {
  try {
    const { opsemail } = req.body;
    const user = await OpsAdmin.findOne({ opsemail });
    if (!user) {
      return res.status(400).json("Email not found. Register Now!");
    }

    // Generate a random token
    const secret = user._id + SECRET;
    const token = jwt.sign({ userId: user._id }, secret, {
      expiresIn: "15m",
    });

    // Generate reset password link
    const link = `${LINK2}/${user._id}/${token}`;
   
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
        name: user.opsname,
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
        to: user.opsemail, // Receiver's email address
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
export const opsPasswordReset = async (req, res) => {
  const { opspassword, confirm_opspassword } = req.body;
  const { id, token } = req.params; // Access id from params
  const user = await OpsAdmin.findById(id);
  const new_secret = user._id + SECRET;

  try {
    jwt.verify(token, new_secret);

    if (opspassword && confirm_opspassword) {
      if (opspassword !== confirm_opspassword) {
        return res.status(400).json("Passwords doesn't Match. Try Again..!");
      } 
      
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(opspassword, salt);
        const hashedPassword1 = await bcrypt.hash(confirm_opspassword, salt);
        await OpsAdmin.findByIdAndUpdate(user._id, {
          $set: {
            opspassword: hashedPassword,
            confirm_opspassword: hashedPassword1,
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
        name: `, ${user.opsname}`,
        intro: [
            "You have received this email because a password reset request.",
            "Your password has been successfully reset. Your new password is:",
        ],
        action: {
            button: {
                color: "#A31217",
                text: `${opspassword}`,  
            },
        },
    //   utro: "If you did not request a password reset, no further action is required on your part.",
    },
  };
  
  // Generate email
  const mail = mailGenerator.generate(response);
        const mailOptions = {
          from: "Eleedom IMF Pvt Ltd <your_email@gmail.com>",
          to: user.opsemail,
          subject: "Your Password has been Reset",
          html: mail
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res
              .status(500)
              .json("Error occurred while sending email..!", error);
          } else {
            return res.status(200).json("Email sent", info.response);
          }
        });
        return res.status(200).json("Password Updated Successfully..!");
      
    }
  } catch (error) {
    return res.status(500).json("Invalid Link or Expired..!" + error);
  }
};
