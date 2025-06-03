import AddBranch from "../models/addbranchSchema.js";
import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();
const { SECRET, LINK1, EMAIL, PASSWORD } = process.env;

export const loginBranch = async (req, res) => {
  try {
    const { branchemail, password } = req.body;
    const user = await AddBranch.findOne({ branchemail });

    if (!user) {
      return res.status(401).json({
        message: "Branch Not Found",
      });
    }
    // Simple password check
    // password check
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json("Password is Incorrect");
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
        message: "Login Successful",
        token,
        user: {
          branchcode: user.branchcode,
          branchaddress: user.branchaddress,
          branchpincode: user.branchpincode,
          branchname: user.branchname,
          branchemail: user.branchemail,
          branchmobile: user.branchmobile,
          branchstate: user.branchstate,
          concernperson: user.concernperson,
          branchdistrict: user.branchdistrict
      }
      });
    }
   catch (err) {
    return res.status(500).json("Server Error" + err);
  }
};

// .................................Forgot Page Logic......................................//
export const forgotBranchPassword = async (req, res) => {
  try {
    const { branchemail } = req.body;
    const user = await AddBranch.findOne({ branchemail });
    if (!user) {
      return res.status(400).json("Email not found. Register Now!");
    }

    // Generate a random token
    const secret = user._id + SECRET;
    const token = jwt.sign({ userId: user._id }, secret, {
      expiresIn: "15m",
    });

    // Generate reset password link
    const link = `${LINK1}/${user._id}/${token}`;
   
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
        name: user.branchname,
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
        to: user.branchemail, // Receiver's email address
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
export const branchPasswordReset = async (req, res) => {
  const { password, confirm_password } = req.body;
  const { id, token } = req.params; // Access id from params
  const user = await AddBranch.findById(id);
  const new_secret = user._id + SECRET;

  try {
    jwt.verify(token, new_secret);

    if (password && confirm_password) {
      if (password !== confirm_password) {
        return res.status(400).json("Passwords doesn't Match. Try Again..!");
      } 
      
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const hashedPassword1 = await bcrypt.hash(confirm_password, salt);
        await AddBranch.findByIdAndUpdate(id, {
          $set: {
            password: hashedPassword,
            confirm_password: hashedPassword1,
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
        name: `, ${user.branchname}`,
        intro: [
            "You have received this email because a password reset request.",
            "Your password has been successfully reset. Your new password is:",
        ],
        action: {
            button: {
                color: "#A31217",
                text: `${password}`,  
            },
        },
    //   utro: "If you did not request a password reset, no further action is required on your part.",
    },
  };
  
  // Generate email
  const mail = mailGenerator.generate(response);
        const mailOptions = {
          from: "Eleedom IMF Pvt Ltd <your_email@gmail.com>",
          to: user.branchemail,
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
    return res.status(400).json("Invalid Link or Expired..!", error);
  }
};
