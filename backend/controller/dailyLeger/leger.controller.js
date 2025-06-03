import Allinsurance from "../../models/masterDetails/masterdetailSchema.js";
import DailyLeger from "../../models/dailyLeger/dailyleger.js";
export const addDailyLeger = async (req, res) => {
  const entries = req.body;
  try {
    // Check if the entries array is empty
    if (entries.length === 0) {
      return res.status(400).json({ message: "No data found to save" });
    }
    const savedPolicyNumbers = []; // Array to store saved policy numbers
    // Loop through each entry and save it
    await Promise.all(
      entries.map(async (entry) => {
        const newEntry = new DailyLeger(entry);
        await newEntry.save();
        savedPolicyNumbers.push(newEntry.advisorName); // Store the policy number
      })
    );
    // Return success message along with saved policy numbers
    return res.status(200).json({
      message: "Daily Leger Saved Successfully....!",
      savedPolicyNumbers,
    });
  } catch (error) {
    throw new Error("Error adding entry to Daily Ledger: " + error.message);
  }
};

// export const viewLeger = async (req, res) => {
//   try {
//     const { policyNo, insuredName, fromDate, toDate, company } = req.query;
// console.log(req.query);

//     // Construct filter object dynamically
//     const filter = {};

//     if (policyNo) {
//       filter.policyNo = policyNo;
//     }
    
//     if (insuredName) {
//       filter.insuredName =  insuredName;
//     }    

//     if (company) {
//       filter.company = company;
//     }

//     // Handle date range filtering when only fromDate and toDate are provided
//     if (fromDate && toDate) {
//       filter.entryDate = { $gte: new Date(fromDate), $lte: new Date(toDate) };
//     } else if (fromDate) {
//       filter.entryDate = { $gte: new Date(fromDate) };
//     } else if (toDate) {
//       filter.entryDate = { $lte: new Date(toDate) };
//     }

//     // Fetch filtered and sorted data from the database with specific fields
//     const policies = await Allinsurance.find(filter)
//       .select(
//         "entryDate paymentCompanyDate advId policyNo advisorName insuredName company debitCompanyAmount paymentCompanyType _id finalEntryFields paymentCompanyRefNo creditCompanyAmount"
//       )
//       .sort({ entryDate: 1 }); // Sort by entryDate in ascending order

