import cicAdmin from "../../models/cic/cic.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();
const { SECRET, LINK6, EMAIL, PASSWORD } = process.env;

// register cic
export const addCicRegister = async (req, res) => {
  try {
    const {
      cicid,
      cicname,
      cicemail,
      cicmobile,
      cicgender,
      cicdate,
      cicjoiningdate,
      permanentcicaddress,
      currentcicaddress,
      cicpassword,
      isCic
    } = req.body;

    const cicExist = await cicAdmin.findOne({ cicemail });
    if (cicExist) {
      return res.status(400).json({
        status: "CIC Already Exists",
        message: "CIC with the given cicid already exists.",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(cicpassword, salt);

    // Create a new cic instance
    const newcic = new cicAdmin({
      cicid,
      cicname,
      cicemail,
      cicmobile,
      cicgender,
      cicpassword: hashedPassword,
      cicdate,
      cicjoiningdate,
      permanentcicaddress,
      currentcicaddress,
      isCic
    });
    // Save the hr to the database
    await newcic.save();

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
        name: cicname,
        intro: [
          "Welcome to My Company as CIC Post!.",
          "Your account has been successfully created with the following credentials:",
        ],

        action: [
          {
            button: {
              color: "#209320",
              text: `Email:   ${cicemail}`,
            },
          },
          {
            button: {
              color: "#209320",
              text: `Password:   ${cicpassword}`,
            },
          },
        ],

        outro:
          "You can now log in to your account and start using our services.",
      },
    };

    // Generate email
    const mail = mailGenerator.generate(response);

    const mailOptions = {
      from: `"Eleedom IMF Pvt Ltd (CIC)" your_email@gmail.com`, // Sender address
      to: cicemail, // Receiver's email address
      subject: "Welcome to Our Eleedom IMF Pvt Ltd!", // Email subject
      html: mail,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json(
          {
            status: "Email not sent",
            message: "Error sending welcome email",
          },
          error
        );
      }
      return res
        .status(200)
        .json("Email sent successfully...!" + info.response);
    });

    return res.status(201).json({
      status: "CIC Added Successfully..!",
      message: {
        newcic,
      },
    });
  } catch (err) {
    return res.status(400).json(
      {
        status: "Error during Registration",
        message: err.message,
      } + err
    );
  }
};

//######################## login cic ###########################//
export const loginCic = async (req, res) => {
  try {
    const { cicemail, cicmobile, cicpassword } = req.body;
    let user;

    if (cicemail) {
      user = await cicAdmin.findOne({ cicemail });
    } else if (cicmobile) {
      user = await cicAdmin.findOne({ cicmobile });
    }

    if (!user) {
      return res.status(401).json({
        message: "CIC Not Found",
      });
    }

    const isValidPassword = await bcrypt.compare(cicpassword, user.cicpassword);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Password is Incorrect" });
    }

    // User authentication successful; create a JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.cicemail,
        isCic: user.isCic
      },
      SECRET,
      {
        expiresIn: "8h",
      }
    );

    return res.status(200).json({
      message: "Login Successfully!",
      token,
      user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};



// .................................Forgot Page Logic......................................//
export const forgotCicPassword = async (req, res) => {
    try {
      const { cicemail } = req.body;
      const user = await cicAdmin.findOne({ cicemail });
      if (!user) {
        return res.status(400).json("Email not found. Register Now!");
      }
  
      // Generate a random token
      const secret = user._id + SECRET;
      const token = jwt.sign({ userId: user._id }, secret, {
        expiresIn: "15m",
      });
  
      // Generate reset password link
      const link = `${LINK7}/${user._id}/${token}`;
     
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
          name: user.cicname,
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
          from: '"Eleedom IMF Pvt Ltd" (CIC) <example@gmail.com>', // Sender address
          to: user.cicemail, // Receiver's email address
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
export const cicPasswordReset = async (req, res) => {
    const { cicpassword, confirm_cicpassword } = req.body;
    const { id, token } = req.params; // Access id from params
    const user = await cicAdmin.findById(id);
    const new_secret = user._id + SECRET;
  
    try {
      jwt.verify(token, new_secret);
  
      if (cicpassword && confirm_cicpassword) {
        if (cicpassword !== confirm_cicpassword) {
          return res.status(400).json("Passwords doesn't Match. Try Again..!");
        } 
        
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(cicpassword, salt);
          const hashedPassword1 = await bcrypt.hash(confirm_cicpassword, salt);
          await cicAdmin.findByIdAndUpdate(user._id, {
            $set: {
              cicpassword: hashedPassword,
              confirm_cicpassword: hashedPassword1,
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
          name: `, ${user.cicname}`,
          intro: [
              "You have received this email because a password reset request.",
              "Your password has been successfully reset. Your new password is:",
          ],
          action: {
              button: {
                  color: "#A31217",
                  text: `${cicpassword}`,  
              },
          },
      //   utro: "If you did not request a password reset, no further action is required on your part.",
      },
    };
    
    // Generate email
    const mail = mailGenerator.generate(response);
          const mailOptions = {
            from: "Eleedom IMF Pvt Ltd <your_email@gmail.com>",
            to: user.cicemail,
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
  