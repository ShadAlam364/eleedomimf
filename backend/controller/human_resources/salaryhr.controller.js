import { MongoClient } from "mongodb";
import archiver from "archiver";
const { MONGODB_URI, DB_NAME } = process.env;
import HRSalary from "../../models/hr/addsalary.js";
export const hrSalaryController = async (req, res) => {
  try {
    const { hrname, hrmonthlySalary, hrmonthlyLeave } = req.body;
    // Create a new salary instance
    const addnewSalary = new HRSalary({
      hrname: hrname.toString(),
      hrmonthlySalary,
      hrmonthlyLeave,
    });
    // Save the salary to the database
    await addnewSalary.save();
    return res.status(201).json({
      status: " HR Salary Added Successfully",
      message: {
        addnewSalary,
        // Include the list of employees in the response
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "Error during HR Salary Update",
      message: err.message,
    });
  }
};

// **************************** view salarylist **************************** //
export const viewHrSalary = async (req, res) => {
  const SalaryList = await HRSalary.find({});
  if (!SalaryList) {
    return res.status(400).json({
      status: "Error during HR salary lists Update",
      message: "Invalid HR salary selected",
    });
  } else {
    return res.status(200).json(SalaryList);
  }
};

// update  salary code 
export const updateHRSalary = async (req, res) => {
  try {
    const salaryId = req.params.id;
    const salaryData = req.body;

    // Check if the empoyee exists before attempting to update
    const existingSalary = await HRSalary.findById(salaryId);

    if (!existingSalary) {
      return res.status(404).json({
        status: "Salary not found",
        message: "The specified Salary ID does not exist in the database",
      });
    }

    // Perform the update
    const updatedSalary = await HRSalary.findByIdAndUpdate(
      salaryId,
      salaryData,
      {
        new: true,
        runValidators: true, // Optional: Run Mongoose validation
      }
    );

    return res.status(200).json({
      status: "HR Salary Updated Successfully!",
      message: {
        updatedSalary
      },
    });
  } catch (err) {
    console.error("Error during HR Salary Update:", err);

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        status: "Validation Error",
        message: err.message,
      });
    }

    return res.status(500).json({
      status: "Internal Server Error",
      message: err.message,
    });
  }
};

// ******************** delete HR controller ************************* //
export const deleteHRSalary = async (req, res) => {
  try {
    const hrId = req.params.id;
    const deletedHRSalary = await HRSalary.findByIdAndDelete(hrId);
    if (!deletedHRSalary) {
      return res.status(404).json({ message: "HR Salary not found" });
    }
    return res.json({ message: "HR Salary deleted successfully", deletedHRSalary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// Function to export all collections
// export const exSave = async (req, res) => {
//   const client = new MongoClient(`${MONGODB_URI}/${DB_NAME}`);
//   const archive = archiver("zip", {
//     zlib: { level: 9 }, // maximum compression
//   });
//   // Set the response headers to prompt a download
//   res.attachment("mongodb.zip");
//   archive.pipe(res);
//   try {
//     await client.connect();
//     const db = client.db(DB_NAME);
//     // Fetch all collection names
//     const collections = await db.listCollections().toArray();
//     // Export each collection into its own file in the zip
//     for (const collection of collections) {
//       const collectionName = collection.name;
//       const data = await db.collection(collectionName).find({}).toArray();
//       // Add the collection data as a file in the zip archive
//       const jsonContent = JSON.stringify(data, null, 2);
//       archive.append(jsonContent, { name: `${collectionName}.json` });
//       archive.append(jsonContent, { name: `${collectionName}.bson` });
//     //  console.log(`Adding collection: ${collectionName}`);
//     }
//     // Finalize the zip and send the response
//     archive.finalize();
//   } catch (error) {
//     res.status(500).json(error);
//   } finally {
//     await client.close();
//   }
// };
