import UserFeedback from "../../models/user_models/userfeedbackSchema.js";

export const userFeedback = async (req, res) => {
  try {
    const {
      feedbackuser_name,
      feedbackuser_email,
      feedbackuser_mobile,
      feedbackuser_query,
      feedbackuser_upload,
      feedbackuser_status,
    } = req.body;
    // Check if a file is provided in the request
    const uploadfile =
    req.files && req.files["feedbackuser_upload"] && req.files["feedbackuser_upload"][0]
    ? "https://eleedomimf.onrender.com/uploads/" + req.files["feedbackuser_upload"][0].filename
    : null;
    

    // Check if the branch with the given branchcode already exists
    const emailExist = await UserFeedback.findOne({ feedbackuser_email });
    if (emailExist) {
      return res.status(400).json({
        status: "Feedback Already Exists",
        message: "This feedback already exists.",
      });
    }
    //   console.log(emailExist);
    // Create a new branch
    const newComplaint = new UserFeedback({
      feedbackuser_name,
      feedbackuser_email,
      feedbackuser_mobile,
      feedbackuser_query,
      feedbackuser_upload: uploadfile,
      feedbackuser_status,
    });
    // Save the new branch to the database
    await newComplaint.save();
    return res.status(201).json({
      status: "Feedback Submitted Successfully!",
      message: {
        newComplaint,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "Error during Feedback..!",
      message: err.message,
    });
  }
};
// ************************* view lists ************************* //
export const viewFeedback = async (req, res) => {
  const feedbackList = await UserFeedback.find({});
  if (!feedbackList) {
    return res.status(400).json({
      status: "Error during claim lists Update",
      message: "Invalid claim selected",
    });
  }
  else {
    return res.status(200).json(feedbackList);
  }
};



// ************************ updated feedback toggle ************************* //
export const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    // Find the existing feedback
    const existingFeedback = await UserFeedback.findById(id);
    if (!existingFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    // Toggle the feedback status between true and false
    const updatedFeedback = await UserFeedback.findByIdAndUpdate(
      id,
      { feedbackuser_status: !existingFeedback.feedbackuser_status },
      { new: true }
    );
    res.json(updatedFeedback);
  } catch (error) {
    console.error("Error updating feedback status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// jiska feedbackuser_status false ho wo nahi dikhe  list m 

export const getActiveUsers = async (req, res) => {
  try {
    const activeUsers = await UserFeedback.find({ feedbackuser_status: true });
    res.json(activeUsers);
  } catch (error) {
    console.error('Error retrieving active users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// ************************* delete feedback controller ************************* //
export const deleteFeedback = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedFeedback = await UserFeedback.findByIdAndDelete(userId);
    if (!deletedFeedback) {
      return res.status(404).json({ message: "Branch not found" });
    }
    return res.json({
      message: "Branch deleted successfully",
      deletedFeedback,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
