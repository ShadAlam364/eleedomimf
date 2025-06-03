import UserComplaint from "../../models/user_models/usercomplaintSchema.js";

export const userComplaint = async (req, res) => {
    try {
      const {
        complaint_name,
        complaint_email,
        complaint_mobile,
        complaint_subject,
        complaint_query,
       
      } = req.body;
  
      // Check if the branch with the given branchcode already exists
      const emailExist = await UserComplaint.findOne({complaint_email});
      if (emailExist) {
        return res.status(400).json({
          status: "User Already Exists",
          message: "This user already exists.",
        });
      }
//   console.log(emailExist);
      // Create a new branch
      const newComplaint = new UserComplaint({
        complaint_name,
        complaint_email,
        complaint_mobile,
        complaint_subject,
        complaint_query,
      });
      // Save the new branch to the database
      await newComplaint.save();
      return res.status(201).json({
        status: "Complaint Submitted Successfully!",
        message: {
            newComplaint
        },
      });
    } catch (err) {
      return res.status(400).json({
        status: "Error during Complaint..!",
        message: err.message,
      });
    }
  };

// ************************* view lists ************************* //
export const viewComplaint = async (req, res) => {
  const ComplaintList = await UserComplaint.find({});
  if (!ComplaintList) {
    return res.status(400).json({
      status: "Error during complain lists Update",
      message: "Invalid complain selected",
    });
  } else {
    return res.status(200).json(ComplaintList);
  }
};

//  delete complaint controller
export const deleteComplaint = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const deletedComplaint = await UserComplaint.findByIdAndDelete(userId);
    if (!deletedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    return res.json({ message: "Complaint deleted successfully", deletedComplaint });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};