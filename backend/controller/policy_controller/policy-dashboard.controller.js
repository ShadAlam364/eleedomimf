import AllInsurance from "../../models/masterDetails/masterdetailSchema.js";

export const policydata = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const year = req.query.year || null;
    const month = req.query.month || null;
    const policyNo = req.query.policyNo || null;
    const status = req.query.status || null;
    const branch = req.query.branch || null; // Retrieve branch from query parameters

    const baseQuery = {};
    if (branch) {
      baseQuery.branch = branch; // Filter by branch
    }
    if (year || month) {
      baseQuery.policyEndDate = {
        $regex: `^${year || "\\d{4}"}-${month || "\\d{2}"}`,
        $options: "i",
      };
    }
    if (policyNo) {
      baseQuery.policyNo = {
        $regex: policyNo,
        $options: "i",
      };
    }
    if (status) {
      baseQuery.status = status;
    }

    const [totalPolicies, allPolicies] = await Promise.all([
      AllInsurance.countDocuments(baseQuery),
      AllInsurance.find(baseQuery).skip(skip).limit(limit),
    ]);

    return res.status(200).json({
      allPolicies,
      totalPolicies,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPolicies / limit),
        itemsPerPage: limit,
        totalItems: totalPolicies,
      },
    });
  } catch (error) {
    console.error("Error getting insurance list:", error);
    return res.status(500).json({
      status: "Error during Insurance List Update",
      message: error.message,
    });
  }
};



export const updatePolicyStatus = async (req, res) => {
  try {
    const { policyId, status } = req.body;
    console.log("Updating policy status:", { policyId, status }); // Debug log

    if (!policyId || !status) {
      console.error("Missing policyId or status");
      return res
        .status(400)
        .json({ message: "Policy ID and status are required" });
    }

    const validStatuses = [
      "Renewed",
      "Loss to Competitor",
      "Vehicle Sold",
      "Active",
    ];
    if (!validStatuses.includes(status)) {
      console.error("Invalid status:", status);
      return res
        .status(400)
        .json({
          message: `Invalid status value. Must be one of: ${validStatuses.join(
            ", "
          )}`,
        });
    }

    const policy = await AllInsurance.findById(policyId);
    if (!policy) {
      console.error("Policy not found:", policyId);
      return res.status(404).json({ message: "Policy not found" });
    }

    policy.status = status;
    const updatedPolicy = await policy.save();



    // console.log(
    //   "Policy status updated:",
    //   updatedPolicy._id,
    //   updatedPolicy.status
    // )


    return res
      .status(200)
      .json({ message: "Status updated successfully", policy: updatedPolicy });
  } catch (error) {
    console.error("Error updating policy status:", error);
    return res
      .status(500)
      .json({ message: "Failed to update status", error: error.message });
  }
};









//20-05-2025
// import AllInsurance from "../../models/masterDetails/masterdetailSchema.js";

// export const policydata = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;
//     const year = req.query.year || null;
//     const month = req.query.month || null;
//     const policyNo = req.query.policyNo || null;
//     const status = req.query.status || null;

//     const baseQuery = {};
//     if (year || month) {
//       baseQuery.policyEndDate = {
//         $regex: `^${year || "\\d{4}"}-${month || "\\d{2}"}`,
//         $options: "i",
//       };
//     }
//     if (policyNo) {
//       baseQuery.policyNo = {
//         $regex: policyNo,
//         $options: "i",
//       };
//     }
//     if (status) {
//       baseQuery.status = status;
//     }



//     const [totalPolicies, allPolicies] = await Promise.all([
//       AllInsurance.countDocuments(baseQuery),
//       AllInsurance.find(baseQuery).skip(skip).limit(limit),
//     ]);

//     return res.status(200).json({
//       allPolicies,
//       totalPolicies,
//       pagination: {
//         currentPage: page,
//         totalPages: Math.ceil(totalPolicies / limit),
//         itemsPerPage: limit,
//         totalItems: totalPolicies,
//       },
//     });
//   } catch (error) {
//     console.error("Error getting insurance list:", error);
//     return res.status(500).json({
//       status: "Error during Insurance List Update",
//       message: error.message,
//     });
//   }
// };


// export const updatePolicyStatus = async (req, res) => {
//   try {
//     const { policyId, status } = req.body;
//     console.log("Updating policy status:", { policyId, status }); // Debug log

//     if (!policyId || !status) {
//       console.error("Missing policyId or status");
//       return res
//         .status(400)
//         .json({ message: "Policy ID and status are required" });
//     }

//     const validStatuses = [
//       "Renewed",
//       "Loss to Competitor",
//       "Vehicle Sold",
//       "Active",
//     ];
//     if (!validStatuses.includes(status)) {
//       console.error("Invalid status:", status);
//       return res
//         .status(400)
//         .json({
//           message: `Invalid status value. Must be one of: ${validStatuses.join(
//             ", "
//           )}`,
//         });
//     }

//     const policy = await AllInsurance.findById(policyId);
//     if (!policy) {
//       console.error("Policy not found:", policyId);
//       return res.status(404).json({ message: "Policy not found" });
//     }

//     policy.status = status;
//     const updatedPolicy = await policy.save();

//     console.log(
//       "Policy status updated:",
//       updatedPolicy._id,
//       updatedPolicy.status
//     );
//     return res
//       .status(200)
//       .json({ message: "Status updated successfully", policy: updatedPolicy });
//   } catch (error) {
//     console.error("Error updating policy status:", error);
//     return res
//       .status(500)
//       .json({ message: "Failed to update status", error: error.message });
//   }
// };






// shad code server pe update hua hai

// import AllInsurance from "../../models/masterDetails/masterdetailSchema.js";

// export const policydata = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;
//     const year = req.query.year || null;
//     const month = req.query.month || null;
//     const policyNo = req.query.policyNo || null;

//     // Base query for filtered policies
//     const baseQuery = {};
//     if (year || month) {
//       baseQuery.policyEndDate = {
//         $regex: `^${year || "\\d{4}"}-${month || "\\d{2}"}`,
//         $options: "i",
//       };
//     }
//     if (policyNo) {
//       baseQuery.policyNo = {
//         $regex: policyNo,
//         $options: "i",
//       };
//     }

//     // Execute queries
//     const [totalPolicies, allPolicies] = await Promise.all([
//       AllInsurance.countDocuments(baseQuery),
//       AllInsurance.find(baseQuery).skip(skip).limit(limit),
//     ]);

//     return res.status(200).json({
//       allPolicies,
//       totalPolicies,
//       pagination: {
//         currentPage: page,
//         totalPages: Math.ceil(totalPolicies / limit),
//         itemsPerPage: limit,
//         totalItems: totalPolicies,
//       },
//     });
//   } catch (error) {
//     console.error("Error getting insurance list:", error);
//     return res.status(500).json({
//       status: "Error during Insurance List Update",
//       message: error.message,
//     });
//   }
// };

//333
// import AllInsurance from "../../models/masterDetails/masterdetailSchema.js";

// export const policydata = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;
//     const year = req.query.year || null;
//     const month = req.query.month || null;

//     // Base query for filtered policies
//     const baseQuery = {};
//     if (year || month) {
//       baseQuery.policyEndDate = {
//         $regex: `^${year || "\\d{4}"}-${month || "\\d{2}"}`,
//         $options: "i",
//       };
//     }

