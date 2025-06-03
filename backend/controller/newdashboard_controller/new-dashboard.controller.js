// 888

// import AllInsurance from "../../models/masterDetails/masterdetailSchema.js";
import AllInsurance from './../../models/masterDetails/masterdetailSchema.js';

export const newdashboarddata = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const segment = req.query.segment || null;
    const startDate = req.query.startDate || null;
    const endDate = req.query.endDate || null;
    const year = req.query.year || null;
    const month = req.query.month || null;

    const formatDate = (date) => date.toISOString().split("T")[0];

    // Unfiltered date ranges for expiring policies (always current month and next 7 days)
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const nextWeekStart = new Date(now);
    nextWeekStart.setDate(now.getDate() + 1);
    const nextWeekEnd = new Date(now);
    nextWeekEnd.setDate(now.getDate() + 7);

    const currentMonthStartStr = formatDate(currentMonthStart);
    const currentMonthEndStr = formatDate(currentMonthEnd);
    const nextWeekStartStr = formatDate(nextWeekStart);
    const nextWeekEndStr = formatDate(nextWeekEnd);

    // Base query for filtered policies (allPolicies and net premiums)
    const baseQuery = {};
    if (segment) baseQuery.segment = segment;
    if (startDate || endDate) {
      baseQuery.policyEndDate = {};
      if (startDate) baseQuery.policyEndDate.$gte = startDate;
      if (endDate) baseQuery.policyEndDate.$lte = endDate;
    }

    // Queries for unfiltered expiring policies
    const monthlyExpiringQuery = {
      policyEndDate: {
        $gte: currentMonthStartStr,
        $lte: currentMonthEndStr,
      },
    };
    const weeklyExpiringQuery = {
      policyEndDate: {
        $gte: nextWeekStartStr,
        $lte: nextWeekEndStr,
      },
    };



    
    // Execute queries
    const [
      totalPolicies,
      allPolicies,
      monthlyExpiring,
      weeklyExpiring,
      segments,
      totalNetPremiumResult,
      monthlyExpiringCount,
      weeklyExpiringCount,
    ] = await Promise.all([
      AllInsurance.countDocuments(baseQuery),
      AllInsurance.find(baseQuery).skip(skip).limit(limit),
      AllInsurance.find(monthlyExpiringQuery).limit(100),
      AllInsurance.find(weeklyExpiringQuery).limit(100),
      AllInsurance.distinct("segment"),
      AllInsurance.aggregate([{ $match: baseQuery }, { $group: { _id: null, total: { $sum: "$netPremium" } } }]),
      AllInsurance.countDocuments(monthlyExpiringQuery),
      AllInsurance.countDocuments(weeklyExpiringQuery),
    ]);

    const totalNetPremium = totalNetPremiumResult.length > 0 ? totalNetPremiumResult[0].total : 0;

    let yearlyNetPremium = 0;
    if (year) {
      const yearlyQuery = {
        policyEndDate: {
          $gte: `${year}-01-01`,
          $lte: `${year}-12-31`,
        },
        ...baseQuery,
      };
      const yearlyResult = await AllInsurance.aggregate([
        { $match: yearlyQuery },
        { $group: { _id: null, total: { $sum: "$netPremium" } } },
      ]);
      yearlyNetPremium = yearlyResult.length > 0 ? yearlyResult[0].total : 0;
    } else {
      yearlyNetPremium = totalNetPremium;
    }

    let monthlyNetPremium = 0;
    if (year && month) {
      const monthlyQuery = {
        policyEndDate: {
          $gte: `${year}-${month}-01`,
          $lte: `${year}-${month}-${new Date(year, parseInt(month), 0).getDate()}`,
        },
        ...baseQuery,
      };
      const monthlyResult = await AllInsurance.aggregate([
        { $match: monthlyQuery },
        { $group: { _id: null, total: { $sum: "$netPremium" } } },
      ]);
      monthlyNetPremium = monthlyResult.length > 0 ? monthlyResult[0].total : 0;
    } else {
      monthlyNetPremium = totalNetPremium;
    }

    return res.status(200).json({
      monthlyExpiring,
      weeklyExpiring,
      allPolicies,
      totalPolicies,
      monthlyExpiringCount,
      weeklyExpiringCount,
      currentMonthRange: {
        start: currentMonthStartStr,
        end: currentMonthEndStr,
      },
      nextWeekRange: {
        start: nextWeekStartStr,
        end: nextWeekEndStr,
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPolicies / limit),
        itemsPerPage: limit,
        totalItems: totalPolicies,
      },
      segments,
      yearlyNetPremium,
      monthlyNetPremium,
      totalNetPremium,
    });
  } catch (error) {
    console.error("Error getting insurance list:", error);
    return res.status(500).json({
      status: "Error during Insurance List Update",
      message: error.message,
    });
  }
};