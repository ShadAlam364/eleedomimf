import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import Advisor from "../../models/advisor/advisorSchema.js";
dotenv.config();
const { SECRET, EMAIL, PASSWORD, LINK6 } = process.env;

// ************************* Advisor ************************* //
export const advisorRegister = async (req, res) => {
  try {
    const {
      advisorname,
      advisoremail,
      advisormobile,
      advisorpassword,
      advisoraddress,
      branch,
      advisortype,
      uniqueId,
    } = req.body;
    // Check if the user with the given email already exists
    const emailExist = await Advisor.findOne({ advisoremail });
    if (emailExist) {
      return res.status(400).json({
        status: "Advisor Already Exists",
        message: "Advisor with this email already exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(advisorpassword, salt);
    const newAdvisor = new Advisor({
      advisorname,
      advisoremail,
      advisormobile,
      advisoraddress,
      advisortype,
      branch,
      advisorpassword: hashedPassword,
      uniqueId,
    });

    await newAdvisor.save();
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
        name: advisorname,
        intro: [
          "Welcome to My Company!.",
          "Your account has been successfully created with the following credentials:",
        ],

        action: [
          {
            button: {
              color: "#209320",
              text: `Email:   ${advisoremail}`,
            },
          },
          {
            button: {
              color: "#209320",
              text: `Password:   ${advisorpassword}`,
            },
          },
        ],

        outro:
          "You can now log in to your account (as Advisor) and start using our services.",
      },
    };

    // Generate email
    const mail = mailGenerator.generate(response);

    const mailOptions = {
      from: `Eleedom IMF Pvt Ltd your_email@gmail.com`, // Sender address
      to: advisoremail, // Receiver's email address
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
      status: "New Advisor Added Successfully...!",
      message: {
        newAdvisor,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "Error to Adding Advisor",
      message: err.message,
    });
  }
};

//######################## login advisor ###########################//

export const loginAdvisor = async (req, res) => {
  try {
    const { advisoremail, advisormobile, advisorpassword } = req.body;
    
    if (!advisorpassword) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Find advisor by email or mobile
    let query;
    if (advisoremail) {
      query = { advisoremail };
    } else if (advisormobile) {
      query = { advisormobile };
    } else {
      return res.status(400).json({ message: "Email or mobile is required" });
    }

    // Find advisor with password field included for verification
    const advisor = await Advisor.findOne(query).select('+advisorpassword');
    
    if (!advisor) {
      return res.status(401).json({
        message: "Advisor Not Found",
      });
    }

    const isValidPassword = await bcrypt.compare(
      advisorpassword,
      advisor.advisorpassword
    );
    
    if (!isValidPassword) {
      return res.status(400).json({ message: "Password is Incorrect" });
    }

    // Create token
    const token = jwt.sign(
      {
        advisorId: advisor._id,
      },
      SECRET,
      {
        expiresIn: "24h",
      }
    );

    // Remove password before sending response
    const advisorWithoutPassword = advisor.toObject();
    delete advisorWithoutPassword._id;
    delete advisorWithoutPassword.advisorpassword;
    delete advisorWithoutPassword.advisormobile;
    delete advisorWithoutPassword.createdAt;
    delete advisorWithoutPassword.updatedAt;
    delete advisorWithoutPassword.__v;

    return res.status(200).json({
      message: "Login Successful",
      advisory: advisorWithoutPassword,
      token,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
//################### views all advisors #####################/
export const viewAdvisor = async (req, res) => {
  const advisorList = await Advisor.find({});
  if (!advisorList) {
    return res.status(400).json({
      status: "Error during advisor lists Update",
      message: "Invalid advisor selected",
    });
  } else {
    return res.status(200).json(advisorList);
  }
};

// export const viewAdvisor1 = async (req, res) => {
//   let { branch } = req.query;

//   try {
//     let query = {};
//     if (branch) {
//       // Convert branch to uppercase for consistency
//       branch = branch.toUpperCase();
//       query.branch = branch; // Filtering advisors by branch
//     }

//     const advisorList = await Advisor.find(query).sort({ uniqueid: 1 });

//     if (advisorList.length === 0) {
//       return res.status(404).json({
//         status: "Error",
//         message: "No advisors found for the provided branch",
//       });
//     }

//     return res.status(200).json(advisorList);
//   } catch (error) {
//     return res.status(500).json({
//       status: "Error",
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };




export const viewAdvisor1 = async (req, res) => {
  let { branch } = req.query;

  try {
      const pipeline = [];
      
      if (branch) {
          branch = branch.toUpperCase();
          pipeline.push({
              $match: { 
                  branch: { $regex: new RegExp(branch, 'i') } 
              }
          });
      }

      pipeline.push(
          { $sort: { uniqueid: 1 } },
          {
              $project: {
                  _id: 1,
                  advisorname: 1,
                  uniqueId: 1,
                  branch: 1,
                  advisortype: 1,
                  advisormobile: 1,
                  advisoremail: 1,
                  advisoraddress: 1

              }
          }
      );

      const advisorList = await Advisor.aggregate(pipeline);

      if (advisorList.length === 0) {
          return res.status(404).json({
              status: "Not Found",
              message: "No advisors found",
          });
      }

      return res.status(200).json(advisorList);
  } catch (error) {
      return res.status(500).json({
          status: "Server Error",
          message: error.message,
      });
  }
}

// Controller function to handle updating specific fields of a advisor
export const updateAdvisor = async (req, res) => {
  try {
    const advisorId = req.params.id;
    const updatedAdvisorData = req.body;

    // Check if the company exists before attempting to update
    const existingAdvisor = await Advisor.findById(advisorId);

    if (!existingAdvisor) {
      return res.status(404).json({
        status: "Advisor not found",
        message: "The specified Advisor ID does not exist in the database",
      });
    }

    // Perform the update
    const updatedAdvisor = await Advisor.findByIdAndUpdate(
      advisorId,
      updatedAdvisorData,
      {
        new: true,
        runValidators: true, // Optional: Run Mongoose validation
      }
    );

    return res.status(200).json({
      status: "Advisor Updated Successfully!",
      message: {
        updatedAdvisor,
      },
    });
  } catch (err) {
    console.error("Error during Advisor Update:", err);
    return res.status(500).json({
      status: "Internal Server Error",
      message: err.message,
    });
  }
};

// forgot password
export const ForgotAdvisorPassword = async (req, res) => {
  try {
    const user = await Advisor.findOne({ advisoremail: req.body.advisoremail });
    if (!user) {
      return res.status(400).json("Email not found. Register Now!");
    }
    // Generate a random token
    const secret = user._id + SECRET;
    let token = jwt.sign({ userId: user._id }, secret, {
      expiresIn: "15m",
    });

    const link = `${LINK6}/${user._id}/${token}`;

    //...................................Nodemailer code.......................................//
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL, //own email id
        pass: PASSWORD, // own emailid password
      },
    });
    const mailGenerator = new Mailgen({
      theme: "cerberus",
      product: {
        // .......................Appears in header & footer of e-mails......................//
        name: "Eleedom Pvt Ltd",
        link: "https://mailgen.js/",
        copyright: "Copyright © 2024 Eleedom Pvt Ltd. All rights reserved.",
      },
    });
    //...................................Prepare email contents..............................//
    let response = {
      body: {
        name: `${user.advisorname}`,
        intro: [
          "You have received this email because a password reset request for your account was received.",
          "Valid till 15 Minutes only!",
        ],
        action: {
          instructions: "Click the button below to reset your password:",
          button: {
            color: "#DC4D2F",
            text: "Reset your password",
            link: link,
          },
        },
        outro:
          "If you did not request a password reset, no further action is required on your part.",
      },
    };
    // .......................................Generate email....................................//
    const mail = mailGenerator.generate(response);
    //........................................Send email........................................//
    transporter.sendMail(
      {
        from: '"Eleedom Pvt Ltd"<example@gmail.com>', // sender address
        to: user.advisoremail, // list of receivers
        subject: "Password Reset Request", // Subject line
        html: mail,
      },

      (error, info) => {
        if (error) {
          res.status(500).json("Email not sent. Register Yourself!");
        }
        return res.status(200).json("Email sent successfully...!");
      }
    );
  } catch (error) {
    return res.status(500).json("An error occurred");
  }
};

//################### delete advisors #####################/
export const deleteAdvisor = async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedAdvisor = await Advisor.findByIdAndDelete(userId);
    if (!deletedAdvisor) {
      return res.status(404).json({ message: "Advisor not found" });
    }
    return res.json({
      message: "Advisor deleted successfully",
      deletedAdvisor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// .......................................Update Password..................................//
export const advisorPasswordReset = async (req, res) => {
  const { advisorpassword, confirm_advisorpassword } = req.body;
  const { id, token } = req.params; // Access id from params
  const user = await Advisor.findById(id);
  const new_secret = user._id + SECRET;

  try {
    jwt.verify(token, new_secret);

    if (advisorpassword && confirm_advisorpassword) {
      if (advisorpassword !== confirm_advisorpassword) {
        return res.status(400).json("Passwords doesn't Match. Try Again..!");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(advisorpassword, salt);
      const hashedPassword1 = await bcrypt.hash(confirm_advisorpassword, salt);
      await Advisor.findByIdAndUpdate(user._id, {
        $set: {
          advisorpassword: hashedPassword,
          confirm_advisorpassword: hashedPassword1,
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
          name: `, ${user.advisorname}`,
          intro: [
            "You have received this email because a password reset request.",
            "Your password has been successfully reset. Your new password is:",
          ],
          action: {
            button: {
              color: "#A31217",
              text: `${advisorpassword}`,
            },
          },
          //   utro: "If you did not request a password reset, no further action is required on your part.",
        },
      };

      // Generate email
      const mail = mailGenerator.generate(response);
      const mailOptions = {
        from: "Eleedom IMF Pvt Ltd <your_email@gmail.com>",
        to: user.advisoremail,
        subject: "Your Password has been Reset",
        html: mail,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res
            .status(500)
            .json("Error Occurred While Sending Email..!" + error);
        } else {
          return res.status(200).json("Email sent" + info.response);
        }
      });
      return res.status(200).json("Password Updated Successfully....!");
    }
  } catch (error) {
    return res.status(500).json("Invalid Link or Expired....!" + error);
  }
};