//     // Execute queries
//     const [totalPolicies, allPolicies] = await Promise.all([
//       AllInsurance.countDocuments(baseQuery),
//       AllInsurance.find(baseQuery).skip(skip).limit(limit),
//     ]);

//     return res.status(200).json({
//       allPolicies,
//       totalPolicies,
//       pagination: {
//         currentPage: page,
//         totalPages: Math.ceil(totalPolicies / limit),
//         itemsPerPage: limit,
//         totalItems: totalPolicies,
//       },
//     });
//   } catch (error) {
//     console.error("Error getting insurance list:", error);
//     return res.status(500).json({
//       status: "Error during Insurance List Update",
//       message: error.message,
//     });
//   }
// };

//888

// import AllInsurance from "../../models/masterDetails/masterdetailSchema.js";

// export const policydata = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;
//     const segment = req.query.segment || null;
//     const startDate = req.query.startDate || null;
//     const endDate = req.query.endDate || null;
//     const year = req.query.year || null;
//     const month = req.query.month || null;

//     const formatDate = (date) => date.toISOString().split("T")[0];

//     // Unfiltered date ranges for expiring policies (always current month and next 7 days)
//     const now = new Date();
//     const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
//     const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
//     const nextWeekStart = new Date(now);
//     nextWeekStart.setDate(now.getDate() + 1);
//     const nextWeekEnd = new Date(now);
//     nextWeekEnd.setDate(now.getDate() + 7);

//     const currentMonthStartStr = formatDate(currentMonthStart);
//     const currentMonthEndStr = formatDate(currentMonthEnd);
//     const nextWeekStartStr = formatDate(nextWeekStart);
//     const nextWeekEndStr = formatDate(nextWeekEnd);

//     // Base query for filtered policies (allPolicies and net premiums)
//     const baseQuery = {};
//     if (segment) baseQuery.segment = segment;
//     if (startDate || endDate) {
//       baseQuery.policyEndDate = {};
//       if (startDate) baseQuery.policyEndDate.$gte = startDate;
//       if (endDate) baseQuery.policyEndDate.$lte = endDate;
//     }

//     // Queries for unfiltered expiring policies
//     const monthlyExpiringQuery = {
//       policyEndDate: {
//         $gte: currentMonthStartStr,
//         $lte: currentMonthEndStr,
//       },
//     };
//     const weeklyExpiringQuery = {
//       policyEndDate: {
//         $gte: nextWeekStartStr,
//         $lte: nextWeekEndStr,
//       },
//     };

//     // Execute queries
//     const [
//       totalPolicies,
//       allPolicies,
//       monthlyExpiring,
//       weeklyExpiring,
//       segments,
//       totalNetPremiumResult,
//       monthlyExpiringCount,
//       weeklyExpiringCount,
//     ] = await Promise.all([
//       AllInsurance.countDocuments(baseQuery),
//       AllInsurance.find(baseQuery).skip(skip).limit(limit),
//       AllInsurance.find(monthlyExpiringQuery).limit(100),
//       AllInsurance.find(weeklyExpiringQuery).limit(100),
//       AllInsurance.distinct("segment"),
//       AllInsurance.aggregate([{ $match: baseQuery }, { $group: { _id: null, total: { $sum: "$netPremium" } } }]),
//       AllInsurance.countDocuments(monthlyExpiringQuery),
//       AllInsurance.countDocuments(weeklyExpiringQuery),
//     ]);

//     const totalNetPremium = totalNetPremiumResult.length > 0 ? totalNetPremiumResult[0].total : 0;

//     let yearlyNetPremium = 0;
//     if (year) {
//       const yearlyQuery = {
//         policyEndDate: {
//           $gte: `${year}-01-01`,
//           $lte: `${year}-12-31`,
//         },
//         ...baseQuery,
//       };
//       const yearlyResult = await AllInsurance.aggregate([
//         { $match: yearlyQuery },
//         { $group: { _id: null, total: { $sum: "$netPremium" } } },
//       ]);
//       yearlyNetPremium = yearlyResult.length > 0 ? yearlyResult[0].total : 0;
//     } else {
//       yearlyNetPremium = totalNetPremium;
//     }

//     let monthlyNetPremium = 0;
//     if (year && month) {
//       const monthlyQuery = {
//         policyEndDate: {
//           $gte: `${year}-${month}-01`,
//           $lte: `${year}-${month}-${new Date(year, parseInt(month), 0).getDate()}`,
//         },
//         ...baseQuery,
//       };
//       const monthlyResult = await AllInsurance.aggregate([
//         { $match: monthlyQuery },
//         { $group: { _id: null, total: { $sum: "$netPremium" } } },
//       ]);
//       monthlyNetPremium = monthlyResult.length > 0 ? monthlyResult[0].total : 0;
//     } else {
//       monthlyNetPremium = totalNetPremium;
//     }

//     return res.status(200).json({
//       monthlyExpiring,
//       weeklyExpiring,
//       allPolicies,
//       totalPolicies,
//       monthlyExpiringCount,
//       weeklyExpiringCount,
//       currentMonthRange: {
//         start: currentMonthStartStr,
//         end: currentMonthEndStr,
//       },
//       nextWeekRange: {
//         start: nextWeekStartStr,
//         end: nextWeekEndStr,
//       },
//       pagination: {
//         currentPage: page,
//         totalPages: Math.ceil(totalPolicies / limit),
//         itemsPerPage: limit,
//         totalItems: totalPolicies,
//       },
//       segments,
//       yearlyNetPremium,
//       monthlyNetPremium,
//       totalNetPremium,
//     });
//   } catch (error) {
//     console.error("Error getting insurance list:", error);
//     return res.status(500).json({
//       status: "Error during Insurance List Update",
//       message: error.message,
//     });
//   }
// };

//999
// import AllInsurance from "../../models/masterDetails/masterdetailSchema.js";

// export const policydata = async (req, res) => {
//   try {
//     // Get pagination and filtering parameters from query
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;
//     const segment = req.query.segment || null;
//     const startDate = req.query.startDate || null;
//     const endDate = req.query.endDate || null;
//     const year = req.query.year || null;
//     const month = req.query.month || null;

//     // Format dates to YYYY-MM-DD
//     const formatDate = (date) => date.toISOString().split('T')[0];

//     // Current date-based ranges for expiring policies
//     const now = new Date();
//     const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
//     const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
//     const nextWeekStart = new Date(now);
//     nextWeekStart.setDate(now.getDate() + 1); // Tomorrow
//     const nextWeekEnd = new Date(now);
//     nextWeekEnd.setDate(now.getDate() + 7); // 7 days from now

//     const currentMonthStartStr = formatDate(currentMonthStart);
//     const currentMonthEndStr = formatDate(currentMonthEnd);
//     const nextWeekStartStr = formatDate(nextWeekStart);
//     const nextWeekEndStr = formatDate(nextWeekEnd);

//     // Base query for filtering allPolicies
//     const baseQuery = {};

//     if (segment) baseQuery.segment = segment;

