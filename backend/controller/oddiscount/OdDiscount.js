import ODDiscount from "../../models/oddiscount/Oddiscount.js";

export const ODAdd = async (req, res) => {
  try {
    const { odDiscount } = req.body;
    // Create a new branch
    const types = await ODDiscount.findOne({ odDiscount });
    if (types) {
      return res.status(400).json({
        status: "OD-Discount Already Exists",
        message: "OD-Discount already exists....",
      });
    }
    const newod = new ODDiscount({
      odDiscount,
    });
    // Save the new branch to the database
    await newod.save();
    return res.status(201).json({
      status: `${newod.odDiscount} Added Successfully.....!`,
      message: {
        newod,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "Error to Add Od-Discount.....!",
      message: err.message,
    });
  }
};

// export const OdList = async (req, res) =>{
//   try {
//       const staff = await ODDiscount.find({});
//       if (!staff) {
//           return res.status(400).json({
//             status: "Error during OD-Discount lists Update",
//             message: "Invalid OD-Discount selected",
//           });
//         }else{
//           return res.status(200).json(staff);
//         }
//   } catch (error) {
//       return res.status(400).json({
//           status: "Error during OD-Discount View..!",
//           message: error.message,
//         });
//   }
// }
export const OdList = async (req, res) => {
  try {
      const discounts = await ODDiscount.aggregate([
          {
              $project: {
                  _id: 1,
                  odDiscount: 1,
                  // createdAt: 1,
                  // updatedAt: 1
              }
          },
          { $sort: { odDiscount: 1 } }
      ]);

      if (!discounts || discounts.length === 0) {
          return res.status(404).json({
              status: "Not Found",
              message: "No OD discounts found",
          });
      }
      
      return res.status(200).json(discounts);
  } catch (error) {
      return res.status(500).json({
          status: "Server Error",
          message: error.message,
      });
  }
}


export const OdDelete = async (req, res) => {
  try {
    const odId = req.params.id;
    const deletedod = await ODDiscount.findByIdAndDelete(odId);
    if (!deletedod) {
      return res.status(404).json({ message: "OD-Discount not found" });
    }
    return res.json({ message: `${deletedod.odDiscount} Deleted Successfully.....!` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" } + error);
  }
};