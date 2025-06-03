import CompanyFilled from "../../models/user_models/companyFormsData.js";

export const userFillCompanyForm = async (req, res) => {
  try {
    const { h_name, h_email, h_mobile, h_cname, h_address } = req.body;
    // Create a new branch
    const newFormFilled = new CompanyFilled({
      h_name,
      h_email,
      h_mobile,
      h_cname,
      h_address,
    });

    // Save the new branch to the database
    await newFormFilled.save();

    return res.status(201).json({
      status: "Submitted Successfully!",
      message: {
        newFormFilled,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "Error during Submit..!",
      message: err.message,
    });
  }
};



// ************************* view lists ************************* //
export const viewUserFillCompanyForm = async (req, res) => {
  const filledList = await CompanyFilled.find({});
  if (!filledList) {
    return res.status(400).json({
      status: "Error during Health Update",
      message: "Invalid Health Selected",
    });
  } else {
    return res.status(200).json(filledList);
  }
};

// *********** delete user details according to company ****************** //

export const deleteUserFillCompanyForm = async (req, res) => {
  try {
    const userId = req.params.id;
    // console.log(req.params);
    const deletedfilled = await CompanyFilled.findByIdAndDelete(userId);
    if (!deletedfilled) {
      return res.status(404).json({ message: "UserFillCompanyForm not found" });
    }
    return res.json({ message: "UserFillCompanyForm deleted successfully", deletedfilled });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};