//     // Add year and month filtering for allPolicies
//     if (year || month) {
//       baseQuery.policyEndDate = {};
//       if (year) {
//         baseQuery.policyEndDate.$gte = `${year}-01-01`;
//         baseQuery.policyEndDate.$lte = `${year}-12-31`;
//       }
//       if (month && year) {
//         baseQuery.policyEndDate.$gte = `${year}-${month}-01`;
//         const lastDay = new Date(year, parseInt(month), 0).getDate();
//         baseQuery.policyEndDate.$lte = `${year}-${month}-${lastDay}`;
//       }
//     }

//     // Add date range filtering if provided
//     if (startDate || endDate) {
//       baseQuery.policyEndDate = baseQuery.policyEndDate || {};
//       if (startDate) baseQuery.policyEndDate.$gte = startDate;
//       if (endDate) baseQuery.policyEndDate.$lte = endDate;
//     }

//     // Get total count of all policies
//     const totalPolicies = await AllInsurance.countDocuments(baseQuery);

//     // Get paginated policies
//     const allPolicies = await AllInsurance.find(baseQuery).skip(skip).limit(limit);

//     // Calculate total netPremium for filtered allPolicies
//     const totalNetPremiumResult = await AllInsurance.aggregate([
//       { $match: baseQuery },
//       { $group: { _id: null, total: { $sum: "$netPremium" } } }
//     ]);
//     const totalNetPremium = totalNetPremiumResult.length > 0 ? totalNetPremiumResult[0].total : 0;

//     // Monthly expiring query (always current month)
//     const monthlyExpiringQuery = {
//       policyEndDate: {
//         $gte: currentMonthStartStr,
//         $lte: currentMonthEndStr
//       }
//     };
//     if (segment) monthlyExpiringQuery.segment = segment;

//     const monthlyExpiring = await AllInsurance.find(monthlyExpiringQuery).limit(limit);
//     const monthlyExpiringCount = await AllInsurance.countDocuments(monthlyExpiringQuery);

//     // Weekly expiring query (always next 7 days)
//     const weeklyExpiringQuery = {
//       policyEndDate: {
//         $gte: nextWeekStartStr,
//         $lte: nextWeekEndStr
//       }
//     };
//     if (segment) weeklyExpiringQuery.segment = segment;

//     const weeklyExpiring = await AllInsurance.find(weeklyExpiringQuery).limit(limit);
//     const weeklyExpiringCount = await AllInsurance.countDocuments(weeklyExpiringQuery);

//     // Get all unique segments
//     const segments = await AllInsurance.distinct("segment");

//     // Calculate yearlyNetPremium
//     let yearlyNetPremium = 0;
//     if (year) {
//       const yearlyQuery = {
//         policyEndDate: {
//           $gte: `${year}-01-01`,
//           $lte: `${year}-12-31`
//         }
//       };
//       if (segment) yearlyQuery.segment = segment;
//       if (startDate || endDate) {
//         yearlyQuery.policyEndDate = yearlyQuery.policyEndDate || {};
//         if (startDate) yearlyQuery.policyEndDate.$gte = startDate;
//         if (endDate) yearlyQuery.policyEndDate.$lte = endDate;
//       }

//       const yearlyResult = await AllInsurance.aggregate([
//         { $match: yearlyQuery },
//         { $group: { _id: null, total: { $sum: "$netPremium" } } }
//       ]);
//       yearlyNetPremium = yearlyResult.length > 0 ? yearlyResult[0].total : 0;
//     } else {
//       const allYearlyQuery = { ...baseQuery };
//       const allYearlyResult = await AllInsurance.aggregate([
//         { $match: allYearlyQuery },
//         { $group: { _id: null, total: { $sum: "$netPremium" } } }
//       ]);
//       yearlyNetPremium = allYearlyResult.length > 0 ? allYearlyResult[0].total : 0;
//     }

//     // Calculate monthlyNetPremium
//     let monthlyNetPremium = 0;
//     if (year && month) {
//       const monthlyQuery = {
//         policyEndDate: {
//           $gte: `${year}-${month}-01`,
//           $lte: `${year}-${month}-${new Date(year, parseInt(month), 0).getDate()}`
//         }
//       };
//       if (segment) monthlyQuery.segment = segment;
//       if (startDate || endDate) {
//         monthlyQuery.policyEndDate = monthlyQuery.policyEndDate || {};
//         if (startDate) monthlyQuery.policyEndDate.$gte = startDate;
//         if (endDate) monthlyQuery.policyEndDate.$lte = endDate;
//       }

//       const monthlyResult = await AllInsurance.aggregate([
//         { $match: monthlyQuery },
//         { $group: { _id: null, total: { $sum: "$netPremium" } } }
//       ]);
//       monthlyNetPremium = monthlyResult.length > 0 ? monthlyResult[0].total : 0;
//     } else if (year) {
//       const yearOnlyQuery = {
//         policyEndDate: {
//           $gte: `${year}-01-01`,
//           $lte: `${year}-12-31`
//         }
//       };
//       if (segment) yearOnlyQuery.segment = segment;
//       if (startDate || endDate) {
//         yearOnlyQuery.policyEndDate = yearOnlyQuery.policyEndDate || {};
//         if (startDate) yearOnlyQuery.policyEndDate.$gte = startDate;
//         if (endDate) yearOnlyQuery.policyEndDate.$lte = endDate;
//       }

//       const yearOnlyResult = await AllInsurance.aggregate([
//         { $match: yearOnlyQuery },
//         { $group: { _id: null, total: { $sum: "$netPremium" } } }
//       ]);
//       monthlyNetPremium = yearOnlyResult.length > 0 ? yearOnlyResult[0].total : 0;
//     } else {
//       const allMonthlyQuery = { ...baseQuery };
//       const allMonthlyResult = await AllInsurance.aggregate([
//         { $match: allMonthlyQuery },
//         { $group: { _id: null, total: { $sum: "$netPremium" } } }
//       ]);
//       monthlyNetPremium = allMonthlyResult.length > 0 ? allMonthlyResult[0].total : 0;
//     }

//     return res.status(200).json({
//       monthlyExpiring,
//       weeklyExpiring,
//       allPolicies,
//       totalPolicies,
//       monthlyExpiringCount,
//       weeklyExpiringCount,
//       currentMonthRange: {
//         start: currentMonthStartStr,
//         end: currentMonthEndStr
//       },
//       nextWeekRange: {
//         start: nextWeekStartStr,
//         end: nextWeekEndStr
//       },
//       pagination: {
//         currentPage: page,
//         totalPages: Math.ceil(totalPolicies / limit),
//         itemsPerPage: limit,
//         totalItems: totalPolicies
//       },
//       segments,
//       yearlyNetPremium,
//       monthlyNetPremium,
//       totalNetPremium
//     });
//   } catch (error) {
//     console.error("Error getting insurance list:", error);
//     return res.status(500).json({
//       status: "Error during Insurance List Update",
//       message: error.message,
//     });
//   }
// };

//444
// import AllInsurance from "../../models/masterDetails/masterdetailSchema.js";

// export const policydata = async (req, res) => {
//   try {
//     // Get pagination and filtering parameters from query
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;
//     const segment = req.query.segment || null;
//     const startDate = req.query.startDate || null;
//     const endDate = req.query.endDate || null;
//     const year = req.query.year || null;
//     const month = req.query.month || null;

