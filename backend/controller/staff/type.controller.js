import StaffType from "../../models/staffType/staffType.js";
// add staff
export const staffType = async (req, res) => {
  try {
    const { s_type } = req.body;
    // Create a new branch
    const newStaff = new StaffType({
      s_type,
    });
    // Save the new branch to the database
    await newStaff.save();
    return res.status(201).json({
      status: "Staff Added Successfully!",
      message: {
        newStaff,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "Error during Submit..!",
      message: err.message,
    });
  }
};

// lists of staff type
export const staffList = async (req, res) =>{
    try {
        const staff = await StaffType.find({});

        if (!staff) {
            return res.status(400).json({
              status: "Error during staff type lists Update",
              message: "Invalid staff type selected",
            });
          }else{
            return res.status(200).json(staff);
          }
        
    } catch (error) {
        return res.status(400).json({
            status: "Error during View..!",
            message: error.message,
          });
    }
}


// delete staff type
export const deleteStaff = async (req, res) => {
    try {
      const staffId = req.params.id;
      
      const deletedStaff = await StaffType.findByIdAndDelete(staffId);
      if (!deletedStaff) {
        return res.status(404).json({ message: "Staff Type not found" });
      }
      return res.json({ message: "Staff Type deleted successfully", deletedStaff });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };