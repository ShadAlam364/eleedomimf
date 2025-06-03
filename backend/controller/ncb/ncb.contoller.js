import ncbAdd from "../../models/ncb/ncb.js";

export const ncbAdds = async (req, res) => {
  try {
    const { ncb } = req.body;
    // Create a new branch
    const types = await ncbAdd.findOne({ ncb });
    if (types) {
      return res.status(400).json({
        status: "NCB Already Exists",
        message: "NCB Already exists....",
      });
    }
    const newod = new ncbAdd({
        ncb,
    });
    // Save the new branch to the database
    await newod.save();
    return res.status(201).json({
      status: `${newod.ncb} Added Successfully.....!`,
      message: {
        newod,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "Error to Add NCB.....!",
      message: err.message,
    });
  }
};

export const ncbLists = async (req, res) =>{
  try {
      const staff = await ncbAdd.find({});
      if (!staff) {
          return res.status(400).json({
            status: "Error during ncb lists Update",
            message: "Invalid ncb selected",
          });
        }else{
          return res.status(200).json(staff);
        }
  } catch (error) {
      return res.status(400).json({
          status: "Error during ncb View..!",
          message: error.message,
        });
  }
}
// app.delete('/delete-collection/:collectionName', 
  export const lists= async (req, res) => {
  const { listsName } = req.params;
  const db = await connectToDatabase();
  try {
      const result = await db.collection(listsName).drop();
      if (result) {
          res.status(200).send(`NCB view Successfully....!`);
      } else {
          res.status(404).send(`NCB not view yet....!`);
      }
  } catch (error) {
      res.status(500).send(`Error`);
  } finally {
      await client.close();
  }
}

export const ncbDelete = async (req, res) => {
  try {
    const ncbId = req.params.id;
    const deletencb = await ncbAdd.findByIdAndDelete(ncbId);
    if (!deletencb) {
      return res.status(404).json({ message: "CC not found" });
    }
    return res.json({ message: `${deletencb.ncb} Deleted Successfully.....!` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" } + error);
  }
};