//     // Format dates to YYYY-MM-DD
//     const formatDate = (date) => date.toISOString().split('T')[0];

//     // Determine date ranges for monthly and weekly expiring policies
//     let monthlyStart, monthlyEnd, weeklyStart, weeklyEnd;

//     if (year && month) {
//       // Use selected year and month
//       monthlyStart = new Date(year, parseInt(month) - 1, 1);
//       monthlyEnd = new Date(year, parseInt(month), 0);
//       weeklyStart = new Date(year, parseInt(month) - 1, 1);
//       weeklyEnd = new Date(year, parseInt(month) - 1, 7);
//     } else if (year) {
//       // Use full year
//       monthlyStart = new Date(year, 0, 1);
//       monthlyEnd = new Date(year, 11, 31);
//       weeklyStart = new Date(year, 0, 1);
//       weeklyEnd = new Date(year, 0, 7);
//     } else if (startDate && endDate) {
//       // Use startDate and endDate for monthly and weekly
//       monthlyStart = new Date(startDate);
//       monthlyEnd = new Date(endDate);
//       weeklyStart = new Date(startDate);
//       weeklyEnd = new Date(startDate);
//       weeklyEnd.setDate(weeklyStart.getDate() + 6); // 7-day range from startDate
//       if (weeklyEnd > monthlyEnd) weeklyEnd = monthlyEnd; // Ensure weekly doesn't exceed endDate
//     } else {
//       // Default to current month and next 7 days
//       const now = new Date();
//       monthlyStart = new Date(now.getFullYear(), now.getMonth(), 1);
//       monthlyEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
//       weeklyStart = new Date(now);
//       weeklyStart.setDate(now.getDate() + 1); // Tomorrow
//       weeklyEnd = new Date(now);
//       weeklyEnd.setDate(now.getDate() + 7); // 7 days from now
//     }

//     const monthlyStartStr = formatDate(monthlyStart);
//     const monthlyEndStr = formatDate(monthlyEnd);
//     const weeklyStartStr = formatDate(weeklyStart);
//     const weeklyEndStr = formatDate(weeklyEnd);

//     // Base query for filtering
//     const baseQuery = {};

//     if (segment) baseQuery.segment = segment;

//     // Add year and month filtering for allPolicies
//     if (year || month) {
//       baseQuery.policyEndDate = {};
//       if (year) {
//         baseQuery.policyEndDate.$gte = `${year}-01-01`;
//         baseQuery.policyEndDate.$lte = `${year}-12-31`;
//       }
//       if (month && year) {
//         baseQuery.policyEndDate.$gte = `${year}-${month}-01`;
//         const lastDay = new Date(year, parseInt(month), 0).getDate();
//         baseQuery.policyEndDate.$lte = `${year}-${month}-${lastDay}`;
//       }
//     }

//     // Add date range filtering if provided
//     if (startDate || endDate) {
//       baseQuery.policyEndDate = baseQuery.policyEndDate || {};
//       if (startDate) baseQuery.policyEndDate.$gte = startDate;
//       if (endDate) baseQuery.policyEndDate.$lte = endDate;
//     }

//     // Get total count of all policies
//     const totalPolicies = await AllInsurance.countDocuments(baseQuery);

//     // Get paginated policies
//     const allPolicies = await AllInsurance.find(baseQuery).skip(skip).limit(limit);

//     // Monthly expiring query
//     const monthlyExpiringQuery = {
//       policyEndDate: {
//         $gte: monthlyStartStr,
//         $lte: monthlyEndStr
//       }
//     };
//     if (segment) monthlyExpiringQuery.segment = segment;
//     if (startDate || endDate) {
//       monthlyExpiringQuery.policyEndDate = monthlyExpiringQuery.policyEndDate || {};
//       if (startDate) monthlyExpiringQuery.policyEndDate.$gte = startDate;
//       if (endDate) monthlyExpiringQuery.policyEndDate.$lte = endDate;
//     }

//     const monthlyExpiring = await AllInsurance.find(monthlyExpiringQuery).limit(limit);
//     const monthlyExpiringCount = await AllInsurance.countDocuments(monthlyExpiringQuery);

//     // Weekly expiring query
//     const weeklyExpiringQuery = {
//       policyEndDate: {
//         $gte: weeklyStartStr,
//         $lte: weeklyEndStr
//       }
//     };
//     if (segment) weeklyExpiringQuery.segment = segment;
//     if (startDate || endDate) {
//       weeklyExpiringQuery.policyEndDate = weeklyExpiringQuery.policyEndDate || {};
//       if (startDate) weeklyExpiringQuery.policyEndDate.$gte = startDate;
//       if (endDate) weeklyExpiringQuery.policyEndDate.$lte = endDate;
//     }

//     const weeklyExpiring = await AllInsurance.find(weeklyExpiringQuery).limit(limit);
//     const weeklyExpiringCount = await AllInsurance.countDocuments(weeklyExpiringQuery);

//     // Get all unique segments
//     const segments = await AllInsurance.distinct("segment");

//     // Calculate netPremium for selected year
//     let yearlyNetPremium = 0;
//     if (year) {
//       const yearlyQuery = {
//         policyEndDate: {
//           $gte: `${year}-01-01`,
//           $lte: `${year}-12-31`
//         }
//       };
//       if (segment) yearlyQuery.segment = segment;
//       if (startDate || endDate) {
//         yearlyQuery.policyEndDate = yearlyQuery.policyEndDate || {};
//         if (startDate) yearlyQuery.policyEndDate.$gte = startDate;
//         if (endDate) yearlyQuery.policyEndDate.$lte = endDate;
//       }

//       const yearlyResult = await AllInsurance.aggregate([
//         { $match: yearlyQuery },
//         { $group: { _id: null, total: { $sum: "$netPremium" } } }
//       ]);
//       yearlyNetPremium = yearlyResult.length > 0 ? yearlyResult[0].total : 0;
//     } else {
//       // Calculate for all policies if no year is selected
//       const allYearlyQuery = { ...baseQuery };
//       const allYearlyResult = await AllInsurance.aggregate([
//         { $match: allYearlyQuery },
//         { $group: { _id: null, total: { $sum: "$netPremium" } } }
//       ]);
//       yearlyNetPremium = allYearlyResult.length > 0 ? allYearlyResult[0].total : 0;
//     }

//     // Calculate netPremium for selected month
//     let monthlyNetPremium = 0;
//     if (year && month) {
//       const monthlyQuery = {
//         policyEndDate: {
//           $gte: `${year}-${month}-01`,
//           $lte: `${year}-${month}-${new Date(year, parseInt(month), 0).getDate()}`
//         }
//       };
//       if (segment) monthlyQuery.segment = segment;
//       if (startDate || endDate) {
//         monthlyQuery.policyEndDate = monthlyQuery.policyEndDate || {};
//         if (startDate) monthlyQuery.policyEndDate.$gte = startDate;
//         if (endDate) monthlyQuery.policyEndDate.$lte = endDate;
//       }

