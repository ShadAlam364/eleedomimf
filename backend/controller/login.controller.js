import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Mailgen from "mailgen";
import AdminLogin from "../models/loginSchema.js"
import jwt from "jsonwebtoken";
dotenv.config();
const {SECRET, EMAIL, PASSWORD, LINK} = process.env;

// ####################################### Register User ###########################################//
export const adminRegister = async (req, res) => {
  try {
    const { name, email, mobile, password, gender, isAdmin } = req.body;
    // Check if the user with the given email already exists
    const emailExist = await AdminLogin.findOne({ email });
    if (emailExist) {
      return res.status(400).json({
        status: "User Already Exists",
        message: "User with this email already exists.",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new AdminLogin({
      name,
      email,
      mobile,
      gender,
      isAdmin,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    return res.status(201).json({
      status: "User Registered Successfully",
      message: {
        newUser,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "Error during registration",
      message: err.message,
    });
  }
};


//######################## login admin ###########################//
export const loginAdmin = async (req, res) => {
  try {
    const { email, mobile, password } = req.body;

    let user;
    if (email) user = await AdminLogin.findOne({ email });
    else if (mobile) user = await AdminLogin.findOne({ mobile });

    if (!user) {
      return res.status(401).json({
        message: "User Not Found",
      });
    }
    // password check
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({message: "Password is Incorrect"});
    }else{
   
    // User authentication successful; create a JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        mobile: user.mobile,
        isAdmin: user.isAdmin
      },
     SECRET,
      {
        expiresIn: "8h",
      }
    );
 
   return res.status(200).json({
        message: "Login Successful",
        email: user.email,
        mobile: user.mobile,
        token,
      });
    }}
   catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
}


// .................................Forgot Page Logic......................................//
export const forgotAdminPassword = async (req, res) => {
  try {
    const { email } = req.body;
      const user = await AdminLogin.findOne({ email });
      if (!user) {
          return res.status(400).json("Email not found. Register Now!");
      }

      // Generate a random token
      const secret = user._id + SECRET;
      const token = jwt.sign({ userId: user._id }, secret, {
          expiresIn: "15m",
      });

      // Generate reset password link
      const link =`${LINK}/${user._id}/${token}`;

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
              name: "Admin",
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
              
          
              outro: "If you did not request a password reset, no further action is required on your part.",
          },
      };

      // Generate email
      const mail = mailGenerator.generate(response);

      // Send email
      transporter.sendMail({
          from: '"Eleedom IMF Pvt Ltd" <example@gmail.com>', // Sender address
          to: user.email, // Receiver's email address
          subject: "Password Reset Request", // Email subject
          html: mail, // Email content
      }, (error, info) => {
          if (error) {
              return res.status(500).json("Email not sent. Register Yourself!", error);
          }
          return res.status(200).json("Email sent successfully...!");
      });
  } catch (error) {
      console.log(error);
      return res.status(500).json("An error occurred..!");
  }
};

// update forgetted [password]
// .......................................Update Password..................................//
export const adminPasswordReset = async (req, res) => {
  const { password, confirm_password } = req.body;
  const { id, token } = req.params; // Access id from params
  const user = await AdminLogin.findById(id);
  const new_secret = user._id + SECRET;
  try {
    jwt.verify(token, new_secret);
    if (password && confirm_password) {
      if (password !== confirm_password) {
        return res.status(400).json("Passwords doesn't Match. Try Again..!");
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const hashedPassword1 = await bcrypt.hash(confirm_password, salt);
        await AdminLogin.findByIdAndUpdate(user._id, {
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
      name: `, ${user.email}`,
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
      
  
      // outro: "If you did not request a password reset, no further action is required on your part.",
  },
};

// Generate email
const mail = mailGenerator.generate(response);

        const mailOptions = {
          from: "Eleedom IMF Pvt Ltd <your_email@gmail.com>",
          to: user.email,
          subject: "Your Password has been Reset",
          // text: `Your password has been successfully reset. Your new password is: ${password}`,
          html: mail, // Email content
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res.status(500).json("Error occurred while sending email..!", error);
          } else {
            return res.status(200).json("Email sent", info.response);
          }
        });
        return res.status(200).json("Password Updated Successfully..!");
      }
    }
  } catch (error) {
    return res.status(400).json("Invalid Link or Expired..!" + error);
  }
};
