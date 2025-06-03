import CC from "../../models/cc/cc.js";

export const ccAdd = async (req, res) => {
  try {
    const { cc } = req.body;
    // Create a new branch
    const types = await CC.findOne({ cc });
    if (types) {
      return res.status(400).json({
        status: "CC Already Exists",
        message: "CC Already exists....",
      });
    }
    const newod = new CC({
      cc,
    });
    // Save the new branch to the database
    await newod.save();
    return res.status(201).json({
      status: `${newod.cc} Added Successfully.....!`,
      message: {
        newod,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "Error to Add CC.....!",
      message: err.message,
    });
  }
};

export const CCList = async (req, res) =>{
  try {
      const staff = await CC.find({});
      if (!staff) {
          return res.status(400).json({
            status: "Error during CC lists Update",
            message: "Invalid CC selected",
          });
        }else{
          return res.status(200).json(staff);
        }
  } catch (error) {
      return res.status(400).json({
          status: "Error during CC View..!",
          message: error.message,
        });
  }
}


export const CCDelete = async (req, res) => {
  try {
    const CCId = req.params.id;
    const deleteCC = await CC.findByIdAndDelete(CCId);
    if (!deleteCC) {
      return res.status(404).json({ message: "CC not found" });
    }
    return res.json({ message: `${deleteCC.cc} Deleted Successfully.....!` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" } + error);
  }
};