//       const monthlyResult = await AllInsurance.aggregate([
//         { $match: monthlyQuery },
//         { $group: { _id: null, total: { $sum: "$netPremium" } } }
//       ]);
//       monthlyNetPremium = monthlyResult.length > 0 ? monthlyResult[0].total : 0;
//     } else if (year) {
//       // Calculate for entire year if only year is selected
//       const yearOnlyQuery = {
//         policyEndDate: {
//           $gte: `${year}-01-01`,
//           $lte: `${year}-12-31`
//         }
//       };
//       if (segment) yearOnlyQuery.segment = segment;
//       if (startDate || endDate) {
//         yearOnlyQuery.policyEndDate = yearOnlyQuery.policyEndDate || {};
//         if (startDate) yearOnlyQuery.policyEndDate.$gte = startDate;
//         if (endDate) yearOnlyQuery.policyEndDate.$lte = endDate;
//       }

//       const yearOnlyResult = await AllInsurance.aggregate([
//         { $match: yearOnlyQuery },
//         { $group: { _id: null, total: { $sum: "$netPremium" } } }
//       ]);
//       monthlyNetPremium = yearOnlyResult.length > 0 ? yearOnlyResult[0].total : 0;
//     } else {
//       // Calculate for all policies if no year/month is selected
//       const allMonthlyQuery = { ...baseQuery };
//       const allMonthlyResult = await AllInsurance.aggregate([
//         { $match: allMonthlyQuery },
//         { $group: { _id: null, total: { $sum: "$netPremium" } } }
//       ]);
//       monthlyNetPremium = allMonthlyResult.length > 0 ? allMonthlyResult[0].total : 0;
//     }

//     return res.status(200).json({
//       monthlyExpiring,
//       weeklyExpiring,
//       allPolicies,
//       totalPolicies,
//       monthlyExpiringCount,
//       weeklyExpiringCount,
//       currentMonthRange: {
//         start: monthlyStartStr,
//         end: monthlyEndStr
//       },
//       nextWeekRange: {
//         start: weeklyStartStr,
//         end: weeklyEndStr
//       },
//       pagination: {
//         currentPage: page,
//         totalPages: Math.ceil(totalPolicies / limit),
//         itemsPerPage: limit,
//         totalItems: totalPolicies
//       },
//       segments,
//       yearlyNetPremium,
//       monthlyNetPremium
//     });
//   } catch (error) {
//     console.error("Error getting insurance list:", error);
//     return res.status(500).json({
//       status: "Error during Insurance List Update",
//       message: error.message,
//     });
//   }
// };

// import AllInsurance from "../../models/masterDetails/masterdetailSchema.js";

// export const policydata = async (req, res) => {
//   try {
//     // Get pagination and filtering parameters from query
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;
//     const segment = req.query.segment || null;
//     const startDate = req.query.startDate || null;
//     const endDate = req.query.endDate || null;
//     const year = req.query.year || null;
//     const month = req.query.month || null;

//     // Get current month's start and end dates
//     const now = new Date();
//     const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
//     const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

//     // Get next week's dates (7 days from now)
//     const nextWeekStart = new Date(now);
//     nextWeekStart.setDate(now.getDate() + 1); // Tomorrow
//     const nextWeekEnd = new Date(now);
//     nextWeekEnd.setDate(now.getDate() + 7); // 7 days from now

//     // Format dates to YYYY-MM-DD
//     const formatDate = (date) => date.toISOString().split('T')[0];

//     const startDateStr = formatDate(currentMonthStart);
//     const endDateStr = formatDate(currentMonthEnd);
//     const nextWeekStartStr = formatDate(nextWeekStart);
//     const nextWeekEndStr = formatDate(nextWeekEnd);

//     // Base query for filtering
//     const baseQuery = {};

//     if (segment) baseQuery.segment = segment;

//     // Add year and month filtering
//     if (year || month) {
//       baseQuery.policyEndDate = {};
//       if (year) {
//         baseQuery.policyEndDate.$gte = `${year}-01-01`;
//         baseQuery.policyEndDate.$lte = `${year}-12-31`;
//       }
//       if (month && year) {
//         baseQuery.policyEndDate.$gte = `${year}-${month}-01`;
//         const lastDay = new Date(year, parseInt(month), 0).getDate();
//         baseQuery.policyEndDate.$lte = `${year}-${month}-${lastDay}`;
//       }
//     }

//     // Add date range filtering if provided
//     if (startDate || endDate) {
//       baseQuery.policyEndDate = baseQuery.policyEndDate || {};
//       if (startDate) baseQuery.policyEndDate.$gte = startDate;
//       if (endDate) baseQuery.policyEndDate.$lte = endDate;
//     }

//     // Get total count of all policies (with filters if applied)
//     const totalPolicies = await AllInsurance.countDocuments(baseQuery);

//     // Get paginated policies (with filters if applied)
//     const allPolicies = await AllInsurance.find(baseQuery).skip(skip).limit(limit);

//     // Get monthly expiring policies (with filters)
//     const monthlyExpiringQuery = {
//       policyEndDate: {
//         $gte: startDateStr,
//         $lte: endDateStr
//       }
//     };
//     if (segment) monthlyExpiringQuery.segment = segment;
//     if (year || month) {
//       monthlyExpiringQuery.policyEndDate = monthlyExpiringQuery.policyEndDate || {};
//       if (year) {
//         monthlyExpiringQuery.policyEndDate.$gte = `${year}-01-01`;
//         monthlyExpiringQuery.policyEndDate.$lte = `${year}-12-31`;
//       }
//       if (month && year) {
//         monthlyExpiringQuery.policyEndDate.$gte = `${year}-${month}-01`;
//         const lastDay = new Date(year, parseInt(month), 0).getDate();
//         monthlyExpiringQuery.policyEndDate.$lte = `${year}-${month}-${lastDay}`;
//       }
//     }
//     if (startDate || endDate) {
//       monthlyExpiringQuery.policyEndDate = monthlyExpiringQuery.policyEndDate || {};
//       if (startDate) monthlyExpiringQuery.policyEndDate.$gte = startDate;
//       if (endDate) monthlyExpiringQuery.policyEndDate.$lte = endDate;
//     }

//     const monthlyExpiring = await AllInsurance.find(monthlyExpiringQuery).limit(limit);

//     // Get weekly expiring policies (with filters)
//     const weeklyExpiringQuery = {
//       policyEndDate: {
//         $gte: nextWeekStartStr,
//         $lte: nextWeekEndStr
//       }
//     };
//     if (segment) weeklyExpiringQuery.segment = segment;
//     if (year || month) {
//       weeklyExpiringQuery.policyEndDate = weeklyExpiringQuery.policyEndDate || {};
//       if (year) {
//         weeklyExpiringQuery.policyEndDate.$gte = `${year}-01-01`;
//         weeklyExpiringQuery.policyEndDate.$lte = `${year}-12-31`;
//       }
//       if (month && year) {
//         weeklyExpiringQuery.policyEndDate.$gte = `${year}-${month}-01`;
//         const lastDay = new Date(year, parseInt(month), 0).getDate();
//         weeklyExpiringQuery.policyEndDate.$lte = `${year}-${month}-${lastDay}`;
//       }
//     }
//     if (startDate || endDate) {
//       weeklyExpiringQuery.policyEndDate = weeklyExpiringQuery.policyEndDate || {};
//       if (startDate) weeklyExpiringQuery.policyEndDate.$gte = startDate;
//       if (endDate) weeklyExpiringQuery.policyEndDate.$lte = endDate;
//     }

