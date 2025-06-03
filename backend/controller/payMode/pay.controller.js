import PaymentMode from "../../models/paymentmode/PaymentMode.js";

export const PaymentAdd = async (req, res) => {
    try {
      const { paymentmode } = req.body;
      // Create a new branch
      const types = await PaymentMode.findOne({ paymentmode });
      if (types) {
        return res.status(400).json({
          status: "Payment Mode Already Exists",
          message: "Payment Mode already exists....",
        });
      }
  
      const newStaff = new PaymentMode({
        paymentmode,
      });
      // Save the new branch to the database
      await newStaff.save();
      return res.status(201).json({
        status: "Payment Mode Added Successfully!",
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
  
  export const PaymentModeList = async (req, res) =>{
    try {
        const staff = await PaymentMode.find({});

        if (!staff) {
            return res.status(400).json({
              status: "Error during Payment Mode lists Update",
              message: "Invalid Payment Mode selected",
            });
          }else{
            return res.status(200).json(staff);
          }
        
    } catch (error) {
        return res.status(400).json({
            status: "Error during Payment Mode View..!",
            message: error.message,
          });
    }
}

// delete staff type
export const PaymentDelete = async (req, res) => {
    try {
      const pmodeId = req.params.id;
      
      const deletedPayment = await PaymentMode.findByIdAndDelete(pmodeId);
      if (!deletedPayment) {
        return res.status(404).json({ message: "Payment Mode not found" });
      }
      return res.json({ message: "Payment Mode Deleted successfully", deletedPayment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" } + error);
    }
  };
