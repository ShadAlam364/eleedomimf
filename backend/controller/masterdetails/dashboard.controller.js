import AddEmployee from "../../models/addempSchema.js";
import AllInsurance from "../../models/masterDetails/masterdetailSchema.js";
import Advisor from "../../models/advisor/advisorSchema.js";
import moment from 'moment';
import AddBranch from "../../models/addbranchSchema.js";
import Career from "../../models/user_models/careers.js";
import DailyVisits from './../../models/DailyVisitReport/dailyVisits.js';
import CType from "../../models/compnyType/companyType.js";
import ODDiscount from "../../models/oddiscount/Oddiscount.js";
import CC from "../../models/cc/cc.js";
import SittingCapacity from "../../models/sittingcapacity/sittingCapacity.js";
import ncbAdd from "../../models/ncb/ncb.js";

const getDashboardData = async (req, res) => {
  try {
    const { startDate, endDate, branchName, employeeId, advId } = req.query;
    // Current date calculations
    const today = moment();
    const currentYear = today.year();
    const currentMonth = today.month() + 1;
    const currentDay = today.date();
    
    // Financial year calculations (April 1 to March 31)
    const financialYearStart = today.month() >= 3 ? 
      moment([currentYear, 3, 1]) : // April 1 current year
      moment([currentYear - 1, 3, 1]); // April 1 previous year
      
    const financialYearEnd = today.month() >= 3 ?
      moment([currentYear + 1, 2, 31]) : // March 31 next year
      moment([currentYear, 2, 31]); // March 31 current year

    // Base match query - convert string dates to proper Date objects
    const matchQuery = {};
    if (startDate && endDate) {
      matchQuery.entryDate = {
        $gte: moment(startDate, "YYYY-MM-DD").toDate(),
        $lte: moment(endDate, "YYYY-MM-DD").toDate()
      };
    }

    // Add branch filter if provided (using $in operator for array field)
    if (branchName) {
      matchQuery.branch = { $in: [branchName] };
    }

    if (employeeId) matchQuery.employee_id = { $in: [employeeId] };
    if (advId) matchQuery.advId = { $in: [advId] };
    // Main aggregation pipeline
    const pipeline = [
      { $match: matchQuery },
      {
        $addFields: {
          cleanedStaffName: {
            $trim: { input: { $toLower: "$staffName" } }
          },
          cleanedBranch: {
            $trim: { input: { $toUpper: "$branch" } }
          },
          cleanedEmployeeId: { $trim: { input: { $toUpper: "$employee_id" } } },
          cleanedAdvId: { $trim: { input: { $toUpper: "$advId" } } },
          segment: {
            $trim: { input: { $toUpper: "$segment" } }
          },
          // Safely convert entryDate to proper Date object
          convertedEntryDate: {
            $cond: [
              { $eq: ["$entryDate", null] },
              null,
              {
                $cond: [
                  { $eq: [{ $type: "$entryDate" }, "string"] },
                  {
                    $dateFromString: {
                      dateString: "$entryDate",
                      format: "%Y-%m-%d",
                      onError: null, // Return null for invalid dates
                      onNull: null
                    }
                  },
                  "$entryDate"
                ]
              }
            ]
          },
          // Convert netPremium to number
          convertedNetPremium: {
            $cond: [
              { $eq: [{ $type: "$netPremium" }, "string"] },
              { $toDouble: "$netPremium" },
              "$netPremium"
            ]
          }
        }
      },
      // Filter out documents with invalid dates
      { $match: { convertedEntryDate: { $ne: null } } },
      {
        $project: {
          staffName: "$cleanedStaffName",
          branch: "$cleanedBranch",
          employee_id: "$cleanedEmployee",
          segment: 1,
          entryDate: "$convertedEntryDate",
          netPremium: "$convertedNetPremium",
          finalEntryFields: 1,
          isCurrentYear: {
            $and: [
              { $gte: ["$convertedEntryDate", financialYearStart.toDate()] },
              { $lte: ["$convertedEntryDate", financialYearEnd.toDate()] }
            ]
          },
          isCurrentMonth: {
            $and: [
              { $eq: [{ $year: "$convertedEntryDate" }, currentYear] },
              { $eq: [{ $month: "$convertedEntryDate" }, currentMonth] }
            ]
          },
          isCurrentDay: {
            $and: [
              { $eq: [{ $year: "$convertedEntryDate" }, currentYear] },
              { $eq: [{ $month: "$convertedEntryDate" }, currentMonth] },
              { $eq: [{ $dayOfMonth: "$convertedEntryDate" }, currentDay] }
            ]
          }
        }
      },
      {
        $facet: {
          // First pipeline for overall stats
          overallStats: [
            {
              $group: {
                _id: null,
                yearlyCount: { $sum: { $cond: ["$isCurrentYear", 1, 0] } },
                monthlyCount: { $sum: { $cond: ["$isCurrentMonth", 1, 0] } },
                dailyCount: { $sum: { $cond: ["$isCurrentDay", 1, 0] } },
                yearlyNetPremium: { $sum: { $cond: ["$isCurrentYear", "$netPremium", 0] } },
                monthlyNetPremium: { $sum: { $cond: ["$isCurrentMonth", "$netPremium", 0] } },
                dailyNetPremium: { $sum: { $cond: ["$isCurrentDay", "$netPremium", 0] } },
                yearlyFinalEntryFields: { $sum: { $cond: ["$isCurrentYear", "$finalEntryFields", 0] } },
                monthlyFinalEntryFields: { $sum: { $cond: ["$isCurrentMonth", "$finalEntryFields", 0] } },
                dailyFinalEntryFields: { $sum: { $cond: ["$isCurrentDay", "$finalEntryFields", 0] } },
                allData: { $push: "$$ROOT" },
                // Segment-wise counts and sums
                cvYearly: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentYear", { $eq: ["$segment", "C V"] }] },
                      1,
                      0
                    ]
                  }
                },
                cvMonthly: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentMonth", { $eq: ["$segment", "C V"] }] },
                      1,
                      0
                    ]
                  }
                },
                cvDaily: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentDay", { $eq: ["$segment", "C V"] }] },
                      1,
                      0
                    ]
                  }
                },
                cvYearlyPremium: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentYear", { $eq: ["$segment", "C V"] }] },
                      "$netPremium",
                      0
                    ]
                  }
                },
                cvMonthlyPremium: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentMonth", { $eq: ["$segment", "C V"] }] },
                      "$netPremium",
                      0
                    ]
                  }
                },
                cvDailyPremium: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentDay", { $eq: ["$segment", "C V"] }] },
                      "$netPremium",
                      0
                    ]
                  }
                },
                // Repeat for other segments (PVT-CAR, TW, LIFE, HEALTH, NON-MOTOR)
                pvtCarYearly: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentYear", { $eq: ["$segment", "PVT-CAR"] }] },
                      1,
                      0
                    ]
                  }
                },
                pvtCarMonthly: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentMonth", { $eq: ["$segment", "PVT-CAR"] }] },
                      1,
                      0
                    ]
                  }
                },
                pvtCarDaily: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentDay", { $eq: ["$segment", "PVT-CAR"] }] },
                      1,
                      0
                    ]
                  }
                },
                pvtCarYearlyPremium: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentYear", { $eq: ["$segment", "PVT-CAR"] }] },
                      "$netPremium",
                      0
                    ]
                  }
                },
                pvtCarMonthlyPremium: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentMonth", { $eq: ["$segment", "PVT-CAR"] }] },
                      "$netPremium",
                      0
                    ]
                  }
                },
                pvtCarDailyPremium: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentDay", { $eq: ["$segment", "PVT-CAR"] }] },
                      "$netPremium",
                      0
                    ]
                  }
                },
                twYearly: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentYear", { $eq: ["$segment", "TW"] }] },
                      1,
                      0
                    ]
                  }
                },
                twMonthly: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentMonth", { $eq: ["$segment", "TW"] }] },
                      1,
                      0
                    ]
                  }
                },
                twDaily: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentDay", { $eq: ["$segment", "TW"] }] },
                      1,
                      0
                    ]
                  }
                },
                twYearlyPremium: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentYear", { $eq: ["$segment", "TW"] }] },
                      "$netPremium",
                      0
                    ]
                  }
                },
                twMonthlyPremium: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentMonth", { $eq: ["$segment", "TW"] }] },
                      "$netPremium",
                      0
                    ]
                  }
                },
                twDailyPremium: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentDay", { $eq: ["$segment", "TW"] }] },
                      "$netPremium",
                      0
                    ]
                  }
                },
                lifeYearly: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentYear", { $eq: ["$segment", "LIFE"] }] },
                      1,
                      0
                    ]
                  }
                },
                lifeMonthly: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentMonth", { $eq: ["$segment", "LIFE"] }] },
                      1,
                      0
                    ]
                  }
                },
                lifeDaily: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentDay", { $eq: ["$segment", "LIFE"] }] },
                      1,
                      0
                    ]
                  }
                },
                lifeYearlyPremium: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentYear", { $eq: ["$segment", "LIFE"] }] },
                      "$netPremium",
                      0
                    ]
                  }
                },
                lifeMonthlyPremium: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentMonth", { $eq: ["$segment", "LIFE"] }] },
                      "$netPremium",
                      0
                    ]
                  }
                },
                lifeDailyPremium: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentDay", { $eq: ["$segment", "LIFE"] }] },
                      "$netPremium",
                      0
                    ]
                  }
                },
                healthYearly: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentYear", { $eq: ["$segment", "HEALTH"] }] },
                      1,
                      0
                    ]
                  }
                },
                healthMonthly: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentMonth", { $eq: ["$segment", "HEALTH"] }] },
                      1,
                      0
                    ]
                  }
                },
                healthDaily: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentDay", { $eq: ["$segment", "HEALTH"] }] },
                      1,
                      0
                    ]
                  }
                },
                healthYearlyPremium: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentYear", { $eq: ["$segment", "HEALTH"] }] },
                      "$netPremium",
                      0
                    ]
                  }
                },
                healthMonthlyPremium: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentMonth", { $eq: ["$segment", "HEALTH"] }] },
                      "$netPremium",
                      0
                    ]
                  }
                },
                healthDailyPremium: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentDay", { $eq: ["$segment", "HEALTH"] }] },
                      "$netPremium",
                      0
                    ]
                  }
                },
                nonMotorYearly: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentYear", { $eq: ["$segment", "NON-MOTOR"] }] },
                      1,
                      0
                    ]
                  }
                },
                nonMotorMonthly: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentMonth", { $eq: ["$segment", "NON-MOTOR"] }] },
                      1,
                      0
                    ]
                  }
                },
                nonMotorDaily: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentDay", { $eq: ["$segment", "NON-MOTOR"] }] },
                      1,
                      0
                    ]
                  }
                },
                nonMotorYearlyPremium: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentYear", { $eq: ["$segment", "NON-MOTOR"] }] },
                      "$netPremium",
                      0
                    ]
                  }
                },
                nonMotorMonthlyPremium: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentMonth", { $eq: ["$segment", "NON-MOTOR"] }] },
                      "$netPremium",
                      0
                    ]
                  }
                },
                nonMotorDailyPremium: {
                  $sum: {
                    $cond: [
                      { $and: ["$isCurrentDay", { $eq: ["$segment", "NON-MOTOR"] }] },
                      "$netPremium",
                      0
                    ]
                  }
                }
              }
            },
            {
              $project: {
                yearlyCount: 1,
                monthlyCount: 1,
                dailyCount: 1,
                yearlyNetPremium: 1,
                monthlyNetPremium: 1,
                dailyNetPremium: 1,
                yearlyFinalEntryFields: 1,
                monthlyFinalEntryFields: 1,
                dailyFinalEntryFields: 1,
                // Segment data
                cvYearly: 1,
                cvMonthly: 1,
                cvDaily: 1,
                cvYearlyPremium: 1,
                cvMonthlyPremium: 1,
                cvDailyPremium: 1,
                pvtCarYearly: 1,
                pvtCarMonthly: 1,
                pvtCarDaily: 1,
                pvtCarYearlyPremium: 1,
                pvtCarMonthlyPremium: 1,
                pvtCarDailyPremium: 1,
                twYearly: 1,
                twMonthly: 1,
                twDaily: 1,
                twYearlyPremium: 1,
                twMonthlyPremium: 1,
                twDailyPremium: 1,
                lifeYearly: 1,
                lifeMonthly: 1,
                lifeDaily: 1,
                lifeYearlyPremium: 1,
                lifeMonthlyPremium: 1,
                lifeDailyPremium: 1,
                healthYearly: 1,
                healthMonthly: 1,
                healthDaily: 1,
                healthYearlyPremium: 1,
                healthMonthlyPremium: 1,
                healthDailyPremium: 1,
                nonMotorYearly: 1,
                nonMotorMonthly: 1,
                nonMotorDaily: 1,
                nonMotorYearlyPremium: 1,
                nonMotorMonthlyPremium: 1,
                nonMotorDailyPremium: 1,
                employees: {
                  $reduce: {
                    input: "$allData",
                    initialValue: [],
                    in: {
                      $cond: [
                        { $in: ["$$this.staffName", "$$value"] },
                        "$$value",
                        { $concatArrays: ["$$value", ["$$this.staffName"]] }
                      ]
                    }
                  }
                },
                allData: 1
              }
            }
          ],
          // Second pipeline for branch-wise stats
          branchStats: [
            {
              $group: {
                _id: "$branch",
                yearlyCount: { $sum: { $cond: ["$isCurrentYear", 1, 0] } },
                monthlyCount: { $sum: { $cond: ["$isCurrentMonth", 1, 0] } },
                dailyCount: { $sum: { $cond: ["$isCurrentDay", 1, 0] } },
                yearlyNetPremium: { $sum: { $cond: ["$isCurrentYear", "$netPremium", 0] } },
                monthlyNetPremium: { $sum: { $cond: ["$isCurrentMonth", "$netPremium", 0] } },
                dailyNetPremium: { $sum: { $cond: ["$isCurrentDay", "$netPremium", 0] } },
                employees: {
                  $addToSet: "$staffName"
                }
              }
            },
            {
              $project: {
                branch: "$_id",
                _id: 0,
                yearlyCount: 1,
                monthlyCount: 1,
                dailyCount: 1,
                yearlyNetPremium: 1,
                monthlyNetPremium: 1,
                dailyNetPremium: 1,
                employeeCount: { $size: "$employees" }
              }
            },
            { $sort: { branch: 1 } }
          ],
          employeeStats: [
            {
              $group: {
                _id: "$cleanedEmployeeId",
                yearlyCount: { $sum: { $cond: ["$isCurrentYear", 1, 0] } },
                monthlyCount: { $sum: { $cond: ["$isCurrentMonth", 1, 0] } },
                dailyCount: { $sum: { $cond: ["$isCurrentDay", 1, 0] } },
                yearlyNetPremium: { $sum: { $cond: ["$isCurrentYear", "$netPremium", 0] } },
                monthlyNetPremium: { $sum: { $cond: ["$isCurrentMonth", "$netPremium", 0] } },
                dailyNetPremium: { $sum: { $cond: ["$isCurrentDay", "$netPremium", 0] } }
              }
            }
          ],
          advisorStats: [
            {
              $group: {
                _id: "$cleanedAdvId",
                yearlyCount: { $sum: { $cond: ["$isCurrentYear", 1, 0] } },
                monthlyCount: { $sum: { $cond: ["$isCurrentMonth", 1, 0] } },
                dailyCount: { $sum: { $cond: ["$isCurrentDay", 1, 0] } },
                yearlyNetPremium: { $sum: { $cond: ["$isCurrentYear", "$netPremium", 0] } },
                monthlyNetPremium: { $sum: { $cond: ["$isCurrentMonth", "$netPremium", 0] } },
                dailyNetPremium: { $sum: { $cond: ["$isCurrentDay", "$netPremium", 0] } }
              }
            }
          ]
        }
      }
    ];

    // Execute aggregation
    const [aggregationResult] = await AllInsurance.aggregate(pipeline);
    const [result] = aggregationResult.overallStats;
    const branchStats = aggregationResult.branchStats;
    const employeeStats = aggregationResult.employeeStats || [];
    const advisorStats = aggregationResult.advisorStats || [];

    if (!result) {
      return res.status(200).json({
        yearlyCount: 0,
        monthlyCount: 0,
        dailyCount: 0,
        employees: [],
        employeePolicyCounts: {},
        yearlyNetPremium: 0,
        monthlyNetPremium: 0,
        dailyNetPremium: 0,
        yearlyFinalEntryFields: 0,
        monthlyFinalEntryFields: 0,
        dailyFinalEntryFields: 0,
        segmentData: {
          cv: {
            yearlyCount: 0,
            monthlyCount: 0,
            dailyCount: 0,
            yearlyPremium: 0,
            monthlyPremium: 0,
            dailyPremium: 0
          },
          pvtCar: {
            yearlyCount: 0,
            monthlyCount: 0,
            dailyCount: 0,
            yearlyPremium: 0,
            monthlyPremium: 0,
            dailyPremium: 0
          },
          tw: {
            yearlyCount: 0,
            monthlyCount: 0,
            dailyCount: 0,
            yearlyPremium: 0,
            monthlyPremium: 0,
            dailyPremium: 0
          },
          life: {
            yearlyCount: 0,
            monthlyCount: 0,
            dailyCount: 0,
            yearlyPremium: 0,
            monthlyPremium: 0,
            dailyPremium: 0
          },
          health: {
            yearlyCount: 0,
            monthlyCount: 0,
            dailyCount: 0,
            yearlyPremium: 0,
            monthlyPremium: 0,
            dailyPremium: 0
          },
          nonMotor: {
            yearlyCount: 0,
            monthlyCount: 0,
            dailyCount: 0,
            yearlyPremium: 0,
            monthlyPremium: 0,
            dailyPremium: 0
          }
        },
        branchData: []
      });
    }

    // Calculate employee counts
    const employeePolicyCounts = {};
    const employeeDataMap = new Map();
    
    result.allData.forEach(item => {
      if (!employeeDataMap.has(item.staffName)) {
        employeeDataMap.set(item.staffName, []);
      }
      employeeDataMap.get(item.staffName).push(item);
    });
    
    employeeDataMap.forEach((data, employee) => {
      employeePolicyCounts[employee] = {
        ytd: data.filter(item => item.isCurrentYear).length,
        mtd: data.filter(item => item.isCurrentMonth).length,
        daily: data.filter(item => item.isCurrentDay).length
      };
    });

    // Prepare segment data (same as your original code)
    const segmentData = {
      cv: {
        yearlyCount: result.cvYearly || 0,
        monthlyCount: result.cvMonthly || 0,
        dailyCount: result.cvDaily || 0,
        yearlyPremium: result.cvYearlyPremium || 0,
        monthlyPremium: result.cvMonthlyPremium || 0,
        dailyPremium: result.cvDailyPremium || 0
      },
      pvtCar: {
        yearlyCount: result.pvtCarYearly || 0,
        monthlyCount: result.pvtCarMonthly || 0,
        dailyCount: result.pvtCarDaily || 0,
        yearlyPremium: result.pvtCarYearlyPremium || 0,
        monthlyPremium: result.pvtCarMonthlyPremium || 0,
        dailyPremium: result.pvtCarDailyPremium || 0
      },
      tw: {
        yearlyCount: result.twYearly || 0,
        monthlyCount: result.twMonthly || 0,
        dailyCount: result.twDaily || 0,
        yearlyPremium: result.twYearlyPremium || 0,
        monthlyPremium: result.twMonthlyPremium || 0,
        dailyPremium: result.twDailyPremium || 0
      },
      life: {
        yearlyCount: result.lifeYearly || 0,
        monthlyCount: result.lifeMonthly || 0,
        dailyCount: result.lifeDaily || 0,
        yearlyPremium: result.lifeYearlyPremium || 0,
        monthlyPremium: result.lifeMonthlyPremium || 0,
        dailyPremium: result.lifeDailyPremium || 0
      },
      health: {
        yearlyCount: result.healthYearly || 0,
        monthlyCount: result.healthMonthly || 0,
        dailyCount: result.healthDaily || 0,
        yearlyPremium: result.healthYearlyPremium || 0,
        monthlyPremium: result.healthMonthlyPremium || 0,
        dailyPremium: result.healthDailyPremium || 0
      },
      nonMotor: {
        yearlyCount: result.nonMotorYearly || 0,
        monthlyCount: result.nonMotorMonthly || 0,
        dailyCount: result.nonMotorDaily || 0,
        yearlyPremium: result.nonMotorYearlyPremium || 0,
        monthlyPremium: result.nonMotorMonthlyPremium || 0,
        dailyPremium: result.nonMotorDailyPremium || 0
      }
    };

    res.status(200).json({
      yearlyCount: result.yearlyCount || 0,
      monthlyCount: result.monthlyCount || 0,
      dailyCount: result.dailyCount || 0,
      employees: result.employees || [],
      employeePolicyCounts,
      yearlyNetPremium: result.yearlyNetPremium || 0,
      monthlyNetPremium: result.monthlyNetPremium || 0,
      dailyNetPremium: result.dailyNetPremium || 0,
      yearlyFinalEntryFields: result.yearlyFinalEntryFields || 0,
      monthlyFinalEntryFields: result.monthlyFinalEntryFields || 0,
      dailyFinalEntryFields: result.dailyFinalEntryFields || 0,
      segmentData,
      branchData: branchStats || [],
      // employeeData: employeeStats,
      // advisorData: advisorStats
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      status: "Error fetching dashboard data",
      message: error.message
    });
  }
};
export default getDashboardData;

