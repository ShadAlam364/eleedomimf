import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Mailgen from "mailgen";
import FinanceLogin from "../../models/finance/financeSchema.js";
import jwt from "jsonwebtoken";
dotenv.config();
const {SECRET, EMAIL, PASSWORD, LINK5} = process.env;

// ####################################### Register finance ###########################################//
export const financeRegister = async (req, res) => {
  try {
    const { finname, finemail, finmobile, finpassword, fingender, isFinance } = req.body;
    // Check if user already exists in the database
    const emailExist = await FinanceLogin.findOne({ finemail });
    if (emailExist) {
      return res.status(400).json({
        status: "User Already Exists",
        message: "User with this email already exists.",
      });
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(finpassword, salt);
    // Create a new user
    const newUser = new FinanceLogin({
      finname,
      finemail,
      finmobile,
      fingender,
      isFinance,
      finpassword: hashedPassword,
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
        name: finname,
        intro: [
            "Welcome to My Company!.",
            "Your account has been successfully created with the following credentials:",
          
        ],
        
        action: [{
            button: {
                color: "#209320",
                text: `Email:   ${finemail}`,
            },   
        },
        {
          button: {
            color: "#209320",
            text: `Password:   ${finpassword}`, 
        },
        }
      ],  
        outro: "You can now log in to your account and start using our services.",
    },
  };
  
  // Generate email
  const mail = mailGenerator.generate(response);
      const mailOptions = {
        from: `"Eleedom IMF Pvt Ltd (Finance)" your_email@gmail.com`, // Sender address
        to: finemail, // Receiver's email address
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
      status: "Finance Admin Registered Successfully",
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


//######################## login finance ###########################//
export const loginFinance = async (req, res) => {
  try {
    const { finemail, finmobile, finpassword } = req.body;

    let user;
    if (finemail) user = await FinanceLogin.findOne({ finemail });
    else if (finmobile) user = await FinanceLogin.findOne({ finmobile });

    if (!user) {
      return res.status(401).json({
        message: "Finance User Not Found",
      });
    }
    // password check
    const isValidPassword = await bcrypt.compare(finpassword, user.finpassword);
    if (!isValidPassword) {
      return res.status(400).json({message: "Password is Incorrect"});
    }else{
   
    // User authentication successful; create a JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        isFinance: user.isFinance
      },
     SECRET,
      {
        expiresIn: "24h",
      }
    );
 
   return res.status(200).json({
        message: "Login Successful",
        email: user.finemail,
        mobile: user.finmobile,
        name: user.finname,
        token,
      });
    }}
   catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
}

// forgot password through email

export const forgotFinancePassword = async (req, res) => {
  try {
    const { finemail } = req.body;
    const user = await FinanceLogin.findOne({ finemail });
    if (!user) {
      return res.status(400).json("Email not found. Register Now!");
    }

    // Generate a random token
    const secret = user._id + SECRET;
    const token = jwt.sign({ userId: user._id }, secret, {
      expiresIn: "15m",
    });

    // Generate reset password link
    const link = `${LINK5}/${user._id}/${token}`;
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
        name: user.finname,
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
        from: '"Eleedom IMF Pvt Ltd (Finance)" <example@gmail.com>', // Sender address
        to: finemail, // Receiver's email address
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

// .......................................Update Password..................................//
export const financePasswordReset = async (req, res) => {
  const { finpassword, finconfirm_password } = req.body;
  const { id, token } = req.params; // Access id from params
  const user = await FinanceLogin.findById(id);
  const new_secret = user._id + SECRET;

  try {
    jwt.verify(token, new_secret);

    if (finpassword && finconfirm_password) {
      if (finpassword !== finconfirm_password) {
        return res.status(400).json("Passwords doesn't Match. Try Again..!");
      } 
      
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(finpassword, salt);
        const hashedPassword1 = await bcrypt.hash(finconfirm_password, salt);
        await OpsAdmin.findByIdAndUpdate(user._id, {
          $set: {
            finpassword: hashedPassword,
            finconfirm_password: hashedPassword1,
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
        name: `, ${user.finname}`,
        intro: [
            "You have received this email because a password reset request.",
            "Your password has been successfully reset. Your new password is:",
        ],
        action: {
            button: {
                color: "#A31217",
                text: `${finpassword}`,  
            },
        },
    //   utro: "If you did not request a password reset, no further action is required on your part.",
    },
  };
  
  // Generate email
  const mail = mailGenerator.generate(response);
        const mailOptions = {
          from: "Eleedom IMF Pvt Ltd <your_email@gmail.com>",
          to: user.finemail,
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