//     // Send the response
//     return res.status(200).json({ allList: policies });
//   } catch (error) {
//     console.error("Error fetching filtered data:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// VIEW  ALL DATA OF VEHICLE SLAB
export const viewLeger = async (req, res) => {
  try {
    const { policyNo, insuredName, fromDate, toDate, company } = req.query;

    // Construct filter object dynamically
    const filter = {};

    if (policyNo) {
      filter.policyNo = policyNo; // Add regex if needed for case-insensitivity
    }

    if (insuredName) {
      filter.insuredName = insuredName; // Add regex if needed for case-insensitivity
    }

    if (company) {
      filter.company = company; // Exact match
    }

    if (fromDate) {
      filter.entryDate = { ...filter.entryDate, $gte: fromDate }; // Combine with $lte if toDate exists
    }

    if (toDate) {
      filter.entryDate = { ...filter.entryDate, $lte: toDate }; // Combine with $gte if fromDate exists
    }

    // Fetch filtered and sorted data from the database with specific fields
    const policies = await Allinsurance.find(filter)
      .select(
        "paymentCompanyDate advId entryDate policyNo advisorName insuredName company debitCompanyAmount paymentCompanyType _id finalEntryFields paymentCompanyRefNo creditCompanyAmount"
      )
      .sort({ entryDate: 1 }); // Sort by entryDate in descending order

    // Send the response
    return res.status(200).json({ allList: policies });
  } catch (error) {
    console.error("Error fetching filtered data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Update entry in Daily Ledger
// export const updateDailyLeger = async (req, res) => {
//   const inputData = req.body.inputData;
//   const { advId, advisorName } = req.query; // Destructure advId and advisorName from inputData
//   try {
//     const updatedEntry = await Allinsurance.updateOne({ advId, advisorName }, { $set: { value: inputData } });
//     return updatedEntry;
//   } catch (error) {
//     throw new Error("Error updating entry in Daily Ledger: " + error.message);
//   }
// };

export const updateDailyLeger = async (req, res) => {
  const updates = req.body;

  try {
    // Check if the updates array is empty
    if (updates.length === 0) {
      return res.status(400).json({ message: "No updates found" });
    }

    // Prepare an array to store the bulk write operations
    const bulkOperations = [];

    // Iterate over each update and construct bulk write operations
    updates.forEach((update) => {
      const {
        advId,
        advisorName,
        debitCompanyAmount,
        debitMonthlyAmount,
        entryDate,
        policyNo,
        insuredName,
        debitAmount,
        paymentDate,
        paymentMonthlyDate,
        paymentCompanyDate,
        paymentType,
        paymentMonthlyType,
        paymentCompanyType,
        paymentRefNo,
        paymentMonthlyRefNo,
        paymentCompanyRefNo,
        creditAmount,
        creditMonthlyAmount,
        creditCompanyAmount,
        balance,
        balanceMonthly,
        balanceCompany,
      } = update;

      // Construct the filter criteria
      const filter = { advId, advisorName, entryDate, policyNo, insuredName };

      // Construct the update operation
      const updateOperation = {
        $set: {
          debitAmount,
          debitMonthlyAmount,
          debitCompanyAmount,
          paymentDate,
          paymentMonthlyDate,
          paymentCompanyDate,
          paymentType,
          paymentMonthlyType,
          paymentCompanyType,
          paymentRefNo,
          paymentMonthlyRefNo,
          paymentCompanyRefNo,
          creditAmount,
          creditMonthlyAmount,
          creditCompanyAmount,
          balance,
          balanceMonthly,
          balanceCompany,
        },
      };

      // Add the update operation to the bulk operations array
      bulkOperations.push({
        updateOne: {
          filter,
          update: updateOperation,
        },
      });
    });
    // Perform bulk updates using bulkWrite method
    await Allinsurance.bulkWrite(bulkOperations);
    return res
      .status(200)
      .json({ message: "Daily Leger Updated Successfully...!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating Leger: " + error.message });
  }
};

// export const updateMonthlyLeger = async (req, res) => {
//   const updates = req.body;

//   try {
//     // Check if the updates array is empty
//     if (updates.length === 0) {
//       return res.status(400).json({ message: "No updates found" });
//     }

//     // Prepare an array to store the bulk write operations
//     const bulkOperations = [];

//     // Iterate over each update and construct bulk write operations
//     updates.forEach(update => {
//       const { entryDate, paymentCompanyDate, paymentCompanyType, paymentCompanyRefNo, creditCompanyAmount } = update;

//       // Check if all specified fields are non-empty for the current update
//       if (paymentCompanyDate || paymentCompanyType || paymentCompanyRefNo || creditCompanyAmount) {
//         // Construct the filter criteria
//         const filter = { entryDate };

//         // Construct the update operation
//         const updateOperation = {
//           $set: {
//             paymentCompanyDate: paymentCompanyDate || '',
//             paymentCompanyType: paymentCompanyType || '',
//             paymentCompanyRefNo: paymentCompanyRefNo || '',
//             creditCompanyAmount: parseFloat(creditCompanyAmount) || 0
//           }
//         };

//         // Add the update operation to the bulk operations array
//         bulkOperations.push({
//           updateOne: {
//             filter,
//             update: updateOperation
//           }
//         });
//       }
//     });

//     // Perform bulk updates using bulkWrite method
//     await Allinsurance.bulkWrite(bulkOperations);

//     return res.status(200).json({ message: "Company Leger Updated Successfully" });
//   } catch (error) {
//     return res.status(500).json({ message: "Error updating Company Leger: " + error.message });
//   }
// };

export const updateMonthlyLeger = async (req, res) => {
  const updates = req.body;

  try {
    // Check if the updates array is empty
    if (updates.length === 0) {
      return res.status(400).json({ message: "No updates found" });
    }

    // Iterate over each update and perform individual updates
    for (const update of updates) {
      const {
        entryDate,
        paymentCompanyDate,
        paymentCompanyType,
        paymentCompanyRefNo,
        creditCompanyAmount,
      } = update;

      // Check if all specified fields are non-empty for the current update
      if (
        paymentCompanyDate ||
        paymentCompanyType ||
        paymentCompanyRefNo ||
        creditCompanyAmount
      ) {
        // Construct the filter criteria
        const filter = { entryDate };

        // Construct the update operation
        const updateOperation = {
          $set: {
            paymentCompanyDate: paymentCompanyDate || "",
            paymentCompanyType: paymentCompanyType || "",
            paymentCompanyRefNo: paymentCompanyRefNo || "",
            creditCompanyAmount: parseFloat(creditCompanyAmount) || 0,
          },
        };

        // Perform individual update using findOneAndUpdate method
        await Allinsurance.findOneAndUpdate(filter, updateOperation);
      }
    }

    return res
      .status(200)
      .json({ message: "Company Leger Updated Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating Company Leger: " + error.message });
  }
};
