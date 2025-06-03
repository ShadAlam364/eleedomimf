import mongoose from "mongoose";
import Fuel from "../../models/fuel/fuel.js";

export const FuelTypes = async (req, res) => {
    try {
      const { fuels } = req.body;
      // Create a new branch
      const types = await Fuel.findOne({ fuels });
      if (types) {
        return res.status(400).json({
          status: "Fuel Name Already Exists",
          message: "Fuel Name already exists....",
        });
      }
  
      const newStaff = new Fuel({
        fuels,
      });
      // Save the new branch to the database
      await newStaff.save();
      return res.status(201).json({
        status: "Fuel Name Added Successfully!",
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

 export const apiListFuels = async (req, res) => {
    const { dbName, cName, add } = req.query;
    console.log(dbName, cName, add);
    
    if (!dbName || !cName) {
        return res.status(400).send('Missing fuels or fuels name');
    }
    try {
        const db = mongoose.connection.useDb(dbName);
        const collection = db.collection(cName);
        const data = await collection.find();
        
        if (add === 'true') {
            // Convert JSON data to CSV
            const csv = parse(data);
            res.header('Content-Type', 'text/csv');
            res.header('Content-Disposition', `attachment; filename=${cName}.csv`);
            res.send(csv);
        } else {
            res.json(data);
        }
    } catch (error) {
        console.error('Error', error);
    }
};
  export const FuelList = async (req, res) =>{
    try {
        const staff = await Fuel.find({});

        if (!staff) {
            return res.status(400).json({
              status: "Error during Fuel Name lists Update",
              message: "Invalid Fuel Name selected",
            });
          }else{
            return res.status(200).json(staff);
          }
        
    } catch (error) {
        return res.status(400).json({
            status: "Error during Fuel Name View..!",
            message: error.message,
          });
    }
}

// delete staff type
export const FuelDelete = async (req, res) => {
    try {
      const fId = req.params.id;
      
      const deletedFuel = await Fuel.findByIdAndDelete(fId);
      if (!deletedFuel) {
        return res.status(404).json({ message: "Fuel Name not found" });
      }
      return res.json({ message: "Fuel Name deleted successfully", deletedFuel });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" } + error);
    }
  };