//     const weeklyExpiring = await AllInsurance.find(weeklyExpiringQuery).limit(limit);

//     // Get counts for expiring policies
//     const monthlyExpiringCount = await AllInsurance.countDocuments(monthlyExpiringQuery);
//     const weeklyExpiringCount = await AllInsurance.countDocuments(weeklyExpiringQuery);

//     // Get all unique segments for filter dropdown
//     const segments = await AllInsurance.distinct("segment");

//     // Calculate netPremium for selected year
//     let yearlyNetPremium = 0;
//     if (year) {
//       const yearlyQuery = {
//         policyEndDate: {
//           $gte: `${year}-01-01`,
//           $lte: `${year}-12-31`
//         }
//       };
//       if (segment) yearlyQuery.segment = segment;
//       if (startDate || endDate) {
//         yearlyQuery.policyEndDate = yearlyQuery.policyEndDate || {};
//         if (startDate) yearlyQuery.policyEndDate.$gte = startDate;
//         if (endDate) yearlyQuery.policyEndDate.$lte = endDate;
//       }

//       const yearlyResult = await AllInsurance.aggregate([
//         { $match: yearlyQuery },
//         { $group: { _id: null, total: { $sum: "$netPremium" } } }
//       ]);
//       yearlyNetPremium = yearlyResult.length > 0 ? yearlyResult[0].total : 0;
//     } else {
//       // Calculate for all policies if no year is selected
//       const allYearlyQuery = { ...baseQuery };
//       const allYearlyResult = await AllInsurance.aggregate([
//         { $match: allYearlyQuery },
//         { $group: { _id: null, total: { $sum: "$netPremium" } } }
//       ]);
//       yearlyNetPremium = allYearlyResult.length > 0 ? allYearlyResult[0].total : 0;
//     }

//     // Calculate netPremium for selected month
//     let monthlyNetPremium = 0;
//     if (year && month) {
//       const monthlyQuery = {
//         policyEndDate: {
//           $gte: `${year}-${month}-01`,
//           $lte: `${year}-${month}-${new Date(year, parseInt(month), 0).getDate()}`
//         }
//       };
//       if (segment) monthlyQuery.segment = segment;
//       if (startDate || endDate) {
//         monthlyQuery.policyEndDate = monthlyQuery.policyEndDate || {};
//         if (startDate) monthlyQuery.policyEndDate.$gte = startDate;
//         if (endDate) monthlyQuery.policyEndDate.$lte = endDate;
//       }

//       const monthlyResult = await AllInsurance.aggregate([
//         { $match: monthlyQuery },
//         { $group: { _id: null, total: { $sum: "$netPremium" } } }
//       ]);
//       monthlyNetPremium = monthlyResult.length > 0 ? monthlyResult[0].total : 0;
//     } else if (year) {
//       // Calculate for entire year if only year is selected
//       const yearOnlyQuery = {
//         policyEndDate: {
//           $gte: `${year}-01-01`,
//           $lte: `${year}-12-31`
//         }
//       };
//       if (segment) yearOnlyQuery.segment = segment;
//       if (startDate || endDate) {
//         yearOnlyQuery.policyEndDate = yearOnlyQuery.policyEndDate || {};
//         if (startDate) yearOnlyQuery.policyEndDate.$gte = startDate;
//         if (endDate) yearOnlyQuery.policyEndDate.$lte = endDate;
//       }

//       const yearOnlyResult = await AllInsurance.aggregate([
//         { $match: yearOnlyQuery },
//         { $group: { _id: null, total: { $sum: "$netPremium" } } }
//       ]);
//       monthlyNetPremium = yearOnlyResult.length > 0 ? yearOnlyResult[0].total : 0;
//     } else {
//       // Calculate for all policies if no year/month is selected
//       const allMonthlyQuery = { ...baseQuery };
//       const allMonthlyResult = await AllInsurance.aggregate([
//         { $match: allMonthlyQuery },
//         { $group: { _id: null, total: { $sum: "$netPremium" } } }
//       ]);
//       monthlyNetPremium = allMonthlyResult.length > 0 ? allMonthlyResult[0].total : 0;
//     }

//     return res.status(200).json({
//       monthlyExpiring,
//       weeklyExpiring,
//       allPolicies,
//       totalPolicies,
//       monthlyExpiringCount,
//       weeklyExpiringCount,
//       currentMonthRange: {
//         start: startDateStr,
//         end: endDateStr
//       },
//       nextWeekRange: {
//         start: nextWeekStartStr,
//         end: nextWeekEndStr
//       },
//       pagination: {
//         currentPage: page,
//         totalPages: Math.ceil(totalPolicies / limit),
//         itemsPerPage: limit,
//         totalItems: totalPolicies
//       },
//       segments,
//       yearlyNetPremium,
//       monthlyNetPremium
//     });
//   } catch (error) {
//     console.error("Error getting insurance list:", error);
//     return res.status(500).json({
//       status: "Error during Insurance List Update",
//       message: error.message,
//     });
//   }
// };

//111
// import AllInsurance from "../../models/masterDetails/masterdetailSchema.js";

// export const policydata = async (req, res) => {
//   try {
//     // Get pagination and filtering parameters from query
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;
//     const segment = req.query.segment || null;
//     const startDate = req.query.startDate || null;
//     const endDate = req.query.endDate || null;
//     const year = req.query.year || null;
//     const month = req.query.month || null;

//     // Get current month's start and end dates
//     const now = new Date();
//     const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
//     const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

//     // Get next week's dates (7 days from now)
//     const nextWeekStart = new Date(now);
//     nextWeekStart.setDate(now.getDate() + 1); // Tomorrow
//     const nextWeekEnd = new Date(now);
//     nextWeekEnd.setDate(now.getDate() + 7); // 7 days from now

//     // Format dates to YYYY-MM-DD
//     const formatDate = (date) => date.toISOString().split('T')[0];

//     const startDateStr = formatDate(currentMonthStart);
//     const endDateStr = formatDate(currentMonthEnd);
//     const nextWeekStartStr = formatDate(nextWeekStart);
//     const nextWeekEndStr = formatDate(nextWeekEnd);

//     // Base query for filtering
//     const baseQuery = {};

//     if (segment) baseQuery.segment = segment;

//     // Add date range filtering if provided
//     if (startDate || endDate) {
//       baseQuery.policyEndDate = {};
//       if (startDate) baseQuery.policyEndDate.$gte = startDate;
//       if (endDate) baseQuery.policyEndDate.$lte = endDate;
//     }

//     // Get total count of all policies (with filters if applied)
//     const totalPolicies = await AllInsurance.countDocuments(baseQuery);

//     // Get paginated policies (with filters if applied)
//     const allPolicies = await AllInsurance.find(baseQuery).skip(skip).limit(limit);

//     // Filter and flag policies
//     const monthlyExpiring = [];
//     const weeklyExpiring = [];

//     allPolicies.forEach(policy => {
//       if (!policy.policyEndDate) return;

//       const policyEndDate = policy.policyEndDate.split('T')[0];
//       const policyObj = policy.toObject();

