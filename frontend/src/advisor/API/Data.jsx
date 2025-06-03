import { CircleCheckBig, Download, HandCoins, IndianRupee, NotebookText } from "lucide-react";
import VITE_DATA from "../../config/config.jsx";
import { format, parse } from "date-fns";

const monthOptions = [
  { value: "", label: "Select Month" }, // Default option
  ...Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, "0"), // "01", "02", ..., "12"
    label: format(parse(String(i + 1).padStart(2, "0"), "MM", new Date()), "MMMM"), // "January", "February", ..., "December"
  })),
];


const yearOptions = [
  { value: "", label: "Select Year" }, // Default option
  ...Array.from({ length: 125 }, (_, i) => ({
    value: String(new Date().getFullYear() - i), // "2023", "2022", ..., "1900"
    label: String(new Date().getFullYear() - i), // "2023", "2022", ..., "1900"
  })),
];



const Data = {
  Dynamic_cards:[
    {
      id: 1,
      name: "Quotation",
      logo: <NotebookText width={80} height={80}/>,
      path: "quotation"
    },
    {
      id: 2,
      name: "Proposal",
      logo: <HandCoins width={80} height={80}/>,
      path: "proposal"
    },
    {
      id: 3,
      name: "KYC",
      logo: <CircleCheckBig width={80} height={80}/>,
      path: "kyc"
    },
    {
      id: 4,
      name: "Payment",
      logo: <IndianRupee width={80} height={80}/>,
      path: "payment"
    },
    {
      id: 5,
      name: "Download Policy",
      logo: <Download width={80} height={80} />,
       path: "policy"
    },
  ],
  magma_business_types: [
    {
      id: 1,
      name: "New Business",
      TokenLink: `${VITE_DATA}/magma/tokens`,
    },
    {
      id: 2,
      name: "Roll Over",
      TokenLink: `${VITE_DATA}/magma/tokens`,
    },
  ],

  PolicyProductType: [
    { productId: 1, pName: "1TP1OD" },
    { productId: 2, pName: "1TP" },
  ],

  // VEHICLE DETAILS MAGMA HDI
  VehicleDetailsForm: [
    {
      id: "RegistrationDate",
      label: "Registration Date",
      type: "date",
      required: true,
    },
    {
      id: "TempRegistrationDate",
      label: "Temporary Registration Date",
      type: "date",
      show: false
    },
    {
      id: "IsVehicleBharatRegistered",
      label: "Is Veh Bharat Reg.?",
      type: "checkbox",
    },
    {
      id: "BharatVehicleOwnBy",
      label: "Bharat Veh Owned By",
      type: "text",
    },
    {
      id: "RegistrationNumber",
      label: "Registration Number",
      type: "text",
      required: true,
    },
    {
      id: "MonthOfManufacture",
      label: "Month of Manufacture",
      type: "select",
      options: monthOptions,
    },
    {
      id: "YearOfManufacture",
      label: "Year of Manufacture",
      type: "select",
      options: yearOptions,
    },
    {
      id: "ChassisNumber",
      label: "Chassis Number",
      type: "text",
    },
    {
      id: "EngineNumber",
      label: "Engine Number",
      type: "text",
    },
    {
      id: "RTOCode",
      label: "RTO Code",
      type: "text",
    },
    {
      id: "RTOName",
      label: "RTO Name",
      type: "select",
      options: [
        { value: "", label: "Select RTO" },
        { value: "GUMLA", label: "GUMLA" },
        // { value: "Diesel", label: "Diesel" },
        // { value: "Electric", label: "Electric" },
      ],
    },
    {
      id: "ManufactureCode",
      label: "Manufacture Code",
      type: "text",
    },
    {
      id: "ManufactureName",
      label: "Manufacture Name",
      type: "text",
    },
    {
      id: "ModelCode",
      label: "Model Code",
      type: "text",
    },
    {
      id: "ModelName",
      label: "Model Name",
      type: "text",
    },
    {
      id: "HPCC",
      label: "HPCC",
      type: "text",
    },
    {
      id: "VehicleClassCode",
      label: "Veh Class Code",
      type: "text",
    },
    {
      id: "VehicleSubClassCode",
      label: "Veh Sub Class Code",
      type: "text",
    },
    {
      id: "FuelType",
      label: "Fuel Type",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Select Fuel Type" },
        { value: "Petrol", label: "Petrol" },
        { value: "Diesel", label: "Diesel" },
        { value: "Electric", label: "Electric" },
      ],
    },
    {
      id: "SeatingCapacity",
      label: "Seating Capacity",
      type: "text",
    },
    {
      id: "CarryingCapacity",
      label: "Carrying Capacity",
      type: "text",
    },
    {
      id: "BodyTypeCode",
      label: "Body Type Code",
      type: "text",
    },
    {
      id: "BodyTypeName",
      label: "Body Type Name",
      type: "text",
    },
    {
      id: "SeagmentType",
      label: "Segment Type",
      type: "text",
    },
    {
      id: "TACMakeCode",
      label: "TAC Make Code",
      type: "text",
    },
    {
      id: "ElectricVehSpeed",
      label: "Electric Veh Speed",
      type: "number",
    },
    {
      id: "GVW",
      label: "Gross Veh Weight (GVW)",
      type: "text",
    },
    {
      id: "TypeOfBus",
      label: "Type of Bus",
      type: "text",
    },
    {
      id: "MiscTypeOfVehicle",
      label: "Miscellaneous Type of Veh",
      type: "text",
    },
    {
      id: "MiscTypeOfVehicleCode",
      label: "Miscellaneous Type of Veh Code",
      type: "text",
    },

    {
      id: "ExShowroomPrice",
      label: "Ex-Showroom Price",
      type: "text",
    },
    {
      id: "IDVofVehicle",
      label: "IDV of Veh",
      type: "text",
    },
    {
      id: "BodyIDV",
      label: "Body IDV",
      type: "text",
    },
    {
      id: "HigherIDV",
      label: "Higher IDV",
      type: "text",
    },
    {
      id: "LowerIDV",
      label: "Lower IDV",
      type: "text",
    },
    {
      id: "IDVofChassis",
      label: "IDV of Chassis",
      type: "text",
    },
    {
      id: "Zone",
      label: "Zone",
      type: "text",
    },
    {
      id: "IHoldValidPUC",
      label: "I Hold Valid PUC",
      type: "checkbox",
    },
    {
      id: "InsuredHoldsValidPUC",
      label: "Insured Holds Valid PUC",
      type: "checkbox",
    },
    {
      id: "IIBClaimSearchDetails",
      label: "IIB Claim Search Details",
      type: "text",
    },
    {
      id: "IsVIPVehicleRegNo",
      label: "Is VIP Veh Reg. Number?",
      type: "checkbox",
    },
    {
      id: "IsEmbassyVehicleRegNo",
      label: "Is Embassy Veh Reg. No.?",
      type: "checkbox",
    },
    {
      id: "IsVehicleUsedComPriPurposes",
      label: "Is Veh. Commer. Purposes?",
      type: "checkbox",
    },
  ],

  PAOwnerCoverDetails: [
    {
      id: "PAOwnerSI",
      label: "PA Owner SI",
      type: "text",
      required: true, // Set to true if this field is required
    },
    {
      id: "PAOwnerTenure",
      label: "PA Owner Tenure",
      type: "text",
    },
    {
      id: "ValidDrvLicense",
      label: "Valid Driving License",
      type: "checkbox",
      required: false, // Set to true if this field is required
    },
    {
      id: "DoNotHoldValidDrvLicense",
      label: "Don't Hold Valid Driving Lic.",
      type: "checkbox",
      required: false, // Set to true if this field is required
    },
    {
      id: "Ownmultiplevehicles",
      label: "Own Multiple Vehicles",
      type: "checkbox",
      required: false, // Set to true if this field is required
    },
    {
      id: "ExistingPACover",
      label: "Existing PA Cover",
      type: "checkbox",
      required: false, // Set to true if this field is required
    },
  ],

  GeneralProposalInformation: [
    {
      id: "CustomerType",
      label: "Customer Type",
      type: "text",
      required: true,
      show: false
    },
    {
      id: "BusineeChannelType",
      label: "Business Channel Type",
      type: "text",
      required: true,
      show: false
    },
    {
      id: "BusinessSource",
      label: "Business Source",
      type: "text",
      required: true,
      show: false
    },
    {
      id: "IntermediaryCode",
      label: "Intermediary Code",
      type: "text",
      required: true,
      show: false
    },
    {
      id: "IntermediaryName",
      label: "Intermediary Name",
      type: "text",
      required: true,
      show: false
    },
    {
      id: "EntityRelationShipCode",
      label: "Entity Relationship Code",
      type: "text",
      required: true,
      show: false
    },
    {
      id: "EntityRelationShipName",
      label: "Entity Relationship Name",
      type: "text",
      required: true,
      show: false
    },
    {
      id: "ChannelNumber",
      label: "Channel Number",
      type: "text",
      required: true,
      show: false
    },
    {
      id: "DisplayOfficeCode",
      label: "Display Office Code",
      type: "text",
      required: true,
      show: false
    },
    {
      id: "OfficeCode",
      label: "Office Code",
      type: "text",
      required: true,
      show: false
    },
    {
      id: "OfficeName",
      label: "Office Name",
      type: "text",
      required: true,
      show: false
    },
    {
      id: "BusinessSourceType",
      label: "Business Source Type",
      type: "text",
      required: true,
      show: false
    },
    {
      id: "SPCode",
      label: "SP Code",
      type: "text",
      required: true,
      show: false
    },
    {
      id: "SPName",
      label: "SP Name",
      type: "text",
      required: true,
      show: false
    },
    {
      id: "POSPCode",
      label: "POSP Code",
      type: "text",
      required: false
    },
    {
      id: "POSPName",
      label: "POSP Name",
      type: "text",
      required: false
    },
    {
      id: "DetariffLoad",
      label: "Detariff Load",
      type: "text",
      required: false
    },
    {
      id: "DetariffDis",
      label: "Detariff Discount",
      type: "text",
      required: false
    },
    {
      id: "PolicyEffectiveFromDate",
      label: "Policy Effective From Date",
      type: "date",
    },
    {
      id: "PolicyEffectiveToDate",
      label: "Policy Effective To Date",
      type: "date",
    },
    {
      id: "PolicyEffectiveFromHour",
      label: "Policy Effective From Hour",
      type: "text",
      show: false
    },
    {
      id: "PolicyEffectiveToHour",
      label: "Policy Effective To Hour",
      type: "text",
      show: false
    },
    {
      id: "SentPreInspectionLinkTo",
      label: `Sent Pre-Inspection Link To Con`,
      type: "text",
    },
    {
      id: "PreInspectionMobileNo",
      label: "Pre-Inspection Mobile Number",
      type: "text",
    }
  ],
  
  AddOnsPlanApplicableDetails: [
    {
      id: "PlanName",
      label: "Plan Name",
      type: "text",
      required: true,
    },
    {
      id: "ReturnToInvoice",
      label: "Return To Invoice",
      type: "checkbox",
    },
    {
      id: "RoadSideAssistance",
      label: "Road Side Assistance",
      type: "checkbox",
    },
    {
      id: "InconvenienceAllowance",
      label: "Inconvenience Allowance",
      type: "checkbox",
    },
    {
      id: "InconvenienceAllowanceDetails",
      label: "Inconv. Allowance Details",
      type: "text",
    },
    {
      id: "ZeroDepreciation",
      label: "Zero Depreciation",
      type: "checkbox",
    },
    {
      id: "NCBProtection",
      label: "NCB Protection",
      type: "checkbox",
    },
    {
      id: "EngineProtector",
      label: "Engine Protector",
      type: "checkbox",
    },
    {
      id: "KeyReplacement",
      label: "Key Replacement",
      type: "checkbox",
    },
    {
      id: "KeyReplacementDetails",
      label: "Key Replacement Details",
      type: "text",
    },
    {
      id: "LossOfPerBelongings",
      label: "Loss Of Personal Belonging",
      type: "checkbox",
    },
    {
      id: "Consumables",
      label: "Consumables",
      type: "checkbox",
    },
    {
      id: "TyreGuard",
      label: "Tyre Guard",
      type: "checkbox",
    },
    {
      id: "RimSafeguard",
      label: "Rim Safeguard",
      type: "checkbox",
    },
    {
      id: "LossofIncome",
      label: "Loss of Income",
      type: "checkbox",
    },
    {
      id: "LossofIncomeDetails",
      label: "Loss of Income Details",
      type: "text",
    },
    {
      id: "EMIProtector",
      label: "EMI Protector",
      type: "checkbox",
    },
    {
      id: "EMIProtectorDetails",
      label: "EMI Protector Details",
      type: "text",
    },
    {
      id: "LossofDLorRC",
      label: "Loss of DL or RC",
      type: "checkbox",
    },
    {
      id: "BatterySecureChk",
      label: "Battery Secure",
      type: "checkbox",
    },
    {
      id: "AddOnBatterySecurePrem",
      label: "Battery Secure Premium",
      type: "text",
    },
    {
      id: "AdditionalTowingCoverChk",
      label: "Additional Towing Cover",
      type: "checkbox",
    },
    {
      id: "AddOnAdditionalTowingCoverPrem",
      label: "Add. Towing Cover Premium",
      type: "number",
    },
    {
      id: "AdditionalTowingCoverSI",
      label: "Additional Towing Cover SI",
      type: "text",
    },
    {
      id: "MultipleDamageCoverChk",
      label: "Multiple Damage Cover",
      type: "checkbox",
    },
    {
      id: "AddOnMultipleDamageCoverPrem",
      label: "Multiple Damage Cover Prem.",
      type: "text",
    },
    {
      id: "CarSpaCover",
      label: "Car Spa Cover",
      type: "checkbox",
    },
    {
      id: "CarSpaDetails",
      label: "Car Spa Details",
      type: "text",
    },
    {
      id: "ZeroExcessCover",
      label: "Zero Excess Cover",
      type: "checkbox",
    },
    {
      id: "ZeroExcessDetails",
      label: "Zero Excess Details",
      type: "text",
    },
  ],

  OptionalCoverageDetails: [
    {
      id: "ElectricalApplicable",
      label: "Electrical Applicable",
      type: "checkbox",
    },
    {
      id: "ElectricalDetails",
      label: "Electrical Details",
      type: "text",
    },
    {
      id: "NonElectricalApplicable",
      label: "Non-Electrical Applicable",
      type: "checkbox",
    },
    {
      id: "NonElectricalDetails",
      label: "Non-Electrical Details",
      type: "text",
    },
    {
      id: "PAPaidDriverApplicable",
      label: "PA Paid Driver Applicable",
      type: "checkbox",
    },
    {
      id: "PAPaidDriverDetails",
      label: "PA Paid Driver Details",
      type: "text",
    },
    {
      id: "NamedPACoverApplicable",
      label: "Named PA Cover Applic.",
      type: "checkbox",
    },
    {
      id: "NamedPACoverDetails",
      label: "Named PA Cover Details",
      type: "text",
    },
    {
      id: "UnnamedPACoverApplicable",
      label: "Unnamed PA Cover Applic.",
      type: "checkbox",
    },
    {
      id: "UnnamedPACoverDetails",
      label: "Unnamed PA Cover Details",
      type: "text",
    },
    {
      id: "AAMembershipApplicable",
      label: "AA Membership Applicable",
      type: "checkbox",
    },
    {
      id: "AAMembershipDetails",
      label: "AA Membership Details",
      type: "text",
    },
    {
      id: "FiberFuelTankApplicable",
      label: "Fiber Fuel Tank Applicable",
      type: "checkbox",
    },
    {
      id: "FiberFuelTankDetails",
      label: "Fiber Fuel Tank Details",
      type: "text",
    },
    {
      id: "LLPaidDriverCleanerApplicable",
      label: "LL Paid Driv/Clean. Applic.",
      type: "checkbox",
    },
    {
      id: "LLPaidDriverCleanerDetails.NoofPerson",
      label: "No of Person",
      type: "number",
    },
    {
      id: "LLEmployeesApplicable",
      label: "LL Employees Applicable",
      type: "checkbox",
    },
    {
      id: "LLEmployeesDetails",
      label: "LL Employees Details",
      type: "text",
    },
    {
      id: "LLNonEmployeesApplicable",
      label: "LL Non-Employees Applic.",
      type: "checkbox",
    },
    {
      id: "LLNonEmployeesDetails",
      label: "LL Non-Employees Details",
      type: "text",
    },
    {
      id: "LLWorkManApplicable",
      label: "LL Workman Applicable",
      type: "checkbox",
    },
    {
      id: "LLWorkmanDetails",
      label: "LL Workman Details",
      type: "text",
    },
    {
      id: "AdditionalTowingChargesApplicable",
      label: "Add. Towing Charg. Applic.",
      type: "checkbox",
    },
    {
      id: "AdditionalTowingChargesDetails",
      label: "Add. Towing Charges Details",
      type: "text",
    },
    {
      id: "GeographicalExtensionApplicable",
      label: "Geo. Extension Applicable",
      type: "checkbox",
    },
    {
      id: "GeographicalExtensionDetails",
      label: "Geographical Extension Details",
      type: "text",
    },
    {
      id: "TheftAccessoriesApplicable",
      label: "Theft Accessories",
      type: "checkbox",
    },
    {
      id: "TheftAccessoriesDetails",
      label: "Theft Accessories Details",
      type: "text",
    },
    {
      id: "IsSideCarApplicable",
      label: "Is Side Car Applicable",
      type: "checkbox",
    },
    {
      id: "SideCarDetails",
      label: "Side Car Details",
      type: "text",
    },
    {
      id: "TPPDDiscountApplicable",
      label: "TPPD Discount Applicable",
      type: "checkbox",
    },
    {
      id: "TPPDLimitApplicable",
      label: "TPPD Limit Applicable",
      type: "checkbox",
    },
    {
      id: "TPPDLimitDetails",
      label: "TPPD Limit Details",
      type: "text",
    },
    {
      id: "ApprovedAntiTheftDevice",
      label: "Approve Anti-Theft Device",
      type: "checkbox",
    },
    {
      id: "CertifiedbyARAI",
      label: "Certified by ARAI",
      type: "checkbox",
    },
    {
      id: "IsVehicleforHandicapped",
      label: "Is Vehicle for Handicapped",
      type: "checkbox",
    },
    {
      id: "IsVehicleforDrivingTuitions",
      label: "Is Veh. for Driving Tuitions",
      type: "checkbox",
    },
    {
      id: "IsVehicleLimitedOwnPremises",
      label: "Veh. Limited Own Premises",
      type: "checkbox",
    },
    {
      id: "IsVehicleBelongForeignAssembly",
      label: "Veh. Belong Foreign Asse.",
      type: "checkbox",
    },
    {
      id: "InbuiltCNGkitApplicable",
      label: "Inbuilt CNG Kit Applicable",
      type: "checkbox",
    },
    {
      id: "InbuiltLPGkitApplicable",
      label: "Inbuilt LPG Kit Applicable",
      type: "checkbox",
    },
    {
      id: "ExternalCNGkitApplicable",
      label: "External CNG Kit Applic.",
      type: "checkbox",
    },
    {
      id: "ExternalLPGkitApplicable",
      label: "External LPG Kit Applicable",
      type: "checkbox",
    },
    {
      id: "ExternalCNGLPGkitDetails",
      label: "External CNG/LPG Kit Details",
      type: "text",
    },
    {
      id: "IMT23Applicable",
      label: "IMT 23 Applicable",
      type: "checkbox",
    },
    {
      id: "IMT23ApplicableDetails",
      label: "IMT 23 Applicable Details",
      type: "text",
    },
    {
      id: "IMT34Applicable",
      label: "IMT 34 Applicable",
      type: "checkbox",
    },
    {
      id: "IMT34ApplicableDetails",
      label: "IMT 34 Applicable Details",
      type: "text",
    },
    {
      id: "UseofLimitedPermission",
      label: "Use of Limited Permission",
      type: "checkbox",
    },
    {
      id: "LLNFPPCount",
      label: "LL NFPP Count",
      type: "number",
    },
  ],

  PrevPolicyDetails: [
    {
      id: "PrevInsurerCompanyCode",
      label: "Prev Insurer Company Code",
      type: "text",
    },
    {
      id: "PrevNCBPercentage",
      label: "Prev NCB Percentage",
      type: "text",
    },
    {
      id: "HavingClaiminPrevPolicy",
      label: "Having Claim in Prev Policy",
      type: "checkbox",
    },
    {
      id: "NoOfClaims",
      label: "No Of Claims",
      type: "number",
    },
    {
      id: "PrevPolicyEffectiveFromDate",
      label: "Prev Policy Effective From Date",
      type: "date",
    },
    {
      id: "PrevPolicyEffectiveToDate",
      label: "Prev Policy Effective To Date",
      type: "date",
    },
    {
      id: "PrevPolicyNumber",
      label: "Prev Policy Number",
      type: "text",
    },
    // {
    //   id: "PrevPolicyType",
    //   label: "Prev Policy Type",
    //   type: "select",
    //   options: [
    //     { value: "PackagePolicy", label: "Package Policy" },
    //     { value: "ThirdParty", label: "Third Party" },
    //     { value: "Comprehensive", label: "Comprehensive" },
    //   ],
    // },
    {
      id: "PrevAddOnAvialable",
      label: "Prev Add-On Available",
      type: "checkbox",
    },
    {
      id: "PrevPolicyTenure",
      label: "Prev Policy Tenure",
      type: "text",
    },
    {
      id: "IIBStatus",
      label: "IIB Status",
      type: "text",
    },
    {
      id: "PrevInsuranceAddress",
      label: "Prev Insurance Address",
      type: "text",
    },
    {
      id: "DocumentProof",
      label: "Document Proof",
      type: "text",
    },
  ],

  business_types: [
    {
      id: 1,
      name: "New Business",
      value: "01",
      authLink: `${VITE_DATA}/tataaig/auth/details`,
    },
    {
      id: 3,
      name: "Rollover",
      value: "03",
      authLink: `${VITE_DATA}/tataaig/auth/details`,
    },
    {
      id: 4,
      name: "Used Vehicle",
      value: "04",
      authLink: `${VITE_DATA}/tataaig/auth/details`,
    },
  ],


  regPlace: [
    { id: "99", place_reg: "MUMBAI", proposer_pincode: "400001" },
    { id: "98", place_reg: "PATNA", proposer_pincode: "1000001" },
  ],

  policyPlans: [
    { id: "01", name: "Standalone TP (1 year)", variant: "Standalone TP" },
    {
      id: "02",
      name: "Package (1 year OD + 1 year TP)",
      variant: "PackagePolicy",
    },
    { id: "03", name: "Standalone TP (3 years)", variant: "Standalone TP" },
    {
      id: "04",
      name: "Package (1 year OD + 3 years TP)",
      variant: "PackagePolicy",
    },
    { id: "05", name: "Standalone OD (1 year)", variant: "Standalone OD" },
  ],

  customerTypes: [
    { id: "individual", value: "Individual", label: "Individual" },
    { id: "organization", value: "Organization", label: "Organization" },
  ],
  policyTypes: [
    { id: "package", value: "Package", label: "Package" },
    { id: "liability", value: "Liability", label: "Liability" },
  ],

  paOwner: [
    { id: "yes", name: "Yes", value: "true" },
    { id: "no", name: "No", value: "false" },
  ],

  vehicles: [
    {
      vehMake_no: 140,
      vehMake: "TATA MOTORS",
      models: [
        {
          vehModel_no: 10361,
          vehModel: "HARRIER",
          variants: [
            {
              vehVariant_no: "103912",
              vehVariant: "XT",
            },
            {
              vehVariant_no: "103913",
              vehVariant: "XZ",
            },
          ],
        },
        {
          vehModel_no: 10362,
          vehModel: "NEXON",
          variants: [
            {
              vehVariant_no: "104010",
              vehVariant: "XM",
            },
            {
              vehVariant_no: "104011",
              vehVariant: "XZ+",
            },
          ],
        },
      ],
    },
    {
      vehMake_no: 141,
      vehMake: "MARUTI SUZUKI",
      models: [
        {
          vehModel_no: 20400,
          vehModel: "SWIFT",
          variants: [
            {
              vehVariant_no: "204100",
              vehVariant: "VXI",
            },
            {
              vehVariant_no: "204101",
              vehVariant: "ZXI",
            },
          ],
        },
        {
          vehModel_no: 20401,
          vehModel: "BALENO",
          variants: [
            {
              vehVariant_no: "205200",
              vehVariant: "DELTA",
            },
            {
              vehVariant_no: "205201",
              vehVariant: "ALPHA",
            },
          ],
        },
      ],
    },
  ],

  ownerTenure: [1, 3],

  requiredFields: [
    "business_type_no",
    "pol_start_date",
    "pa_owner",
    "dor",
    "tyre_secure",
    "engine_secure",
    "pol_plan_variant",
    "claim_last",
    "claim_last_amount",
    "claim_last_count",
    "cng_lpg_cover",
    "proposer_type",
    "pol_plan_id",
    "place_reg",
    "manu_month",
    "man_year",
    "prev_pol_type",
    "vehicle_make",
    "vehicle_model",
    "vehicle_variant",
    "proposer_mobile",
    "proposer_pincode",
    "tyre_secure_options",
    "engine_secure_options",
    "pa_owner_tenure",
    "pa_owner_declaration",
    "motor_plan_opted",
    "ncb_no_of_claims",
    "Vehicle Reg. No.",
    "proposer_salutation",
    "proposer_gender",
    "proposer_marital",
    "proposer_occupation",
    "nominee_relation",
    "financier_type",
    "ncb_protection",
    "carriedOutBy",
    "proposer_pincode",
    "proposer_mobile",
    "proposer_dob",
    "proposer_fname",
    "proposer_lname",
    "proposer_email",
    "proposer_add1",
    "proposer_add2",
    "vehicle_chassis",
    "vehicle_engine",
    "nominee_name",
    "nominee_relation",
    "nominee_age",
    "financier_type",
    "financier_name",
    "financier_address",
    "pre_insurer_name",
    // "pre_insurer_no",
    // "pre_insurer_address",
    "proposer_gstin",
    "declaration",
  ],
  banks: [
    "AIRTEL PAYMENTS BANK",
    "ALLAHABAD BANK",
    "ANDHRA BANK",
    "ANDHRA PRADESH GRAMEENA VIKAS BANK",
    "AXIS BANK",
    "BANDHAN BANK",
    "BANK OF BARODA",
    "BANK OF INDIA",
    "BANK OF MAHARASHTRA",
    "CATHOLIC SYRIAN BANK",
    "CANARA BANK",
    "CENTRAL BANK OF INDIA",
    "CITY UNION BANK",
    "CORPORATION BANK",
    "DCB BANK",
    "DENA BANK",
    "DHANLAXMI BANK",
    "EQUITAS SMALL FINANCE BANK",
    "ESAF SMALL FINANCE BANK",
    "FEDERAL BANK",
    "FINO PAYMENTS BANK",
    "HDFC BANK",
    "ICICI BANK",
    "IDBI BANK",
    "IDFC FIRST BANK",
    "INDIAN BANK",
    "INDIAN OVERSEAS BANK",
    "INDUSIND BANK",
    "JAMMU & KASHMIR BANK",
    "JANA SMALL FINANCE BANK",
    "KARNATAKA BANK",
    "KARUR VYSYA BANK",
    "KOTAK MAHINDRA BANK",
    "LAKSHMI VILAS BANK",
    "NAINITAL BANK",
    "NORTH EAST SMALL FINANCE BANK",
    "ORIENTAL BANK OF COMMERCE",
    "PAYTM PAYMENTS BANK",
    "PUNJAB & SIND BANK",
    "PUNJAB NATIONAL BANK",
    "RBL BANK",
    "RESERVE BANK OF INDIA",
    "SBM BANK INDIA",
    "SOUTH INDIAN BANK",
    "STATE BANK OF INDIA",
    "SYNDICATE BANK",
    "TAMILNAD MERCANTILE BANK",
    "UCO BANK",
    "UJJIVAN SMALL FINANCE BANK",
    "UNION BANK OF INDIA",
    "UNITED BANK OF INDIA",
    "UTKARSH SMALL FINANCE BANK",
    "VIJAYA BANK",
    "YES BANK",
  ],
  prevInsurer: [
    "THE NEW INDIA ASSURANCE CO. LTD."
  ],

  gender: ["Male", "Female", "Other"],
  occupation: [
    "ACCOUNTANT",
    "ACTOR",
    "ASTRONOMER",
    "AUTO MECHANIC",
    "BARTENDER",
    "BIOLOGIST",
    "CARPENTER",
    "CHEMIST",
    "CHEF",
    "CIVIL ENGINEER",
    "CONSTRUCTION WORKER",
    "DATA SCIENTIST",
    "DENTIST",
    "ELECTRICIAN",
    "EVENT PLANNER",
    "FINANCIAL ANALYST",
    "FITNESS TRAINER",
    "FLIGHT ATTENDANT",
    "GRAPHIC DESIGNER",
    "HR MANAGER",
    "IT SUPPORT SPECIALIST",
    "LAWYER",
    "LOGISTICS MANAGER",
    "MARKETING MANAGER",
    "MECHANICAL ENGINEER",
    "MUSICIAN",
    "NURSE",
    "PHARMACIST",
    "PHOTOGRAPHER",
    "PILOT",
    "PLUMBER",
    "POLICE OFFICER",
    "REAL ESTATE AGENT",
    "RESEARCH SCIENTIST",
    "SOCIAL WORKER",
    "SALES EXECUTIVE",
    "TEACHER",
    "TRANSLATOR",
    "TRAVEL AGENT",
    "VETERINARIAN",
    "WAITER/WAITRESS",
    "WEB DEVELOPER",
    "ENVIRONMENTAL SCIENTIST",
    "ECONOMIST",
    "FIREFIGHTER",
    "OTHER",
  ],

  financier_types: [
    "Hypothecation",
    "Mortgage",
    "Lease",
    "Pledge",
    "Assignment",
    "Lien",
    "Collateral",
  ],

  financier_name: [
    "State Bank of India (SBI)",
    "HDFC Bank",
    "ICICI Bank",
    "Punjab National Bank (PNB)",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank of India",
    "IndusInd Bank",
  ],

  mstatus: ["Single", "Married", "Domestic Partnership"],

  titles: [
    "Adv",
    "Brig",
    "Capt",
    "Col",
    "Cust",
    "Dr",
    "Gen",
    "Hon",
    "Justice",
    "Lady",
    "Lt",
    "Maj",
    "Major",
    "Mast",
    "Md",
    "Mis",
    "Miss",
    "M/s.",
    "Mstr",
    "Mr",
    "Mrs",
    "Ms",
    "Mst",
    "Phd",
    "Prof",
    "Rev",
    "Shri",
    "Sist",
    "Wing Cdr",
    "Wing Commander",
  ],

  ncbvalues: [
    { id: 0, ncb: 0 },
    { id: 1, ncb: 20 },
    { id: 2, ncb: 25 },
    { id: 3, ncb: 35 },
    { id: 4, ncb: 45 },
    { id: 5, ncb: 50 }
  ],
  nomineeRelationships: [
    "Aunt",
    "Brother",
    "Brother-In-law",
    "CHAUFFEUR",
    "Chauffeur",
    "Daughter",
    "Daughter-In-law",
    "Employee",
    "Employer",
    "Fiance",
    "FRIEND",
    "Friend",
    "Father",
    "Father-In-law",
    "Granddaughter",
    "Grandfather",
    "Grandmother",
    "Grandson",
    "Husband",
    "INSURED (SELF-DRIVING)",
    "Insured",
    "Insured Estate",
    "Mother",
    "Mother-In-law",
    "Nephew",
    "Niece",
    "OTHERS",
    "Owner",
    "Partner",
    "RELATIVE",
    "Relatives",
    "Self",
    "Sister",
    "Sister-In-law",
    "Son",
    "Son-In-law",
    "Spouse",
    "Uncle",
    "Wife",
  ],

  policyBundles: [
    {
      motor_plan_opted_no: "P1",
      motor_plan_opted: "SILVER",
      cover: [
        "Repair of glass, plastic fibre, and rubber glass",
        "NCB protection cover",
      ],
    },
    {
      motor_plan_opted_no: "P2",
      motor_plan_opted: "GOLD",
      cover: [
        "Repair of glass, plastic fibre, and rubber glass",
        "Emergency Transport and Hotel Expenses (IDV)",
        "Loss of Personal Belongings (IDV)",
        "NCB protection cover",
        "Roadside Assistance",
        "Key Replacement",
      ],
    },
    {
      motor_plan_opted_no: "P3",
      motor_plan_opted: "PEARL",
      cover: [
        "Repair of glass, plastic fibre, and rubber glass",
        "Emergency Transport and Hotel Expenses (IDV)",
        "Loss of Personal Belongings (IDV)",
        "Depreciation Reimbursement",
        "NCB protection cover",
        "Roadside Assistance",
        "Key Replacement",
      ],
    },
    {
      motor_plan_opted_no: "P4",
      motor_plan_opted: "PEARL+",
      cover: [
        "Repair of glass, plastic fibre, and rubber glass",
        "Emergency Transport and Hotel Expenses (IDV)",
        "Loss of Personal Belongings (IDV)",
        "Depreciation Reimbursement",
        "Consumables Expenses",
        "NCB protection cover",
        "Roadside Assistance",
        "Key Replacement",
        "Engine Secure",
      ],
    },
    {
      motor_plan_opted_no: "P5",
      motor_plan_opted: "SAPPHIRE",
      cover: [
        "Repair of glass, plastic fibre, and rubber glass",
        "Emergency Transport and Hotel Expenses (IDV)",
        "Loss of Personal Belongings (IDV)",
        "Depreciation Reimbursement",
        "Consumables Expenses",
        "NCB protection cover",
        "Roadside Assistance",
        "Key Replacement",
        "Tyre Secure",
      ],
    },
    {
      motor_plan_opted_no: "P6",
      motor_plan_opted: "SAPPHIREPLUS",
      cover: [
        "Repair of glass, plastic fibre, and rubber glass",
        "Emergency Transport and Hotel Expenses (IDV)",
        "Loss of Personal Belongings (IDV)",
        "Depreciation Reimbursement",
        "Consumables Expenses",
        "NCB protection cover",
        "Roadside Assistance",
        "Key Replacement",
        "Engine Secure",
        "Tyre Secure",
      ],
    },
    {
      motor_plan_opted_no: "P7",
      motor_plan_opted: "SAPPHIRE++",
      cover: [
        "Repair of glass, plastic fibre, and rubber glass",
        "Emergency Transport and Hotel Expenses (IDV)",
        "Loss of Personal Belongings (IDV)",
        "Depreciation Reimbursement",
        "Consumables Expenses",
        "NCB protection cover",
        "Roadside Assistance",
        "Return to Invoice",
        "Key Replacement",
        "Engine Secure",
        "Tyre Secure",
      ],
    },
    {
      motor_plan_opted_no: "P10",
      motor_plan_opted: "PLATINUM",
      cover: [
        "Repair of glass, plastic fibre, and rubber glass",
        "Emergency Transport and Hotel Expenses (IDV)",
        "Loss of Personal Belongings (IDV)",
        "Depreciation Reimbursement",
        "NCB protection cover",
        "Roadside Assistance",
        "Return to Invoice",
        "Key Replacement",
        "Engine Secure",
      ],
    },
    {
      motor_plan_opted_no: "P11",
      motor_plan_opted: "CORAL",
      cover: [
        "Repair of glass, plastic fibre, and rubber glass",
        "Emergency Transport and Hotel Expenses (IDV)",
        "Loss of Personal Belongings (IDV)",
        "Depreciation Reimbursement",
        "NCB protection cover",
        "Roadside Assistance",
        "Key Replacement",
      ],
    },
    {
      motor_plan_opted_no: "P12",
      motor_plan_opted: "PEARL++",
      cover: [
        "Repair of glass, plastic fibre, and rubber glass",
        "Emergency Transport and Hotel Expenses (IDV)",
        "Loss of Personal Belongings (IDV)",
        "Depreciation Reimbursement",
        "Consumables Expenses",
        "NCB protection cover",
        "Roadside Assistance",
        "Return to Invoice",
        "Key Replacement",
        "Engine Secure",
      ],
    },
  ],

  pa_owner_declaration: [
    "None",
    "No valid driving license",
    "Other motor policy with CPA",
    "Have standalone CPA >= 15 L",
  ],
  tyre_secure_options: ["DEPRECIATION BASIS", "REPLACEMENT BASIS"],
  engine_secure_options: ["WITH DEDUCTIBLE", "WITHOUT DEDUCTIBLE"],
  voluntary_amount: [2500, 5000, 7500, 15000],
  pre_pol_ncb: [0, 20, 25, 35, 45, 50, 55, 65],
  ncb_no_of_claims: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  marital_status: ["Single", "Married", "Divorced", "Separated", "Widowed"],
  id_type: ["AADHAAR", "CKYC", "CIN", "DL", "PASSPORT", "VOTERID"],

  GeneralInsurance: [
    {
      name: "tata_aig",
      image: "/c1Tata.png",
      img2: "/tataAig.png",
      links: "/login",
      categories: {
        motor: {
          "Pvt-Car": {
            zero: {
              name: "News",
              authLink: `${VITE_DATA}/tataaig/auth/details`,
              quoteLink: "https://uatapigw.tataaig.com/motor/v1/quote",
              custType: ["Individual", "Organisation"],
            },
            new: {
              name: "New",
              authLink: `${VITE_DATA}/tataaig/auth/details`,
              quoteLink: "https://uatapigw.tataaig.com/motor/v1/quote",
              custType: ["Individual", "Organisation"],
            },
            zero1: {
              name: "News1",
              authLink: `${VITE_DATA}/tataaig/auth/details`,
              quoteLink: "https://uatapigw.tataaig.com/motor/v1/quote",
              custType: ["Individual", "Organisation"],
            },
            rollover: {
              name: "Rollover",
              authLink: `${VITE_DATA}/tataaig/auth/details`,
              quoteLink: "https://uatapigw.tataaig.com/motor/v1/quote",
              custType: ["Individual", "Organisation"],
            },
            satp: {
              name: "SATP",
              authLink: `${VITE_DATA}/tataaig/auth/details`,
              quoteLink: "https://uatapigw.tataaig.com/motor/v1/quote",
              custType: ["Individual", "Organisation"],
            },
          },

          "2 Wheeler": {
            new: { name: "New", apiLink: "/api/tata_aig/2_wheeler/new" },
            renewal: {
              name: "Renewal",
              apiLink: "/api/tata_aig/2_wheeler/renewal",
            },
            comprehensive: {
              name: "Comprehensive",
              apiLink: "/api/tata_aig/2_wheeler/comprehensive",
            },
          },

          "Commercial Vehicle": {
            new: {
              name: "New",
              apiLink: "/api/tata_aig/commercial_vehicle/new",
            },
            rollover: {
              name: "Rollover",
              apiLink: "/api/tata_aig/commercial_vehicle/rollover",
            },
            fleet: {
              name: "Fleet",
              apiLink: "/api/tata_aig/commercial_vehicle/fleet",
            },
          },
        },
        nonmotor: ["Travel", "Home", "Business", "Marine"],
        health: ["Health", "Family Health", "Employee Group"],
      },
    },

    {
      name: "magma_hdi",
      image: "/c2Magma.png",
      img2: "/magma.png",
      links: "",
      categories: {
        motor: {
          "Pvt-Car": {
            new: { name: "New", apiLink: "/api/magma_hdi/pvt_car/new" },
            rollover: {
              name: "Rollover",
              apiLink: "/api/magma_hdi/pvt_car/rollover",
            },
            satp: { name: "SATP", apiLink: "/api/magma_hdi/pvt_car/satp" },
          },

          "2 Wheeler": {
            new: { name: "New", apiLink: "/api/magma_hdi/2_wheeler/new" },
            renewal: {
              name: "Renewal",
              apiLink: "/api/magma_hdi/2_wheeler/renewal",
            },
            comprehensive: {
              name: "Comprehensive",
              apiLink: "/api/magma_hdi/2_wheeler/comprehensive",
            },
          },

          "Commercial Vehicle": {
            new: {
              name: "New",
              apiLink: "/api/magma_hdi/commercial_vehicle/new",
            },
            rollover: {
              name: "Rollover",
              apiLink: "/api/magma_hdi/commercial_vehicle/rollover",
            },
            fleet: {
              name: "Fleet",
              apiLink: "/api/magma_hdi/commercial_vehicle/fleet",
            },
          },
        },
        nonmotor: ["Travel", "Home", "Business", "Marine"],
        health: ["Health", "Family Health", "Employee Group"],
      },
    },

    {
      name: "bajaj_allianz",
      image: "/c3Allianz.png",
      img2: "/magma.png",
      links: "",
      categories: {
        motor: {
          "Pvt-Car": {
            new: { name: "New", apiLink: "/api/bajaj_allianz/pvt_car/new" },
            rollover: {
              name: "Rollover",
              apiLink: "/api/bajaj_allianz/pvt_car/rollover",
            },
            satp: { name: "SATP", apiLink: "/api/bajaj_allianz/pvt_car/satp" },
          },

          "2 Wheeler": {
            new: { name: "New", apiLink: "/api/bajaj_allianz/2_wheeler/new" },
            renewal: {
              name: "Renewal",
              apiLink: "/api/bajaj_allianz/2_wheeler/renewal",
            },
            comprehensive: {
              name: "Comprehensive",
              apiLink: "/api/bajaj_allianz/2_wheeler/comprehensive",
            },
          },

          "Commercial Vehicle": {
            new: {
              name: "New",
              apiLink: "/api/bajaj_allianz/commercial_vehicle/new",
            },
            rollover: {
              name: "Rollover",
              apiLink: "/api/bajaj_allianz/commercial_vehicle/rollover",
            },
            fleet: {
              name: "Fleet",
              apiLink: "/api/bajaj_allianz/commercial_vehicle/fleet",
            },
          },
        },
        nonmotor: ["Travel", "Home", "Business", "Marine"],
        health: ["Health", "Family Health", "Employee Group"],
      },
    },

    {
      name: "hdfc_ergo",
      image: "/c4Hdfc.png",
      img2: "/magma.png",
      links: "",
      categories: {
        motor: {
          "Pvt-Car": {
            new: { name: "New", apiLink: "/api/hdfc_ergo/pvt_car/new" },
            rollover: {
              name: "Rollover",
              apiLink: "/api/hdfc_ergo/pvt_car/rollover",
            },
            satp: { name: "SATP", apiLink: "/api/hdfc_ergo/pvt_car/satp" },
          },

          "2 Wheeler": {
            new: { name: "New", apiLink: "/api/hdfc_ergo/2_wheeler/new" },
            renewal: {
              name: "Renewal",
              apiLink: "/api/hdfc_ergo/2_wheeler/renewal",
            },
            comprehensive: {
              name: "Comprehensive",
              apiLink: "/api/hdfc_ergo/2_wheeler/comprehensive",
            },
          },

          "Commercial Vehicle": {
            new: {
              name: "New",
              apiLink: "/api/hdfc_ergo/commercial_vehicle/new",
            },
            rollover: {
              name: "Rollover",
              apiLink: "/api/hdfc_ergo/commercial_vehicle/rollover",
            },
            fleet: {
              name: "Fleet",
              apiLink: "/api/hdfc_ergo/commercial_vehicle/fleet",
            },
          },
        },
        nonmotor: ["Travel", "Home", "Business", "Marine"],
        health: ["Health", "Family Health", "Employee Group"],
      },
    },

    {
      name: "icici_lombard",
      image: "/c4Icici.png",
      img2: "/tataAig.png",
      links: "",
      categories: {
        motor: {
          "Pvt-Car": {
            new: { name: "New", apiLink: "/api/icici_lombard/pvt_car/new" },
            rollover: {
              name: "Rollover",
              apiLink: "/api/icici_lombard/pvt_car/rollover",
            },
            satp: { name: "SATP", apiLink: "/api/icici_lombard/pvt_car/satp" },
          },

          "2 Wheeler": {
            new: { name: "New", apiLink: "/api/icici_lombard/2_wheeler/new" },
            renewal: {
              name: "Renewal",
              apiLink: "/api/icici_lombard/2_wheeler/renewal",
            },
            comprehensive: {
              name: "Comprehensive",
              apiLink: "/api/icici_lombard/2_wheeler/comprehensive",
            },
          },

          "Commercial Vehicle": {
            new: {
              name: "New",
              apiLink: "/api/icici_lombard/commercial_vehicle/new",
            },
            rollover: {
              name: "Rollover",
              apiLink: "/api/icici_lombard/commercial_vehicle/rollover",
            },
            fleet: {
              name: "Fleet",
              apiLink: "/api/icici_lombard/commercial_vehicle/fleet",
            },
          },
        },
        nonmotor: ["Travel", "Home", "Business", "Marine"],
        health: ["Health", "Family Health", "Employee Group"],
      },
    },

    {
      name: "iffco_tokio",
      image: "/c6Iffico.png",
      img2: "/magma.png",
      links: "",
      categories: {
        motor: {
          "Pvt-Car": {
            new: { name: "New", apiLink: "/api/iffco_tokio/pvt_car/new" },
            rollover: {
              name: "Rollover",
              apiLink: "/api/iffco_tokio/pvt_car/rollover",
            },
            satp: { name: "SATP", apiLink: "/api/iffco_tokio/pvt_car/satp" },
          },

          "2 Wheeler": {
            new: { name: "New", apiLink: "/api/iffco_tokio/2_wheeler/new" },
            renewal: {
              name: "Renewal",
              apiLink: "/api/iffco_tokio/2_wheeler/renewal",
            },
            comprehensive: {
              name: "Comprehensive",
              apiLink: "/api/iffco_tokio/2_wheeler/comprehensive",
            },
          },

          "Commercial Vehicle": {
            new: {
              name: "New",
              apiLink: "/api/iffco_tokio/commercial_vehicle/new",
            },
            rollover: {
              name: "Rollover",
              apiLink: "/api/iffco_tokio/commercial_vehicle/rollover",
            },
            fleet: {
              name: "Fleet",
              apiLink: "/api/iffco_tokio/commercial_vehicle/fleet",
            },
          },
        },
        nonmotor: ["Travel", "Home", "Business", "Marine"],
        health: ["Health", "Family Health", "Employee Group"],
      },
    },
    {
      name: "future_generali",
      image: "/c7future.png",
      img2: "/magma.png",
      links: "",
      categories: {
        motor: {
          "Pvt-Car": {
            new: { name: "New", apiLink: "/api/future_generali/pvt_car/new" },
            rollover: {
              name: "Rollover",
              apiLink: "/api/future_generali/pvt_car/rollover",
            },
            satp: {
              name: "SATP",
              apiLink: "/api/future_generali/pvt_car/satp",
            },
          },

          "2 Wheeler": {
            new: { name: "New", apiLink: "/api/future_generali/2_wheeler/new" },
            renewal: {
              name: "Renewal",
              apiLink: "/api/future_generali/2_wheeler/renewal",
            },
            comprehensive: {
              name: "Comprehensive",
              apiLink: "/api/future_generali/2_wheeler/comprehensive",
            },
          },

          "Commercial Vehicle": {
            new: {
              name: "New",
              apiLink: "/api/future_generali/commercial_vehicle/new",
            },
            rollover: {
              name: "Rollover",
              apiLink: "/api/future_generali/commercial_vehicle/rollover",
            },
            fleet: {
              name: "Fleet",
              apiLink: "/api/future_generali/commercial_vehicle/fleet",
            },
          },
        },
        nonmotor: ["Travel", "Home", "Business", "Marine"],
        health: ["Health", "Family Health", "Employee Group"],
      },
    },
    {
      name: "liberty",
      image: "/c8Liberty.png",
      img2: "/magma.png",
      links: "",
      categories: {
        motor: {
          "Pvt-Car": {
            new: { name: "New", apiLink: "/api/liberty/pvt_car/new" },
            rollover: {
              name: "Rollover",
              apiLink: "/api/liberty/pvt_car/rollover",
            },
            satp: { name: "SATP", apiLink: "/api/liberty/pvt_car/satp" },
          },

          "2 Wheeler": {
            new: { name: "New", apiLink: "/api/liberty/2_wheeler/new" },
            renewal: {
              name: "Renewal",
              apiLink: "/api/liberty/2_wheeler/renewal",
            },
            comprehensive: {
              name: "Comprehensive",
              apiLink: "/api/liberty/2_wheeler/comprehensive",
            },
          },

          "Commercial Vehicle": {
            new: {
              name: "New",
              apiLink: "/api/liberty/commercial_vehicle/new",
            },
            rollover: {
              name: "Rollover",
              apiLink: "/api/liberty/commercial_vehicle/rollover",
            },
            fleet: {
              name: "Fleet",
              apiLink: "/api/liberty/commercial_vehicle/fleet",
            },
          },
        },
        nonmotor: ["Travel", "Home", "Business", "Marine"],
        health: ["Health", "Family Health", "Employee Group"],
      },
    },
  ],

  LifeInsurance: [
    // Add life insurance data here
    {
      name: "PNB MetLife",
      image: "/l1pnb.png",
      links:
        "https://www.pnbmetlife.com/wps/PA_CustomerLogin/jsp/UserRegistration.jsp",
    },
    {
      name: "LIC",
      image: "/l2lic.png",
      links: "https://ebiz.licindia.in/D2CPM/#Login",
    },
    {
      name: "TATA AIA",
      image: "/l3aia.png",
      links: "https://grip.tataaia.com/TVG/",
    },
  ],

  HealthInsurance: [
    // Add health insurance data here
    {
      name: "Health Guard",
      image: "https://example.com/images/health_guard.jpg",
      links: "",
    },
    {
      name: "Wellness Plan",
      image: "https://example.com/images/wellness_plan.jpg",
      links: "",
    },
  ],
};
// console.log(Data);

export default Data;
