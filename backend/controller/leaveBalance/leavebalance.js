import LBalance from "../../models/leaveBalance/leavebalance.js";
export const LeaveTypes = async (req, res) => {
    try {
      const { leavetype, restleave } = req.body;
      // Create a new branch
      const types = await LBalance.findOne({ leavetype });
      if (types) {
        return res.status(400).json({
          status: "Leave Type Already Exists",
          message: "Leave Type already exists....!",
        });
      }
      const newStaff = new LBalance({
        leavetype,
        restleave
      });
      // Save the new branch to the database
      await newStaff.save();
      return res.status(201).json({
        status: "Leave Type Added Successfully.....!",
        message: {
          newStaff,
        },
      });
    } catch (err) {
      return res.status(400).json({
        status: "Error During Submit.....!",
        message: err.message,
      });
    }
  };
  
  // lists of leave type
  export const LeaveTypeList = async (req, res) =>{
      try {
          const staff = await LBalance.find({});
  
          if (!staff) {
              return res.status(400).json({
                status: "Error During Leave Type lists Update",
                message: "Invalid Leave Type Selected",
              });
            }else{
              return res.status(200).json(staff);
            }
          
      } catch (error) {
          return res.status(400).json({
              status: "Error during View......!",
              message: error.message,
            });
      }
  }
  
  // delete staff type
  export const LeaveDelete = async (req, res) => {
      try {
        const lid = req.params.id;
        
        const deletedStaff = await LBalance.findByIdAndDelete(lid);
        if (!deletedStaff) {
          return res.status(404).json({ message: "Leave Type not found" });
        }
        return res.json({ message: "Leave Type Deleted Successfully.....!", deletedStaff });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    };
  

    