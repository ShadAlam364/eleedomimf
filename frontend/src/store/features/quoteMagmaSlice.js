import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import VITE_DATA from "./../../config/config";
import { toast } from "react-toastify";

const initialState = {
  BusinessType: "",
  PolicyProductType: "",
  ProposalDate: "",
  VehicleDetails: {
    RegistrationDate: "",
    TempRegistrationDate: null,
    IsVehicleBharatRegistered: false,
    BharatVehicleOwnBy: null,
    RegistrationNumber: "",
    MonthOfManufacture: "",
    YearOfManufacture: "",
    ChassisNumber: "",
    EngineNumber: "",
    RTOCode: "",
    RTOName: "",
    ManufactureCode: "",
    ManufactureName: "",
    ModelCode: "",
    ModelName: "",
    HPCC: "",
    VehicleClassCode: "",
    VehicleSubClassCode: null,
    SeatingCapacity: "",
    CarryingCapacity: "",
    BodyTypeCode: "",
    BodyTypeName: "",
    FuelType: "",
    SeagmentType: "",
    TACMakeCode: "",
    ElectricVehSpeed: null,
    GVW: "",
    TypeOfBus: null,
    MiscTypeOfVehicle: "",
    MiscTypeOfVehicleCode: "",
    IsVehicleUsedComPriPurposes: false,
    ExShowroomPrice: "",
    IDVofVehicle: "",
    BodyIDV: null,
    HigherIDV: null,
    LowerIDV: null,
    IDVofChassis: null,
    Zone: "",
    IHoldValidPUC: false,
    InsuredHoldsValidPUC: false,
    IIBClaimSearchDetails: null,
    IsVIPVehicleRegNo: false,
    IsEmbassyVehicleRegNo: false,
  },

  GeneralProposalInformation: {
    CustomerType: "I",
    BusineeChannelType: "INSURANCE MARKETING FIRM",
    BusinessSource: "INTERMEDIARY",
    IntermediaryCode: "IMF0000021",
    IntermediaryName: "ELEEDOM IMF PRIVATE LIMITED",
    EntityRelationShipCode: "10000061594",
    EntityRelationShipName: "ELEEDOM IMF PRIVATE LIMITED",
    ChannelNumber: "INTR-41-523481",
    DisplayOfficeCode: "400002",
    OfficeCode: "400008",
    OfficeName: "PATNA",
    BusinessSourceType: "P_AGENT",
    SPCode: "G00869",
    SPName: "NISHANT SINHA",
    POSPCode: null,
    POSPName: null,
    DetariffLoad: "",
    DetariffDis: "",
    PolicyEffectiveFromDate: "",
    PolicyEffectiveToDate: "",
    PolicyEffectiveFromHour: "",
    PolicyEffectiveToHour: "23:59",
    SentPreInspectionLinkTo: null,
    PreInspectionMobileNo: null,
  },

  PAOwnerCoverApplicable: false,
  PAOwnerCoverDetails: null,
  // {
  //   PAOwnerSI: "",
  //   PAOwnerTenure: "",
  //   ValidDrvLicense: false,
  //   DoNotHoldValidDrvLicense: false,
  //   Ownmultiplevehicles: false,
  //   ExistingPACover: false,
  // },

  AddOnsPlanApplicable: false,
  AddOnsPlanApplicableDetails: null,
  // AddOnsPlanApplicableDetails: {
  //       PlanName: "",
  //       ReturnToInvoice: false,
  //       RoadSideAssistance: false,
  //       InconvenienceAllowance: false,
  //       InconvenienceAllowanceDetails: null,
  //       ZeroDepreciation: true,
  //       NCBProtection: false,
  //       EngineProtector: false,
  //       KeyReplacement: false,
  //       KeyReplacementDetails: null,
  //       LossOfPerBelongings: false,
  //       Consumables: true,
  //       TyreGuard: false,
  //       RimSafeguard: false,
  //       LossofIncome: false,
  //       LossofIncomeDetails: null,
  //       EMIProtector: false,
  //       EMIProtectorDetails: null,
  //       LossofDLorRC: false,
  //       BatterySecureChk: false,
  //       AddOnBatterySecurePrem: null,
  //       AdditionalTowingCoverChk: false,
  //       AddOnAdditionalTowingCoverPrem: 0.0,
  //       AdditionalTowingCoverSI: null,
  //       MultipleDamageCoverChk: false,
  //       AddOnMultipleDamageCoverPrem: 0.0,
  //       CarSpaCover: false,
  //       CarSpaDetails: null,
  //       ZeroExcessCover: false,
  //       ZeroExcessDetails: null,
  //     },

  OptionalCoverageApplicable: false,
  OptionalCoverageDetails: null,
  CompulsoryExcessAmount: "",
  VoluntaryExcessAmount: null,
  ImposedExcessAmount: "",

  IsPrevPolicyApplicable: false,
  PrevPolicyDetails: {
    PrevInsurerCompanyCode: "",
    PrevNCBPercentage: "",
    HavingClaiminPrevPolicy: false,
    NoOfClaims: null,
    PrevPolicyEffectiveFromDate: "",
    PrevPolicyEffectiveToDate: "",
    PrevPolicyNumber: "",
    PrevPolicyType: "PackagePolicy",
    PrevAddOnAvialable: false,
    PrevPolicyTenure: "",
    IIBStatus: "",
    PrevInsuranceAddress: "",
    DocumentProof: null,
  },

  IsTrailerVehicleApplicable: false,
  TrailersDetails: null,
  status: "idle",
  error: null,
};
export const submitMagmaQuote = createAsyncThunk(
  "quote/submitQuote",
  async (quoteData, { getState, rejectWithValue }) => {
    console.log(quoteData);

    try {
      const state = getState();
      const token = state?.token?.token;

      if (!token) {
        toast.error("No token available.");
        return rejectWithValue("No token available");
      }

      const response = await axios.post(
        `${VITE_DATA}/magma/gcv/quote`,
        quoteData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      
      if (response.data.ErrorText) {
        toast.error(response?.data?.ErrorText);
        return rejectWithValue(response.data.ErrorText);
      }
      toast.success("Quote submitted successfully!");
      return response?.data;
    } catch (error) {
      console.log(error?.response?.data?.error);
      toast.error(error?.response?.data?.error);
      return rejectWithValue(error?.response?.data?.error);
    }
  }
)

const quoteMagmaSlice = createSlice({
  name: "magmaquote",
  initialState,
  reducers: {
    magmaQuotes: (state, action) => {
      const { field, value } = action.payload;

      // Handle BusinessType changes
      if (field === "BusinessType") {
        state[field] = value;

        // Reset dependent fields when BusinessType changes
        if (value === "New Business") {
          state.VehicleDetails.TACMakeCode = null;
          state.VehicleDetails.MiscTypeOfVehicle = "";
          state.VehicleDetails.MiscTypeOfVehicleCode = "";
          state.GeneralProposalInformation.POSPCode = null;
          state.GeneralProposalInformation.POSPName = null;

          // Reset Roll Over specific fields
          state.HigherIDV = null;
          state.LowerIDV = null;
          state.IDVofChassis = null;
          state.ImposedExcessAmount = "";
          state.IsPrevPolicyApplicable = false;
          state.PrevPolicyDetails = initialState.PrevPolicyDetails;
        } else if (value === "Roll Over") {
          // Reset New Business specific fields
          state.VehicleDetails.ElectricVehSpeed = null;
          state.VehicleDetails.TypeOfBus = null;
          state.VehicleDetails.BodyIDV = null;
          state.AddOnsPlanApplicable = false;
          state.AddOnsPlanApplicableDetails = null;
          state.OptionalCoverageApplicable = false;
          state.OptionalCoverageDetails = null;
          state.VoluntaryExcessAmount = null;

          // Only keep PrevPolicyDetails if PolicyProductType is "1TP"
          if (state.PolicyProductType !== "1TP") {
            state.IsPrevPolicyApplicable = false;
            state.PrevPolicyDetails = initialState.PrevPolicyDetails;
          }
        }
        return;
      }

      // Handle PolicyProductType changes
      if (field === "PolicyProductType") {
        state[field] = value;

        // If BusinessType is "Roll Over" and PolicyProductType is not "1TP", reset PrevPolicyDetails
        if (state.BusinessType === "Roll Over" && value !== "1TP") {
          state.IsPrevPolicyApplicable = false;
          state.PrevPolicyDetails = initialState.PrevPolicyDetails;
        }

        // Handle Detariff fields for New Business or Roll Over with 1TP1OD
        if (
          state.BusinessType === "New Business" ||
          (state.BusinessType === "Roll Over" && value === "1TP1OD")
        ) {
          state.GeneralProposalInformation.DetariffLoad = "";
          state.GeneralProposalInformation.DetariffDis = "";
        } else {
          state.GeneralProposalInformation.DetariffLoad = null;
          state.GeneralProposalInformation.DetariffDis = null;
        }

        // Handle PA Owner Cover for New Business or Roll Over with 1TP
        if (
          (state.BusinessType === "New Business" ||
            state.BusinessType === "Roll Over") &&
          value === "1TP1OD"
        ) {
          
          state.PAOwnerCoverApplicable = false;
          state.PAOwnerCoverDetails = initialState.PAOwnerCoverDetails;
        }
        return;
      }
      // Handle other fields
      state[field] = value;
    },

    magmaVehicleDetails: (state, action) => {
      const { field, value } = action.payload;
      state.VehicleDetails[field] = value;
    },

    magmaGeneralProposalInformation: (state, action) => {
      const { field, value } = action.payload;
      state.GeneralProposalInformation[field] = value;
    },

    magmaPAOwnerCoverDetails: (state, action) => {
      const { field, value } = action.payload;
      // Only allow updates if PAOwnerCover is applicable
      if(field === "PAOwnerCoverApplicable"){
        state[field] = value;
        console.log(value);
        if (!value) {
          state.PAOwnerCoverDetails = null;
        } else {
          state.PAOwnerCoverDetails =
           {
            PAOwnerSI: "",
            PAOwnerTenure: "",
            ValidDrvLicense: false,
            DoNotHoldValidDrvLicense: false,
            Ownmultiplevehicles: false,
            ExistingPACover: false,
          }
        }
      }
    //  else if (state.PAOwnerCoverApplicable) {
    //     state.PAOwnerCoverDetails[field] = value;
    //   }
    },

    magmaAddOnsPlanApplicableDetails: (state, action) => {
      const { field, value } = action.payload;

      // Only allow updates if BusinessType is not "Roll Over"
      if (state.BusinessType !== "Roll Over") {
        if (field === "AddOnsPlanApplicable") {
          state[field] = value;
          if (!value) {
            state.AddOnsPlanApplicableDetails = null;
          } else {
            state.AddOnsPlanApplicableDetails = {
              PlanName: "",
              ReturnToInvoice: false,
              RoadSideAssistance: false,
              InconvenienceAllowance: false,
              InconvenienceAllowanceDetails: null,
              ZeroDepreciation: true,
              NCBProtection: false,
              EngineProtector: false,
              KeyReplacement: false,
              KeyReplacementDetails: null,
              LossOfPerBelongings: false,
              Consumables: true,
              TyreGuard: false,
              RimSafeguard: false,
              LossofIncome: false,
              LossofIncomeDetails: null,
              EMIProtector: false,
              EMIProtectorDetails: null,
              LossofDLorRC: false,
              BatterySecureChk: false,
              AddOnBatterySecurePrem: null,
              AdditionalTowingCoverChk: false,
              AddOnAdditionalTowingCoverPrem: 0.0,
              AdditionalTowingCoverSI: null,
              MultipleDamageCoverChk: false,
              AddOnMultipleDamageCoverPrem: 0.0,
              CarSpaCover: false,
              CarSpaDetails: null,
              ZeroExcessCover: false,
              ZeroExcessDetails: null,
            };
          }
        }
      }
    },

    magmaOptionalCoverageDetails: (state, action) => {
      const { field, value } = action.payload;
      // Only allow updates if OptionalCoverage is applicable and BusinessType is not "Roll Over"

      if (state.BusinessType !== "Roll Over") {
        if (field === "OptionalCoverageApplicable") {
          state[field] = value;
          if (!value) {
            state.OptionalCoverageDetails = null;
          } else {
            state.OptionalCoverageDetails = {
              ElectricalApplicable: false,
              ElectricalDetails: null,
              NonElectricalApplicable: false,
              NonElectricalDetails: null,
              PAPaidDriverApplicable: false,
              PAPaidDriverDetails: null,
              NamedPACoverApplicable: false,
              NamedPACoverDetails: null,
              UnnamedPACoverApplicable: false,
              UnnamedPACoverDetails: null,
              AAMembershipApplicable: false,
              AAMembershipDetails: null,
              FiberFuelTankApplicable: false,
              FiberFuelTankDetails: null,
              LLPaidDriverCleanerApplicable: false,
              LLPaidDriverCleanerDetails: {
                NoofPerson: "",
              },
              LLEmployeesApplicable: false,
              LLEmployeesDetails: null,
              LLNonEmployeesApplicable: false,
              LLNonEmployeesDetails: null,
              LLWorkManApplicable: false,
              LLWorkmanDetails: null,
              AdditionalTowingChargesApplicable: false,
              AdditionalTowingChargesDetails: null,
              GeographicalExtensionApplicable: false,
              GeographicalExtensionDetails: null,
              TheftAccessoriesApplicable: false,
              TheftAccessoriesDetails: null,
              IsSideCarApplicable: false,
              SideCarDetails: null,
              TPPDDiscountApplicable: false,
              TPPDLimitApplicable: false,
              TPPDLimitDetails: null,
              ApprovedAntiTheftDevice: false,
              CertifiedbyARAI: false,
              IsVehicleforHandicapped: false,
              IsVehicleforDrivingTuitions: false,
              IsVehicleLimitedOwnPremises: false,
              IsVehicleBelongForeignAssembly: false,
              InbuiltCNGkitApplicable: false,
              InbuiltLPGkitApplicable: false,
              ExternalCNGkitApplicable: false,
              ExternalLPGkitApplicable: false,
              ExternalCNGLPGkitDetails: null,
              IMT23Applicable: true,
              IMT23ApplicableDetails: null,
              IMT34Applicable: false,
              IMT34ApplicableDetails: null,
              UseofLimitedPermission: false,
              LLNFPPCount: null,
            };
          }
        } else if (state.OptionalCoverageDetails) {
          state.OptionalCoverageDetails[field] = value;
        }
      }
    },

    magmaPrevPolicyDetails: (state, action) => {
      const { field, value } = action.payload;
      // Only allow updates if PrevPolicy is applicable and BusinessType is "Roll Over" with PolicyProductType "1TP"
      if (
        state.IsPrevPolicyApplicable &&
        state.BusinessType === "Roll Over" &&
        state.PolicyProductType === "1TP"
      ) {
        state.PrevPolicyDetails[field] = value;
      }
    },

    resetMagmaQuote: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(submitMagmaQuote.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(submitMagmaQuote.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload.message;
      })
      .addCase(submitMagmaQuote.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  magmaQuotes,
  magmaVehicleDetails,
  magmaGeneralProposalInformation,
  magmaPAOwnerCoverDetails,
  magmaAddOnsPlanApplicableDetails,
  magmaOptionalCoverageDetails,
  magmaPrevPolicyDetails,
  resetMagmaQuote,
} = quoteMagmaSlice.actions;
export default quoteMagmaSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import VITE_DATA from "./../../config/config";
// import { toast } from "react-toastify";

// const initialState = {
//   BusinessType: "",
//   PolicyProductType: "",
//   ProposalDate: "",
//   VehicleDetails: {
//     RegistrationDate: "",
//     TempRegistrationDate: null,
//     IsVehicleBharatRegistered: false,
//     BharatVehicleOwnBy: null,
//     RegistrationNumber: "",
//     MonthOfManufacture: "",
//     YearOfManufacture: "",
//     ChassisNumber: "",
//     EngineNumber: "",
//     RTOCode: "",
//     RTOName: "",
//     ManufactureCode: "",
//     ManufactureName: "",
//     ModelCode: "",
//     ModelName: "",
//     HPCC: "",
//     VehicleClassCode: "",
//     VehicleSubClassCode: null,
//     SeatingCapacity: "",
//     CarryingCapacity: "",
//     BodyTypeCode: "",
//     BodyTypeName: "",
//     FuelType: "",
//     SeagmentType: "",
//     TACMakeCode: "",
//     ElectricVehSpeed: null,
//     GVW: "",
//     TypeOfBus: null,
//     MiscTypeOfVehicle: "",
//     MiscTypeOfVehicleCode: "",
//     IsVehicleUsedComPriPurposes: false,
//     ExShowroomPrice: "",
//     IDVofVehicle: "",
//     BodyIDV: null,
//     HigherIDV: null,
//     LowerIDV: null,
//     IDVofChassis: null,
//     Zone: "",
//     IHoldValidPUC: false,
//     InsuredHoldsValidPUC: false,
//     IIBClaimSearchDetails: null,
//     IsVIPVehicleRegNo: false,
//     IsEmbassyVehicleRegNo: false,
//   },

//   GeneralProposalInformation: {
//     CustomerType: "I",
//     BusineeChannelType: "INSURANCE MARKETING FIRM",
//     BusinessSource: "INTERMEDIARY",
//     IntermediaryCode: "IMF0000021",
//     IntermediaryName: "ELEEDOM IMF PRIVATE LIMITED",
//     EntityRelationShipCode: "10000061594",
//     EntityRelationShipName: "ELEEDOM IMF PRIVATE LIMITED",
//     ChannelNumber: "INTR-41-523481",
//     DisplayOfficeCode: "400002",
//     OfficeCode: "400008",
//     OfficeName: "PATNA",
//     BusinessSourceType: "P_AGENT",
//     SPCode: "G00869",
//     SPName: "NISHANT SINHA",
//     POSPCode: "",
//     POSPName: "",
//     DetariffLoad: null,
//     DetariffDis: "",
//     PolicyEffectiveFromDate: "",
//     PolicyEffectiveToDate: "",
//     PolicyEffectiveFromHour: "",
//     PolicyEffectiveToHour: "",
//     SentPreInspectionLinkTo: null,
//     PreInspectionMobileNo: null,
//   },

//   PAOwnerCoverApplicable: true,
//   PAOwnerCoverDetails: {
//     PAOwnerSI: "",
//     PAOwnerTenure: "",
//     ValidDrvLicense: false,
//     DoNotHoldValidDrvLicense: false,
//     Ownmultiplevehicles: false,
//     ExistingPACover: false,
//   },

//   AddOnsPlanApplicable: false,
//   AddOnsPlanApplicableDetails: null,
//   // AddOnsPlanApplicableDetails: {
//   //   PlanName: "",
//   //   ReturnToInvoice: false,
//   //   RoadSideAssistance: false,
//   //   InconvenienceAllowance: false,
//   //   InconvenienceAllowanceDetails: null,
//   //   ZeroDepreciation: true,
//   //   NCBProtection: false,
//   //   EngineProtector: false,
//   //   KeyReplacement: false,
//   //   KeyReplacementDetails: null,
//   //   LossOfPerBelongings: false,
//   //   Consumables: true,
//   //   TyreGuard: false,
//   //   RimSafeguard: false,
//   //   LossofIncome: false,
//   //   LossofIncomeDetails: null,
//   //   EMIProtector: false,
//   //   EMIProtectorDetails: null,
//   //   LossofDLorRC: false,
//   //   BatterySecureChk: false,
//   //   AddOnBatterySecurePrem: null,
//   //   AdditionalTowingCoverChk: false,
//   //   AddOnAdditionalTowingCoverPrem: 0.0,
//   //   AdditionalTowingCoverSI: null,
//   //   MultipleDamageCoverChk: false,
//   //   AddOnMultipleDamageCoverPrem: 0.0,
//   //   CarSpaCover: false,
//   //   CarSpaDetails: null,
//   //   ZeroExcessCover: false,
//   //   ZeroExcessDetails: null,
//   // },

//   OptionalCoverageApplicable: false,
//   CompulsoryExcessAmount: "",
//   VoluntaryExcessAmount: null,
//   ImposedExcessAmount: "",
//   // OptionalCoverageDetails: null,
//   // OptionalCoverageDetails: {
//   //   ElectricalApplicable: false,
//   //   ElectricalDetails: null,
//   //   NonElectricalApplicable: false,
//   //   NonElectricalDetails: null,
//   //   PAPaidDriverApplicable: false,
//   //   PAPaidDriverDetails: null,
//   //   NamedPACoverApplicable: false,
//   //   NamedPACoverDetails: null,
//   //   UnnamedPACoverApplicable: false,
//   //   UnnamedPACoverDetails: null,
//   //   AAMembershipApplicable: false,
//   //   AAMembershipDetails: null,
//   //   FiberFuelTankApplicable: false,
//   //   FiberFuelTankDetails: null,
//   //   LLPaidDriverCleanerApplicable: false,
//   //   LLPaidDriverCleanerDetails: {
//   //     NoofPerson: "",
//   //   },
//   //   LLEmployeesApplicable: false,
//   //   LLEmployeesDetails: null,
//   //   LLNonEmployeesApplicable: false,
//   //   LLNonEmployeesDetails: null,
//   //   LLWorkManApplicable: false,
//   //   LLWorkmanDetails: null,
//   //   AdditionalTowingChargesApplicable: false,
//   //   AdditionalTowingChargesDetails: null,
//   //   GeographicalExtensionApplicable: false,
//   //   GeographicalExtensionDetails: null,
//   //   TheftAccessoriesApplicable: false,
//   //   TheftAccessoriesDetails: null,
//   //   IsSideCarApplicable: false,
//   //   SideCarDetails: null,
//   //   TPPDDiscountApplicable: false,
//   //   TPPDLimitApplicable: false,
//   //   TPPDLimitDetails: null,
//   //   ApprovedAntiTheftDevice: false,
//   //   CertifiedbyARAI: false,
//   //   IsVehicleforHandicapped: false,
//   //   IsVehicleforDrivingTuitions: false,
//   //   IsVehicleLimitedOwnPremises: false,
//   //   IsVehicleBelongForeignAssembly: false,
//   //   InbuiltCNGkitApplicable: false,
//   //   InbuiltLPGkitApplicable: false,
//   //   ExternalCNGkitApplicable: false,
//   //   ExternalLPGkitApplicable: false,
//   //   ExternalCNGLPGkitDetails: null,
//   //   IMT23Applicable: true,
//   //   IMT23ApplicableDetails: null,
//   //   IMT34Applicable: false,
//   //   IMT34ApplicableDetails: null,
//   //   UseofLimitedPermission: false,
//   //   LLNFPPCount: null,
//   // },

//   IsPrevPolicyApplicable: false,
//   PrevPolicyDetails: {
//     PrevInsurerCompanyCode: "",
//     PrevNCBPercentage: "",
//     HavingClaiminPrevPolicy: false,
//     NoOfClaims: null,
//     PrevPolicyEffectiveFromDate: "",
//     PrevPolicyEffectiveToDate: "",
//     PrevPolicyNumber: "",
//     PrevPolicyType: "PackagePolicy",
//     PrevAddOnAvialable: false,
//     PrevPolicyTenure: "",
//     IIBStatus: "",
//     PrevInsuranceAddress: "",
//     DocumentProof: null,
//   },

//   IsTrailerVehicleApplicable: false,
//   TrailersDetails: null,
//   status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
//   error: null,
// };

// export const submitMagmaQuote = createAsyncThunk(
//   "quote/submitQuote",
//   async (quoteData, { getState, rejectWithValue }) => {
//     console.log(quoteData);
//     try {
//       const state = getState();
//       const token = state?.token?.token;

//       if (!token) {
//         toast.error("No token available.");
//         return rejectWithValue("No token available");
//       }

//       const response = await axios.post(
//         `${VITE_DATA}/magma/gcv/quote`,
//         quoteData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       if (response.data.ErrorText) {
//         toast.error(response?.data?.ErrorText);
//         return rejectWithValue(response.data.ErrorText);
//       }
//       toast.success("Quote submitted successfully!");
//       return response?.data;
//     } catch (error) {
//       const errorMsg =
//         error.response?.data?.ErrorText || "Failed to submit quote";
//       toast.error(errorMsg);
//       return rejectWithValue(errorMsg);
//     }
//   }
// );

// const quoteMagmaSlice = createSlice({
//   name: "magmaquote",
//   initialState,
//   reducers: {
//     magmaQuotes: (state, action) => {
//       const { field, value } = action.payload;
//       if (field === "AddOnsPlanApplicable") {
//         state[field] = value;
//         if (!value) {
//           state.AddOnsPlanApplicableDetails = null;
//         } else {
//           state.AddOnsPlanApplicableDetails = {
//             PlanName: "",
//             ReturnToInvoice: false,
//             RoadSideAssistance: false,
//             InconvenienceAllowance: false,
//             InconvenienceAllowanceDetails: null,
//             ZeroDepreciation: true,
//             NCBProtection: false,
//             EngineProtector: false,
//             KeyReplacement: false,
//             KeyReplacementDetails: null,
//             LossOfPerBelongings: false,
//             Consumables: true,
//             TyreGuard: false,
//             RimSafeguard: false,
//             LossofIncome: false,
//             LossofIncomeDetails: null,
//             EMIProtector: false,
//             EMIProtectorDetails: null,
//             LossofDLorRC: false,
//             BatterySecureChk: false,
//             AddOnBatterySecurePrem: null,
//             AdditionalTowingCoverChk: false,
//             AddOnAdditionalTowingCoverPrem: 0.0,
//             AdditionalTowingCoverSI: null,
//             MultipleDamageCoverChk: false,
//             AddOnMultipleDamageCoverPrem: 0.0,
//             CarSpaCover: false,
//             CarSpaDetails: null,
//             ZeroExcessCover: false,
//             ZeroExcessDetails: null,
//           };
//         }
//         return;
//       } else if (field === "OptionalCoverageApplicable") {
//         state[field] = value;
//         if (!value) {
//           state.OptionalCoverageDetails = null;
//         } else {
//           state.OptionalCoverageDetails = {
//             ElectricalApplicable: false,
//             ElectricalDetails: null,
//             NonElectricalApplicable: false,
//             NonElectricalDetails: null,
//             PAPaidDriverApplicable: false,
//             PAPaidDriverDetails: null,
//             NamedPACoverApplicable: false,
//             NamedPACoverDetails: null,
//             UnnamedPACoverApplicable: false,
//             UnnamedPACoverDetails: null,
//             AAMembershipApplicable: false,
//             AAMembershipDetails: null,
//             FiberFuelTankApplicable: false,
//             FiberFuelTankDetails: null,
//             LLPaidDriverCleanerApplicable: false,
//             LLPaidDriverCleanerDetails: {
//               NoofPerson: "",
//             },
//             LLEmployeesApplicable: false,
//             LLEmployeesDetails: null,
//             LLNonEmployeesApplicable: false,
//             LLNonEmployeesDetails: null,
//             LLWorkManApplicable: false,
//             LLWorkmanDetails: null,
//             AdditionalTowingChargesApplicable: false,
//             AdditionalTowingChargesDetails: null,
//             GeographicalExtensionApplicable: false,
//             GeographicalExtensionDetails: null,
//             TheftAccessoriesApplicable: false,
//             TheftAccessoriesDetails: null,
//             IsSideCarApplicable: false,
//             SideCarDetails: null,
//             TPPDDiscountApplicable: false,
//             TPPDLimitApplicable: false,
//             TPPDLimitDetails: null,
//             ApprovedAntiTheftDevice: false,
//             CertifiedbyARAI: false,
//             IsVehicleforHandicapped: false,
//             IsVehicleforDrivingTuitions: false,
//             IsVehicleLimitedOwnPremises: false,
//             IsVehicleBelongForeignAssembly: false,
//             InbuiltCNGkitApplicable: false,
//             InbuiltLPGkitApplicable: false,
//             ExternalCNGkitApplicable: false,
//             ExternalLPGkitApplicable: false,
//             ExternalCNGLPGkitDetails: null,
//             IMT23Applicable: true,
//             IMT23ApplicableDetails: null,
//             IMT34Applicable: false,
//             IMT34ApplicableDetails: null,
//             UseofLimitedPermission: false,
//             LLNFPPCount: null,
//           };
//         }
//       }
//       state[field] = value;
//     },
//     magmaVehicleDetails: (state, action) => {
//       const { field, value } = action.payload;
//       state.VehicleDetails[field] = value;

//     },
//     magmaGeneralProposalInformation: (state, action) => {
//       const { field, value } = action.payload;
//       state.GeneralProposalInformation[field] = value;
//     },
//     magmaPAOwnerCoverDetails: (state, action) => {
//       const { field, value } = action.payload;
//       state.PAOwnerCoverDetails[field] = value;
//     },
//     magmaAddOnsPlanApplicableDetails: (state, action) => {
//       const { field, value } = action.payload;
//       state.AddOnsPlanApplicableDetails[field] = value;
//     },
//     magmaOptionalCoverageDetails: (state, action) => {
//       const { field, value } = action.payload;
//       state.OptionalCoverageDetails[field] = value;
//     },
//     magmaPrevPolicyDetails: (state, action) => {
//       const { field, value } = action.payload;
//       state.PrevPolicyDetails[field] = value;
//     },
//     resetMagmaQuote: () => initialState,
//   },
//   extraReducers(builder) {
//     builder
//       .addCase(submitMagmaQuote.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       .addCase(submitMagmaQuote.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.message = action.payload.message;
//       })
//       .addCase(submitMagmaQuote.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       });
//   },
// });

// export const {
//   magmaQuotes,
//   magmaVehicleDetails,
//   magmaGeneralProposalInformation,
//   magmaPAOwnerCoverDetails,
//   magmaAddOnsPlanApplicableDetails,
//   magmaOptionalCoverageDetails,
//   magmaPrevPolicyDetails,
//   resetMagmaQuote,
// } = quoteMagmaSlice.actions;
// export default quoteMagmaSlice.reducer;
