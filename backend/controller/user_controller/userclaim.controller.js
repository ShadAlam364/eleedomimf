import UserClaim from "../../models/user_models/useclaimSchema.js";

export const claimAdded = async (req, res) => {
    try {
      const {
        userclaim_name,
        userclaim_email,
        userclaim_mobile,
        userclaim_insurance_name,
        userclaim_policyno,
        userclaim_date,
        userclaim_time,
        userclaim_policyexp
      } = req.body;
  
      // Check if the branch with the given branchcode already exists
      const emailExist = await UserClaim.findOne({userclaim_email});
      if (emailExist) {
        return res.status(400).json({
          status: "User Already Exists",
          message: "This user already exists.",
        });
      }
  // console.log(emailExist);
      // Create a new branch
      const newClaim = new UserClaim({
        userclaim_name,
        userclaim_email,
        userclaim_mobile,
        userclaim_insurance_name,
        userclaim_policyno,
        userclaim_date,
        userclaim_time,
        userclaim_policyexp
      });
      // Save the new branch to the database
      await newClaim.save();
      return res.status(201).json({
        status: "Claimed Successfully!",
        message: {
            newClaim,
        },
      });
    } catch (err) {
      return res.status(400).json({
        status: "Error during registration",
        message: err.message,
      });
    }
  };
// ************************* view lists ************************* //
export const viewClaim = async (req, res) => {
  const ClaimList = await UserClaim.find({});
  if (!ClaimList) {
    return res.status(400).json({
      status: "Error during claim lists Update",
      message: "Invalid claim selected",
    });
  } else {
    return res.status(200).json(ClaimList);
  }
};


//  delete claim controller
export const deleteClaim = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const deletedClaim = await UserClaim.findByIdAndDelete(userId);
    if (!deletedClaim ) {
      return res.status(404).json({ message: "Claim not found" });
    }
    return res.json({ message: "Claim deleted successfully", deletedClaim});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};