export const getDashboardEmpData = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
    const currentYear = currentDate.getFullYear();
    const currentDateString = `${currentDay.toString().padStart(2, "0")}/${currentMonth.toString().padStart(2, "0")}/${currentYear}`;

    // Helper function to format dates
    const formatDate = (date) => {
      const d = new Date(date);
      return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
    };

    const pipeline = [
      // Lookup for employee attendance details
      {
        $lookup: {
          from: "empattendances",
          localField: "_id",
          foreignField: "employee_id",
          as: "employeeDetails"
        }
      },
      // Lookup for leave details
      {
        $lookup: {
          from: "empleaves",
          localField: "_id",
          foreignField: "employee_id",
          as: "leaveDetails"
        }
      },
      // Project necessary fields and calculate metrics
      {
        $project: {
          _id: 1,
          name: 1,
          flags: 1,
          employeeDetails: 1,
          leaveDetails: 1,
          // Calculate if employee is present today
          isPresentToday: {
            $gt: [
              {
                $size: {
                  $filter: {
                    input: "$employeeDetails",
                    as: "detail",
                    cond: {
                      $and: [
                        { $eq: ["$$detail.status", "present"] },
                        { $eq: ["$$detail.date", currentDateString] }
                      ]
                    }
                  }
                }
              },
              0
            ]
          },
          // Calculate date range attendance if dates provided
          dateRangeAttendance: {
            $size: {
              $filter: {
                input: "$employeeDetails",
                as: "detail",
                cond: {
                  $and: [
                    { $eq: ["$$detail.status", "present"] },
                    startDate && endDate ? {
                      $and: [
                        { $gte: ["$$detail.date", formatDate(startDate)] },
                        { $lte: ["$$detail.date", formatDate(endDate)] }
                      ]
                    } : {}
                  ]
                }
              }
            }
          },
          // Count all leaves
          totalLeaves: { $size: "$leaveDetails" },
          // Count approved leaves
          approvedLeaves: {
            $size: {
              $filter: {
                input: "$leaveDetails",
                as: "leave",
                cond: { $eq: ["$$leave.status", "approved"] }
              }
            }
          },
          // Count rejected leaves
          rejectedLeaves: {
            $size: {
              $filter: {
                input: "$leaveDetails",
                as: "leave",
                cond: { $eq: ["$$leave.status", "rejected"] }
              }
            }
          }
        }
      },
      // Group to calculate totals
      {
        $group: {
          _id: null,
          employees: { $push: "$$ROOT" },
          totalEmployees: { $sum: 1 },
          activeEmployees: {
            $sum: { $cond: [{ $eq: ["$flags", true] }, 1, 0] }
          },
          presentToday: {
            $sum: { $cond: [{ $and: [{ $eq: ["$flags", true] }, "$isPresentToday"] }, 1, 0] }
          },
          dateRangePresent: {
            $sum: { $cond: [{ $eq: ["$flags", true] }, "$dateRangeAttendance", 0] }
          },
          totalLeavesCount: { $sum: "$totalLeaves" },
          approvedLeavesCount: { $sum: "$approvedLeaves" },
          rejectedLeavesCount: { $sum: "$rejectedLeaves" }
        }
      },
      // Project to format the output
      {
        $project: {
          _id: 0,
          employees: 1,
          summary: {
            totalEmployees: "$totalEmployees",
            activeEmployees: "$activeEmployees",
            presentToday: "$presentToday",
            dateRangePresent: "$dateRangePresent",
            totalLeavesCount: "$totalLeavesCount",
            approvedLeavesCount: "$approvedLeavesCount",
            rejectedLeavesCount: "$rejectedLeavesCount"
          }
        }
      }
    ];

    const result = await AddEmployee.aggregate(pipeline);

    if (result.length === 0) {
      return res.json({
        employees: [],
        summary: {
          totalEmployees: 0,
          activeEmployees: 0,
          presentToday: 0,
          dateRangePresent: 0,
          totalLeavesCount: 0,
          approvedLeavesCount: 0,
          rejectedLeavesCount: 0
        }
      });
    }

    res.json(result[0]);
  } catch (error) {
    console.error("Error fetching employee attendance list:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getDashboardAttendances = async (req, res) => {
  try {
    const { startDate, endDate, branchName, employeeId } = req.query;

    // If employeeId is provided, handle single employee case
    if (employeeId) {
      const employee = await AddEmployee.findById(employeeId);

      if (!employee) {
        return res.status(404).json({
          status: "Error",
          message: "Employee not found"
        });
      }

      // Initialize counters
      let total = 0;
      let pending = 0;
      let approved = 0;
      let rejected = 0;

      // Check if leaveDetails exists and is an array
      if (Array.isArray(employee.leaveDetails)) {
        total = employee.leaveDetails.length;
        
        employee.leaveDetails.forEach(leave => {
          switch (leave.status) {
            case "pending":
              pending++;
              break;
            case "approved":
              approved++;
              break;
            case "rejected":
              rejected++;
              break;
            default:
              // Handle unexpected status values if needed
              break;
          }
        });
      }

      return res.status(200).json({
        leaveStats: {
          total,
          pending,
          approved,
          rejected
        }
      });
    }

    // Original dashboard logic when no employeeId is provided
    const today = new Date();
    const currentDateString = moment(today).format('DD/MM/YYYY');

    // Date range match query
    const dateMatchQuery = {};
    if (startDate && endDate) {
      dateMatchQuery.$or = [
        { 'employeeDetails.date': { 
          $gte: moment(startDate, "YYYY-MM-DD").toDate(),
          $lte: moment(endDate, "YYYY-MM-DD").toDate()
        }},
        { 'leaveDetails.date': { 
          $gte: moment(startDate, "YYYY-MM-DD").toDate(),
          $lte: moment(endDate, "YYYY-MM-DD").toDate()
        }}
      ];
    }

    // Add branch filter if provided (using $in operator for array field)
    if (branchName) {
      dateMatchQuery.empbranch = { $in: [branchName] };
    }

    const pipeline = [
      { $match: dateMatchQuery },
      {
        $facet: {
          // Employee counts
          employeeCounts: [
            {
              $group: {
                _id: null,
                totalEmployees: { $sum: 1 },
                activeEmployees: {
                  $sum: { $cond: [{ $eq: ["$flags", true] }, 1, 0] }
                }
              }
            }
          ],
          // Today's attendance
          todayAttendance: [
            {
              $match: {
                flags: true,
                'employeeDetails.date': currentDateString,
                'employeeDetails.status': 'present'
              }
            },
            { $unwind: "$employeeDetails" },
            {
              $match: {
                'employeeDetails.date': currentDateString,
                'employeeDetails.status': 'present'
              }
            },
            { $count: "count" }
          ],
          // Leave statistics
          leaveStats: [
            { $unwind: "$leaveDetails" },
            {
              $group: {
                _id: null,
                approvedLeaves: {
                  $sum: { $cond: [{ $eq: ["$leaveDetails.status", "approved"] }, 1, 0] }
                },
                rejectedLeaves: {
                  $sum: { $cond: [{ $eq: ["$leaveDetails.status", "rejected"] }, 1, 0] }
                }
              }
            },
            {
              $project: {
                _id: 0,
                approvedLeaves: 1,
                rejectedLeaves: 1,
                totalLeaves: { $add: ["$approvedLeaves", "$rejectedLeaves"] }
              }
            }
          ]
        }
      },
      {
        $project: {
          totalEmployees: { $arrayElemAt: ["$employeeCounts.totalEmployees", 0] },
          activeEmployees: { $arrayElemAt: ["$employeeCounts.activeEmployees", 0] },
          todayAttendance: { $ifNull: [{ $arrayElemAt: ["$todayAttendance.count", 0] }, 0] },
          approvedLeaves: { $ifNull: [{ $arrayElemAt: ["$leaveStats.approvedLeaves", 0] }, 0] },
          rejectedLeaves: { $ifNull: [{ $arrayElemAt: ["$leaveStats.rejectedLeaves", 0] }, 0] },
          totalLeaves: { $ifNull: [{ $arrayElemAt: ["$leaveStats.totalLeaves", 0] }, 0] }
        }
      }
    ];

    const [result] = await AddEmployee.aggregate(pipeline);

    res.status(200).json({
      totalEmployees: result?.totalEmployees || 0,
      activeEmployees: result?.activeEmployees || 0,
      todayAttendance: result?.todayAttendance || 0,
      totalLeaves: result?.totalLeaves || 0,
      approvedLeaves: result?.approvedLeaves || 0,
      rejectedLeaves: result?.rejectedLeaves || 0
    });

  } catch (error) {
    console.error("Error fetching employee stats:", error);
    res.status(500).json({
      status: "Error fetching employee data",
      message: error.message
    });
  }
};

export const getDashboardAdvisor = async (req, res) => {
  try {
    const { startDate, endDate, branchName } = req.query;

    // Create match query based on date range if provided
    const matchQuery = {};
    if (startDate && endDate) {
      matchQuery.createdAt = {
        $gte: moment(startDate, "YYYY-MM-DD").startOf('day').toDate(),
        $lte: moment(endDate, "YYYY-MM-DD").endOf('day').toDate()
      };
    }
    // Add branch filter if provided (using $in operator for array field)
    if (branchName) {
      matchQuery.branch = { $in: [branchName] };
    }

    const pipeline = [
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalAdvisors: { $sum: 1 },
          branches: {
            $addToSet: {
              $trim: { input: { $toLower: { $arrayElemAt: ["$branch", 0] } } }
            }
          },
          allAdvisors: { $push: "$$ROOT" }
        }
      },
      {
        $unwind: "$branches"
      },
      {
        $match: {
          "branches": { $ne: "" } // Exclude empty branch names
        }
      },
      {
        $group: {
          _id: null,
          totalAdvisors: { $first: "$totalAdvisors" },
          branches: { $push: "$branches" },
          allAdvisors: { $first: "$allAdvisors" }
        }
      },
      {
        $project: {
          totalAdvisors: 1,
          branches: 1,
          branchCounts: {
            $arrayToObject: {
              $map: {
                input: "$branches",
                as: "branch",
                in: {
                  k: "$$branch",
                  v: {
                    $size: {
                      $filter: {
                        input: "$allAdvisors",
                        as: "advisor",
                        cond: {
                          $eq: [
                            { $toLower: { $arrayElemAt: ["$$advisor.branch", 0] } },
                            "$$branch"
                          ]
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    ];

    const [result] = await Advisor.aggregate(pipeline);

    if (!result) {
      return res.status(200).json({
        totalAdvisors: 0,
        branches: [],
        branchCounts: {}
      });
    }

    res.status(200).json({
      totalAdvisors: result.totalAdvisors || 0,
      branches: result.branches || [],
      branchCounts: result.branchCounts || {}
    });

  } catch (error) {
    console.error("Error fetching advisor stats:", error);
    res.status(500).json({
      status: "Error fetching advisor data",
      message: error.message
    });
  }
};

export const getDashboardBranch = async (req, res) => {
  try {
    const count = await AddBranch.countDocuments({});
    const branchList = await AddBranch.find({});
    
    if (!branchList) {
      return res.status(400).json({
        status: "Error during branch lists Update",
        message: "Invalid branch selected",
      });
    } else {
      return res.status(200).json({
        count: count, // Using countDocuments result
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "Error fetching branches",
      message: error.message
    });
  }
};

export const getDashboardBranchWisePolicy = async (req, res) => {
  try {
    const { startDate, endDate, branchName } = req.query;
    const today = moment();
    const currentYear = today.year();
    const currentMonth = today.month() + 1;
    const currentDay = today.date();
    
    // Financial year calculations (April 1 to March 31)
    const financialYearStart = today.month() >= 3 ? 
      moment([currentYear, 3, 1]) : moment([currentYear - 1, 3, 1]);
    const financialYearEnd = today.month() >= 3 ?
      moment([currentYear + 1, 2, 31]) : moment([currentYear, 2, 31]);

    // Base match query
    const matchQuery = {};
    if (startDate && endDate) {
      matchQuery.entryDate = {
        $gte: moment(startDate, "YYYY-MM-DD").toDate(),
        $lte: moment(endDate, "YYYY-MM-DD").toDate()
      };
    }
    if (branchName) {
      matchQuery.branch = { $in: [branchName] };
    }
    
    // Improved pipeline with better date handling
    const pipeline = [
      { $match: matchQuery },
      {
        $addFields: {
          cleanedBranch: { $trim: { input: { $toUpper: "$branch" } } },
          convertedEntryDate: {
            $cond: [
              { $or: [
                { $eq: ["$entryDate", null] },
                { $eq: ["$entryDate", ""] },
                { $eq: [{ $type: "$entryDate" }, "missing"] }
              ]},
              null,
              {
                $dateFromString: {
                  dateString: {
                    $toString: "$entryDate" // Convert to string first
                  },
                  format: "%Y-%m-%d",
                  onError: null, // Return null for invalid dates
                  onNull: null
                }
              }
            ]
          },
          convertedNetPremium: {
            $cond: [
              { $eq: [{ $type: "$netPremium" }, "string"] },
              { $toDouble: "$netPremium" },
              "$netPremium"
            ]
          }
        }
      },
      // Filter out documents with invalid dates
      { $match: { convertedEntryDate: { $ne: null } } },
      {
        $facet: {
          branchStats: [
            {
              $group: {
                _id: "$cleanedBranch",
                yearlyCount: { $sum: { $cond: [
                  { $and: [
                    { $gte: ["$convertedEntryDate", financialYearStart.toDate()] },
                    { $lte: ["$convertedEntryDate", financialYearEnd.toDate()] }
                  ]}, 1, 0] } },
                monthlyCount: { $sum: { $cond: [
                  { $and: [
                    { $eq: [{ $year: "$convertedEntryDate" }, currentYear] },
                    { $eq: [{ $month: "$convertedEntryDate" }, currentMonth] }
                  ]}, 1, 0] } },
                dailyCount: { $sum: { $cond: [
                  { $and: [
                    { $eq: [{ $year: "$convertedEntryDate" }, currentYear] },
                    { $eq: [{ $month: "$convertedEntryDate" }, currentMonth] },
                    { $eq: [{ $dayOfMonth: "$convertedEntryDate" }, currentDay] }
                  ]}, 1, 0] } },
                yearlyNetPremium: { $sum: { $cond: [
                  { $and: [
                    { $gte: ["$convertedEntryDate", financialYearStart.toDate()] },
                    { $lte: ["$convertedEntryDate", financialYearEnd.toDate()] }
                  ]}, "$convertedNetPremium", 0] } },
                monthlyNetPremium: { $sum: { $cond: [
                  { $and: [
                    { $eq: [{ $year: "$convertedEntryDate" }, currentYear] },
                    { $eq: [{ $month: "$convertedEntryDate" }, currentMonth] }
                  ]}, "$convertedNetPremium", 0] } },
                dailyNetPremium: { $sum: { $cond: [
                  { $and: [
                    { $eq: [{ $year: "$convertedEntryDate" }, currentYear] },
                    { $eq: [{ $month: "$convertedEntryDate" }, currentMonth] },
                    { $eq: [{ $dayOfMonth: "$convertedEntryDate" }, currentDay] }
                  ]}, "$convertedNetPremium", 0] } }
              }
            },
            {
              $project: {
                branch: "$_id",
                _id: 0,
                yearlyCount: 1,
                monthlyCount: 1,
                dailyCount: 1,
                yearlyNetPremium: 1,
                monthlyNetPremium: 1,
                dailyNetPremium: 1
              }
            },
            { $sort: { branch: 1 } }
          ]
        }
      }
    ];

    const [aggregationResult] = await AllInsurance.aggregate(pipeline);
    const branchStats = aggregationResult?.branchStats || [];

    res.status(200).json({
      branchData: branchStats.map(branch => ({
        branch: branch.branch,
        yearly: {
          count: branch.yearlyCount || 0,
          netPremium: branch.yearlyNetPremium || 0
        },
        monthly: {
          count: branch.monthlyCount || 0,
          netPremium: branch.monthlyNetPremium || 0
        },
        daily: {
          count: branch.dailyCount || 0,
          netPremium: branch.dailyNetPremium || 0
        }
      }))
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      status: "Error fetching dashboard data",
      message: error.message
    });
  }
};

export const getDashboardJobsApplied = async (req, res) => {
  try {
    const count = await Career.countDocuments({});
    const careers = await Career.find({});
    
    if (!careers) {
      return res.status(400).json({
        status: "Error during branch lists Update",
        message: "Invalid branch selected",
      });
    } else {
      return res.status(200).json({
        count: count, // Using countDocuments result
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "Error fetching branches",
      message: error.message
    });
  }
};

export const getDashboardVisits = async (req, res) => {
  try {
    const { startDate, endDate, branchName } = req.query;
    const today = moment();
    const currentYear = today.year();
    const currentMonth = today.month() + 1;
    const currentDay = today.date();

    // Financial year calculations (April 1 to March 31)
    const financialYearStart = today.month() >= 3 ? 
      moment([currentYear, 3, 1]) : moment([currentYear - 1, 3, 1]);
    const financialYearEnd = today.month() >= 3 ?
      moment([currentYear + 1, 2, 31]) : moment([currentYear, 2, 31]);

    // Base match query
    const matchQuery = {};
    if (startDate && endDate) {
      matchQuery.$or = [
        { entryDate: { 
          $gte: moment(startDate, "YYYY-MM-DD").toDate(),
          $lte: moment(endDate, "YYYY-MM-DD").toDate()
        }},
        { currdate: { 
          $gte: moment(startDate, "YYYY-MM-DD").toDate(),
          $lte: moment(endDate, "YYYY-MM-DD").toDate()
        }}
      ];
    }
    if (branchName) {
      matchQuery.branch = { $in: [branchName] };
    }

    const pipeline = [
      { $match: matchQuery },
      {
        $addFields: {
          visitDate: {
            $cond: [
              { $eq: ["$entryDate", null] },
              "$currdate",
              "$entryDate"
            ]
          },
          cleanedBranch: {
            $trim: { input: { $toUpper: "$branch" } }
          }
        }
      },
      {
        $facet: {
          overallStats: [
            {
              $group: {
                _id: null,
                totalVisits: { $sum: 1 },
                yearlyVisits: { $sum: { $cond: [
                  { $and: [
                    { $gte: ["$visitDate", financialYearStart.toDate()] },
                    { $lte: ["$visitDate", financialYearEnd.toDate()] }
                  ]}, 1, 0] } },
                monthlyVisits: { $sum: { $cond: [
                  { $and: [
                    { $eq: [{ $year: "$visitDate" }, currentYear] },
                    { $eq: [{ $month: "$visitDate" }, currentMonth] }
                  ]}, 1, 0] } },
                dailyVisits: { $sum: { $cond: [
                  { $and: [
                    { $eq: [{ $year: "$visitDate" }, currentYear] },
                    { $eq: [{ $month: "$visitDate" }, currentMonth] },
                    { $eq: [{ $dayOfMonth: "$visitDate" }, currentDay] }
                  ]}, 1, 0] } }
              }
            }
          ],
          branchStats: [
            {
              $group: {
                _id: "$cleanedBranch",
                totalVisits: { $sum: 1 },
                yearlyVisits: { $sum: { $cond: [
                  { $and: [
                    { $gte: ["$visitDate", financialYearStart.toDate()] },
                    { $lte: ["$visitDate", financialYearEnd.toDate()] }
                  ]}, 1, 0] } },
                monthlyVisits: { $sum: { $cond: [
                  { $and: [
                    { $eq: [{ $year: "$visitDate" }, currentYear] },
                    { $eq: [{ $month: "$visitDate" }, currentMonth] }
                  ]}, 1, 0] } },
                dailyVisits: { $sum: { $cond: [
                  { $and: [
                    { $eq: [{ $year: "$visitDate" }, currentYear] },
                    { $eq: [{ $month: "$visitDate" }, currentMonth] },
                    { $eq: [{ $dayOfMonth: "$visitDate" }, currentDay] }
                  ]}, 1, 0] } }
              }
            },
            {
              $project: {
                branch: "$_id",
                _id: 0,
                totalVisits: 1,
                yearlyVisits: 1,
                monthlyVisits: 1,
                dailyVisits: 1
              }
            },
            { $sort: { branch: 1 } }
          ]
        }
      }
    ];

    const aggregationResult = await DailyVisits.aggregate(pipeline);
    
    // Ensure we always have a default structure
    const defaultResponse = {
      totalVisits: 0,
      yearlyVisits: 0,
      monthlyVisits: 0,
      dailyVisits: 0,
      branchData: []
    };

    if (!aggregationResult || aggregationResult.length === 0) {
      return res.status(200).json(defaultResponse);
    }

    const [result] = aggregationResult;
    const [overallStats] = result?.overallStats || [{}];
    const branchStats = result?.branchStats || [];

    res.status(200).json({
      totalVisits: overallStats?.totalVisits || 0,
      yearlyVisits: overallStats?.yearlyVisits || 0,
      monthlyVisits: overallStats?.monthlyVisits || 0,
      dailyVisits: overallStats?.dailyVisits || 0,
      branchData: branchStats
    });

  } catch (error) {
    console.error("Error fetching visit stats:", error);
    res.status(500).json({
      status: "Error fetching visit data",
      message: error.message
    });
  }
};

export const toggleAttendanceForName = async (req, res) => {
  try {
    const { hrName } = req.query;
    // Find employees
    const employees = await AddEmployee.findOne({
      empname: 
      { 
        $in: [
          new RegExp(`^${hrName}$`, 'i'),
          new RegExp(`^${hrName?.split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()).join(' ')}$`)
        ]
      }
    });
    res.status(200).json({
      ide: employees?._id
    });
  } catch (error) {
    res.status(500).json({
      status: "Error fetching data",
      message: error.message
    });
  }
};

export const getCombinedDataOfEmployeePolicyUpdatePage = async (req, res) => {
  try {
    const { branch } = req.query;

    // Create all promises
    const promises = [
      // Company types
      CType.aggregate([
        {
          $project: {
            _id: 1,
            c_type: 1,
            category: 1,
          }
        },
        { $sort: { c_type: 1 } }
      ]),
      
      // OD discounts
      ODDiscount.aggregate([
        {
          $project: {
            _id: 1,
            odDiscount: 1,
          }
        },
        { $sort: { odDiscount: 1 } }
      ]),
     
      // Advisors
      (async () => {
        const pipeline = [];
        
        if (branch) {
          const branchUpper = branch.toUpperCase();
          pipeline.push({
            $match: { 
              branch: { $regex: new RegExp(branchUpper, 'i') } 
            }
          });
        }

        pipeline.push(
          { $sort: { uniqueid: 1 } },
          {
            $project: {
              _id: 1,
              advisorname: 1,
              uniqueId: 1,
              branch: 1,
              advisortype: 1,
              advisormobile: 1,
              advisoremail: 1,
            }
          }
        );

        return Advisor.aggregate(pipeline);
      })(),
      CC.aggregate([
        {
          $project: {
            _id: 1,
            cc: 1,
          }
        },
        { $sort: { cc: 1 } }
      ]),
      SittingCapacity.aggregate([
        {
          $project: {
            _id: 1,
            sitcapacity: 1,
          }
        },
        { $sort: { sitcapacity: 1 } }
      ]),
      ncbAdd.aggregate([
        {
          $project: {
            _id: 1,
            ncb: 1,
          }
        },
        { $sort: { ncb: 1 } }
      ]),
      // ncbAdd
    ];

    // Execute all queries in parallel
    const [companyTypes, odDiscounts, advisorList, ccList, SitCapacity, ncbList] = await Promise.all(promises);

    // Prepare response
    const response = {
      companyTypes: companyTypes.length > 0 ? companyTypes : null,
      odDiscounts: odDiscounts.length > 0 ? odDiscounts : null,
      advisors: advisorList.length > 0 ? advisorList : null,
      ccList: ccList.length > 0 ? ccList : null,
      SitCapacity: SitCapacity.length > 0 ? SitCapacity : null,
      ncbList: ncbList.length > 0 ? ncbList:null
    };

    // Check if any data exists
    if (!response.companyTypes && !response.odDiscounts && !response.advisors) {
      return res.status(404).json({
        status: "Not Found",
        message: "No data found",
      });
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      status: "Server Error",
      message: error.message,
    });
  }
};