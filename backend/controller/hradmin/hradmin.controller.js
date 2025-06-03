import nodemailer from "nodemailer";

import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Mailgen from "mailgen";
import HrAdmin from "../../models/hradmin/hradmin.js";
import jwt from "jsonwebtoken";
dotenv.config();
const { SECRET, EMAIL, PASSWORD, LINK4 } = process.env;

// ####################################### Register HR Admin ###########################################//
export const HrAdRegister = async (req, res) => {
  try {
    const {
      hradname,
      hradpassword,
      hraddob,
      hradgender,
      hrademail,
      hradmobile,
      hradjoiningdate,
      permanenthradaddress,
      currenthradaddress,
      hradaadharno,
      hradaccNumber,
      hradbankName,
      hradifsc,
      hradpan,
      hradpanno,
      hradaadharfile,
      isHr
    } = req.body;

    // const serialNumber = generateSerialNumber();

    // Check if the user with the given email already exists
    const emailExist = await HrAdmin.findOne({ hrademail });
    if (emailExist) {
      return res.status(400).json({
        status: "User Already Exists",
        message: "User with this email already exists.",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(hradpassword, salt);

    // Create a new user
    const newUser = new HrAdmin({
        hradname,
        hradpassword: hashedPassword,
        confirmehrad_password: hashedPassword,
        hraddob,
        hradgender,
        hrademail,
        hradmobile,
        hradjoiningdate,
        permanenthradaddress,
        currenthradaddress,
        hradaadharno,
        hradaccNumber,
        hradbankName,
        hradifsc,
        hradpan,
        hradpanno,
        hradaadharfile,
        isHr
    });

    // Save the new user to the database
    await newUser.save();
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
        name: hradname,
        intro: [
            "Welcome to My Company!.",
            "Your account has been successfully created with the following credentials:",
          
        ],
        
        action: [{
            button: {
                color: "#209320",
                text: `Email:   ${hrademail}`,
            },
           
        },
        {
          button: {
            color: "#209320",
            text: `Password:   ${hradpassword}`, 
        },
        }
      ],
        
        outro: "You can now log in to your account and start using our services.",
    },
  };
  
  // Generate email
  const mail = mailGenerator.generate(response);
      const mailOptions = {
        from: `"Eleedom IMF Pvt Ltd (HR Admin)" your_email@gmail.com`, // Sender address
        to: hrademail, // Receiver's email address
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
      status: "HR Admin Registered Successfully",
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
export const hrAdminLogin = async (req, res) => {
  try {
    const { hrademail, hradmobile, hradpassword } = req.body;

    let user;
    if (hrademail) user = await HrAdmin.findOne({ hrademail });
    else if (hradmobile) user = await HrAdmin.findOne({ hradmobile });

    if (!user) {
      return res.status(401).json({
        message: "User Not Found",
      });
    }
    // password check
    const isValidPassword = await bcrypt.compare(hradpassword, user.hradpassword);
    if (!isValidPassword) {
      return res.status(400).json("Password is Incorrect");
    } else {
      // User authentication successful; create a JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          isHr: user.isHr
        },
        SECRET,
        {
          expiresIn: "8h",
        }
      );

      return res.status(200).json({
        message: "Login Successful",
        email: user.hrademail,
        mobile: user.hradmobile,
        name: user.hradname,
        id: user._id,
        token,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

export const lists2= async (req, res) => {
  const { listsName } = req.params;
  const db = await connectToDatabase();
  try {
      const result = await db.collection(listsName).drop();
      if (result) {
          res.status(200).send(`NCB view Successfully....!`);
      } else {
          res.status(404).send(`NCB not view yet....!`);
      }
  } catch (error) {
      res.status(500).send(`Error`);
  } finally {
      await client.close();
  }
}

// .................................Forgot Page Logic......................................//
export const forgotHrAdminPassword = async (req, res) => {
    try {
      const { hrademail } = req.body;
      const user = await HrAdmin.findOne({ hrademail });
      if (!user) {
        return res.status(400).json("Email not found. Register Now!");
      }
  
      // Generate a random token
      const secret = user._id + SECRET;
      const token = jwt.sign({ userId: user._id }, secret, {
        expiresIn: "15m",
      });
  
      // Generate reset password link
      const link = `${LINK4}/${user._id}/${token}`;
     
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
          name: user.hradname,
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
          from: `Eleedom IMF Pvt Ltd (${user.hradname}) <example@gmail.com>`, // Sender address
          to: user.hrademail, // Receiver's email address
          subject: "Password Reset Request", // Email subject
          html: mail, // Email content
        },
        (error, info) => {
          if (error) {
            return res
              .status(500)
              .json("Email not sent. Register Yourself!" + error);
          }
          return res
            .status(200)
            .json("Email sent successfully...!" + info.response);
        }
      );
    } catch (error) {
      console.log(error);
      return res.status(500).json("An error occurred..!" + error);
    }
  };



  // .......................................Update Password..................................//
export const HrAdPassReset = async (req, res) => {
    const { hradpassword, confirmehrad_password } = req.body;
    const { id, token } = req.params; // Access id from params
    const user = await HrAdmin.findById(id);
    const new_secret = user._id + SECRET;
  
    try {
      jwt.verify(token, new_secret);
  
      if (hradpassword && confirmehrad_password) {
        if (hradpassword !== confirmehrad_password) {
          return res.status(400).json("Passwords doesn't Match. Try Again..!");
        } 
        
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(hradpassword, salt);
          const hashedPassword1 = await bcrypt.hash(confirmehrad_password, salt);
          await HrAdmin.findByIdAndUpdate(id, {
            $set: {
                hradpassword: hashedPassword,
                confirmehrad_password: hashedPassword1,
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
          name: `, ${user.hradname}`,
          intro: [
              "You have received this email because a password reset request.",
              "Your password has been successfully reset. Your new password is:",
          ],
          action: {
              button: {
                  color: "#A31217",
                  text: `${hradpassword}`,  
              },
          },
      //   utro: "If you did not request a password reset, no further action is required on your part.",
      },
    };
    
    // Generate email
    const mail = mailGenerator.generate(response);
          const mailOptions = {
            from: "Eleedom IMF Pvt Ltd <your_email@gmail.com>",
            to: user.hrademail,
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
      return res.status(400).json("Invalid Link or Expired..!" + error);
    }
  };
  