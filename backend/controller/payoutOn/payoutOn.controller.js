import payoutOn from "../../models/payouton/payoutOn.js";

export const PayoutOnAdd = async (req, res) => {
    try {
      const { payouton } = req.body;
      // Create a new branch
      const types = await payoutOn.findOne({ payouton });
      if (types) {
        return res.status(400).json({
          status: "PayoutOn Already Exists",
          message: "PayoutOn already exists....",
        });
      }
  
      const newStaff = new payoutOn({
        payouton,
      });
      // Save the new branch to the database
      await newStaff.save();
      return res.status(201).json({
        status: "PayoutOn Added Successfully!",
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
  
  export const PayoutOnList = async (req, res) =>{
    try {
        const staff = await payoutOn.find({});

        if (!staff) {
            return res.status(400).json({
              status: "Error during PayoutOn lists Update",
              message: "Invalid PayoutOn selected",
            });
          }else{
            return res.status(200).json(staff);
          }
        
    } catch (error) {
        return res.status(400).json({
            status: "Error during PayoutOn View..!",
            message: error.message,
          });
    }
}

// delete staff type
export const PayoutOnDelete = async (req, res) => {
    try {
      const payId = req.params.id;
      
      const deletedPayout = await payoutOn.findByIdAndDelete(payId);
      if (!deletedPayout) {
        return res.status(404).json({ message: "PayoutOn not found" });
      }
      return res.json({ message: "PayoutOn Deleted successfully", deletedPayout });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" } + error);
    }
  };