//       // Check for monthly expiry
//       if (policyEndDate >= startDateStr && policyEndDate <= endDateStr) {
//         monthlyExpiring.push(policyObj);
//       }

//       // Check for weekly expiry
//       if (policyEndDate >= nextWeekStartStr && policyEndDate <= nextWeekEndStr) {
//         weeklyExpiring.push(policyObj);
//       }
//     });

//     // Get counts for expiring policies (from entire collection, not just current page)
//     const monthlyExpiringQuery = {
//       policyEndDate: {
//         $gte: startDateStr,
//         $lte: endDateStr
//       }
//     };
//     if (segment) monthlyExpiringQuery.segment = segment;
//     if (startDate || endDate) {
//       monthlyExpiringQuery.policyEndDate = {};
//       if (startDate) monthlyExpiringQuery.policyEndDate.$gte = startDate;
//       if (endDate) monthlyExpiringQuery.policyEndDate.$lte = endDate;
//     }

//     const weeklyExpiringQuery = {
//       policyEndDate: {
//         $gte: nextWeekStartStr,
//         $lte: nextWeekEndStr
//       }
//     };
//     if (segment) weeklyExpiringQuery.segment = segment;
//     if (startDate || endDate) {
//       weeklyExpiringQuery.policyEndDate = {};
//       if (startDate) weeklyExpiringQuery.policyEndDate.$gte = startDate;
//       if (endDate) weeklyExpiringQuery.policyEndDate.$lte = endDate;
//     }

//     const monthlyExpiringCount = await AllInsurance.countDocuments(monthlyExpiringQuery);
//     const weeklyExpiringCount = await AllInsurance.countDocuments(weeklyExpiringQuery);

//     // Get all unique segments for filter dropdown
//     const segments = await AllInsurance.distinct("segment");

//     // Calculate netPremium for selected year
//     let yearlyNetPremium = 0;
//     if (year) {
//       const yearlyQuery = {
//         policyEndDate: {
//           $gte: `${year}-01-01`,
//           $lte: `${year}-12-31`
//         }
//       };
//       if (segment) yearlyQuery.segment = segment;
//       if (startDate || endDate) {
//         yearlyQuery.policyEndDate = {};
//         if (startDate) yearlyQuery.policyEndDate.$gte = startDate;
//         if (endDate) yearlyQuery.policyEndDate.$lte = endDate;
//       }

//       const yearlyResult = await AllInsurance.aggregate([
//         { $match: yearlyQuery },
//         { $group: { _id: null, total: { $sum: "$netPremium" } } }
//       ]);
//       yearlyNetPremium = yearlyResult.length > 0 ? yearlyResult[0].total : 0;
//     } else {
//       // Calculate for all policies if no year is selected
//       const allYearlyQuery = { ...baseQuery };
//       const allYearlyResult = await AllInsurance.aggregate([
//         { $match: allYearlyQuery },
//         { $group: { _id: null, total: { $sum: "$netPremium" } } }
//       ]);
//       yearlyNetPremium = allYearlyResult.length > 0 ? allYearlyResult[0].total : 0;
//     }

//     // Calculate netPremium for selected month
//     let monthlyNetPremium = 0;
//     if (year && month) {
//       const monthlyQuery = {
//         policyEndDate: {
//           $gte: `${year}-${month}-01`,
//           $lte: `${year}-${month}-31`
//         }
//       };
//       if (segment) monthlyQuery.segment = segment;
//       if (startDate || endDate) {
//         monthlyQuery.policyEndDate = {};
//         if (startDate) monthlyQuery.policyEndDate.$gte = startDate;
//         if (endDate) monthlyQuery.policyEndDate.$lte = endDate;
//       }

//       const monthlyResult = await AllInsurance.aggregate([
//         { $match: monthlyQuery },
//         { $group: { _id: null, total: { $sum: "$netPremium" } } }
//       ]);
//       monthlyNetPremium = monthlyResult.length > 0 ? monthlyResult[0].total : 0;
//     } else if (year) {
//       // Calculate for entire year if only year is selected
//       const yearOnlyQuery = {
//         policyEndDate: {
//           $gte: `${year}-01-01`,
//           $lte: `${year}-12-31`
//         }
//       };
//       if (segment) yearOnlyQuery.segment = segment;
//       if (startDate || endDate) {
//         yearOnlyQuery.policyEndDate = {};
//         if (startDate) yearOnlyQuery.policyEndDate.$gte = startDate;
//         if (endDate) yearOnlyQuery.policyEndDate.$lte = endDate;
//       }

//       const yearOnlyResult = await AllInsurance.aggregate([
//         { $match: yearOnlyQuery },
//         { $group: { _id: null, total: { $sum: "$netPremium" } } }
//       ]);
//       monthlyNetPremium = yearOnlyResult.length > 0 ? yearOnlyResult[0].total : 0;
//     } else {
//       // Calculate for all policies if no year/month is selected
//       const allMonthlyQuery = { ...baseQuery };
//       const allMonthlyResult = await AllInsurance.aggregate([
//         { $match: allMonthlyQuery },
//         { $group: { _id: null, total: { $sum: "$netPremium" } } }
//       ]);
//       monthlyNetPremium = allMonthlyResult.length > 0 ? allMonthlyResult[0].total : 0;
//     }

//     return res.status(200).json({
//       monthlyExpiring,
//       weeklyExpiring,
//       allPolicies,
//       totalPolicies,
//       monthlyExpiringCount,
//       weeklyExpiringCount,
//       currentMonthRange: {
//         start: startDateStr,
//         end: endDateStr
//       },
//       nextWeekRange: {
//         start: nextWeekStartStr,
//         end: nextWeekEndStr
//       },
//       pagination: {
//         currentPage: page,
//         totalPages: Math.ceil(totalPolicies / limit),
//         itemsPerPage: limit,
//         totalItems: totalPolicies
//       },
//       segments,
//       yearlyNetPremium,
//       monthlyNetPremium
//     });
//   } catch (error) {
//     console.error("Error getting insurance list:", error);
//     return res.status(500).json({
//       status: "Error during Insurance List Update",
//       message: error.message,
//     });
//   }
// };

//222

// import AllInsurance from "../../models/masterDetails/masterdetailSchema.js";

// export const policydata = async (req, res) => {
//   try {
//     // Get pagination and filtering parameters from query
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;
//     const segment = req.query.segment || null;
//     const startDate = req.query.startDate || null;
//     const endDate = req.query.endDate || null;

//     // Get current month's start and end dates
//     const now = new Date();
//     const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
//     const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

//     // Get next week's dates (7 days from now)
//     const nextWeekStart = new Date(now);
//     nextWeekStart.setDate(now.getDate() + 1); // Tomorrow
//     const nextWeekEnd = new Date(now);
//     nextWeekEnd.setDate(now.getDate() + 7); // 7 days from now

//     // Format dates to YYYY-MM-DD
//     const formatDate = (date) => date.toISOString().split('T')[0];

//     const startDateStr = formatDate(currentMonthStart);
//     const endDateStr = formatDate(currentMonthEnd);
//     const nextWeekStartStr = formatDate(nextWeekStart);
//     const nextWeekEndStr = formatDate(nextWeekEnd);

//     // Base query for filtering
//     const baseQuery = {};

//     if (segment) baseQuery.segment = segment;

//     // Add date range filtering if provided
//     if (startDate || endDate) {
//       baseQuery.policyEndDate = {};
//       if (startDate) baseQuery.policyEndDate.$gte = startDate;
//       if (endDate) baseQuery.policyEndDate.$lte = endDate;
//     }

//     // Get total count of all policies (with filters if applied)
//     const totalPolicies = await AllInsurance.countDocuments(baseQuery);

//     // Get paginated policies (with filters if applied)
//     const allPolicies = await AllInsurance.find(baseQuery).skip(skip).limit(limit);

//     // Filter and flag policies
//     const monthlyExpiring = [];
//     const weeklyExpiring = [];

//     allPolicies.forEach(policy => {
//       if (!policy.policyEndDate) return;

//       const policyEndDate = policy.policyEndDate.split('T')[0];
//       const policyObj = policy.toObject();

//       // Check for monthly expiry
//       if (policyEndDate >= startDateStr && policyEndDate <= endDateStr) {
//         monthlyExpiring.push(policyObj);
//       }

//       // Check for weekly expiry
//       if (policyEndDate >= nextWeekStartStr && policyEndDate <= nextWeekEndStr) {
//         weeklyExpiring.push(policyObj);
//       }
//     });

//     // Get counts for expiring policies (from entire collection, not just current page)
//     const monthlyExpiringQuery = {
//       policyEndDate: {
//         $gte: startDateStr,
//         $lte: endDateStr
//       }
//     };
//     if (segment) monthlyExpiringQuery.segment = segment;
//     if (startDate || endDate) {
//       monthlyExpiringQuery.policyEndDate = {};
//       if (startDate) monthlyExpiringQuery.policyEndDate.$gte = startDate;
//       if (endDate) monthlyExpiringQuery.policyEndDate.$lte = endDate;
//     }

//     const weeklyExpiringQuery = {
//       policyEndDate: {
//         $gte: nextWeekStartStr,
//         $lte: nextWeekEndStr
//       }
//     };
//     if (segment) weeklyExpiringQuery.segment = segment;
//     if (startDate || endDate) {
//       weeklyExpiringQuery.policyEndDate = {};
//       if (startDate) weeklyExpiringQuery.policyEndDate.$gte = startDate;
//       if (endDate) weeklyExpiringQuery.policyEndDate.$lte = endDate;
//     }

//     const monthlyExpiringCount = await AllInsurance.countDocuments(monthlyExpiringQuery);
//     const weeklyExpiringCount = await AllInsurance.countDocuments(weeklyExpiringQuery);

//     // Get all unique segments for filter dropdown
//     const segments = await AllInsurance.distinct("segment");
//     // console.log(  "Segments:", segments);

//     return res.status(200).json({
//       monthlyExpiring,
//       weeklyExpiring,
//       allPolicies,
//       totalPolicies,
//       monthlyExpiringCount,
//       weeklyExpiringCount,
//       currentMonthRange: {
//         start: startDateStr,
//         end: endDateStr
//       },
//       nextWeekRange: {
//         start: nextWeekStartStr,
//         end: nextWeekEndStr
//       },
//       pagination: {
//         currentPage: page,
//         totalPages: Math.ceil(totalPolicies / limit),
//         itemsPerPage: limit,
//         totalItems: totalPolicies
//       },
//       segments
//     });
//   } catch (error) {
//     console.error("Error getting insurance list:", error);
//     return res.status(500).json({
//       status: "Error during Insurance List Update",
//       message: error.message,
//     });
//   }
// };

// import AllInsurance from "../../models/masterDetails/masterdetailSchema.js";

// export const policydata = async (req, res) => {
//   try {
//     // Get pagination and filtering parameters from query
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;
//     const segment = req.query.segment || null;

//     // Get current month's start and end dates
//     const now = new Date();
//     const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
//     const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

//     // Get next week's dates (7 days from now)
//     const nextWeekStart = new Date(now);
//     nextWeekStart.setDate(now.getDate() + 1); // Tomorrow
//     const nextWeekEnd = new Date(now);
//     nextWeekEnd.setDate(now.getDate() + 7); // 7 days from now

//     // Format dates to YYYY-MM-DD
//     const formatDate = (date) => date.toISOString().split('T')[0];

//     const startDateStr = formatDate(currentMonthStart);
//     const endDateStr = formatDate(currentMonthEnd);
//     const nextWeekStartStr = formatDate(nextWeekStart);
//     const nextWeekEndStr = formatDate(nextWeekEnd);

//     // Base query for filtering
//     const baseQuery = segment ? { segment } : {};

//     // Get total count of all policies (with segment filter if applied)
//     const totalPolicies = await AllInsurance.countDocuments(baseQuery);

//     // Get paginated policies (with segment filter if applied)
//     const allPolicies = await AllInsurance.find(baseQuery).skip(skip).limit(limit);

//     // Filter and flag policies
//     const monthlyExpiring = [];
//     const weeklyExpiring = [];

//     allPolicies.forEach(policy => {
//       if (!policy.policyEndDate) return;

//       const policyEndDate = policy.policyEndDate.split('T')[0];
//       const policyObj = policy.toObject();

//       // Check for monthly expiry
//       if (policyEndDate >= startDateStr && policyEndDate <= endDateStr) {
//         monthlyExpiring.push(policyObj);
//       }

//       // Check for weekly expiry
//       if (policyEndDate >= nextWeekStartStr && policyEndDate <= nextWeekEndStr) {
//         weeklyExpiring.push(policyObj);
//       }
//     });

//     // Get counts for expiring policies (from entire collection, not just current page)
//     const monthlyExpiringQuery = {
//       policyEndDate: {
//         $gte: startDateStr,
//         $lte: endDateStr
//       }
//     };
//     if (segment) monthlyExpiringQuery.segment = segment;

//     const weeklyExpiringQuery = {
//       policyEndDate: {
//         $gte: nextWeekStartStr,
//         $lte: nextWeekEndStr
//       }
//     };
//     if (segment) weeklyExpiringQuery.segment = segment;

//     const monthlyExpiringCount = await AllInsurance.countDocuments(monthlyExpiringQuery);
//     const weeklyExpiringCount = await AllInsurance.countDocuments(weeklyExpiringQuery);

//     // Get all unique segments for filter dropdown
//     const segments = await AllInsurance.distinct("segment");

//     return res.status(200).json({
//       monthlyExpiring,
//       weeklyExpiring,
//       allPolicies,
//       totalPolicies,
//       monthlyExpiringCount,
//       weeklyExpiringCount,
//       currentMonthRange: {
//         start: startDateStr,
//         end: endDateStr
//       },
//       nextWeekRange: {
//         start: nextWeekStartStr,
//         end: nextWeekEndStr
//       },
//       pagination: {
//         currentPage: page,
//         totalPages: Math.ceil(totalPolicies / limit),
//         itemsPerPage: limit,
//         totalItems: totalPolicies
//       },
//       segments
//     });
//   } catch (error) {
//     console.error("Error getting insurance list:", error);
//     return res.status(500).json({
//       status: "Error during Insurance List Update",
//       message: error.message,
//     });
//   }
// };
