import { useState, useEffect } from "react";
import { useWatch } from "react-hook-form";
import formatDate from "./DateHelpers";

// Custom hook to handle conditional fields
const useConditionalFields = (fields, control, businessType, policyProductType) => {
  const [modifiedFields, setModifiedFields] = useState(fields);
  const currentDate = formatDate(new Date(), "dd/MM/yyyy");
  // Watch the "IsVehicleBharatRegistered" field
  const isVehicleBharatRegistered = useWatch({
    control,
    name: "VehicleDetails.IsVehicleBharatRegistered",
    defaultValue: false,
  });

  // Watch the "InconvenienceAllowance" field
  const inconvenienceAllowance = useWatch({
    control,
    name: "AddOnsPlanApplicableDetails.InconvenienceAllowance",
    defaultValue: false,
  });

  // Watch the "KeyReplacement" field
  const keyReplacement = useWatch({
    control,
    name: "AddOnsPlanApplicableDetails.KeyReplacement",
    defaultValue: false,
  });

  // Watch the "LossofIncome" field
  const lossOfIncome = useWatch({
    control,
    name: "AddOnsPlanApplicableDetails.LossofIncome",
    defaultValue: false,
  });

  // Watch the "EMIProtector" field
  const emiProtector = useWatch({
    control,
    name: "AddOnsPlanApplicableDetails.EMIProtector",
    defaultValue: false,
  });

  // Watch the "BatterySecureChk" field
  const batterySecureChk = useWatch({
    control,
    name: "AddOnsPlanApplicableDetails.BatterySecureChk",
    defaultValue: false,
  });

  // Watch the "AdditionalTowingCoverChk" field
  const additionalTowingCoverChk = useWatch({
    control,
    name: "AddOnsPlanApplicableDetails.AdditionalTowingCoverChk",
    defaultValue: false,
  });

  // Watch the "MultipleDamageCoverChk" field
  const multipleDamageCoverChk = useWatch({
    control,
    name: "AddOnsPlanApplicableDetails.MultipleDamageCoverChk",
    defaultValue: false,
  });

  // Watch the "CarSpaCover" field
  const carSpaCover = useWatch({
    control,
    name: "AddOnsPlanApplicableDetails.CarSpaCover",
    defaultValue: false,
  });

  // Watch the "ZeroExcessCover" field
  const zeroExcessCover = useWatch({
    control,
    name: "AddOnsPlanApplicableDetails.ZeroExcessCover",
    defaultValue: false,
  });

  // Watch the "ElectricalApplicable" field
  const electricalApplicable = useWatch({
    control,
    name: "OptionalCoverageDetails.ElectricalApplicable",
    defaultValue: false,
  });

  const nonElectricalApplicable = useWatch({
    control,
    name: "OptionalCoverageDetails.NonElectricalApplicable",
    defaultValue: false,
  });

  const paPaidDriverApplicable = useWatch({
    control,
    name: "OptionalCoverageDetails.PAPaidDriverApplicable",
    defaultValue: false,
  });

  const namedPACoverApplicable = useWatch({
    control,
    name: "OptionalCoverageDetails.NamedPACoverApplicable",
    defaultValue: false,
  });

  const unnamedPACoverApplicable = useWatch({
    control,
    name: "OptionalCoverageDetails.UnnamedPACoverApplicable",
    defaultValue: false,
  });

  const aaMembershipApplicable = useWatch({
    control,
    name: "OptionalCoverageDetails.AAMembershipApplicable",
    defaultValue: false,
  });

  const fiberFuelTankApplicable = useWatch({
    control,
    name: "OptionalCoverageDetails.FiberFuelTankApplicable",
    defaultValue: false,
  });

  const llPaidDriverCleanerApplicable = useWatch({
    control,
    name: "OptionalCoverageDetails.LLPaidDriverCleanerApplicable",
    defaultValue: false,
  });

  const llEmployeesApplicable = useWatch({
    control,
    name: "OptionalCoverageDetails.LLEmployeesApplicable",
    defaultValue: false,
  });

  const llNonEmployeesApplicable = useWatch({
    control,
    name: "OptionalCoverageDetails.LLNonEmployeesApplicable",
    defaultValue: false,
  });

  const llWorkManApplicable = useWatch({
    control,
    name: "OptionalCoverageDetails.LLWorkManApplicable",
    defaultValue: false,
  });

  const additionalTowingChargesApplicable = useWatch({
    control,
    name: "OptionalCoverageDetails.AdditionalTowingChargesApplicable",
    defaultValue: false,
  });

  const geographicalExtensionApplicable = useWatch({
    control,
    name: "OptionalCoverageDetails.GeographicalExtensionApplicable",
    defaultValue: false,
  });

  const theftAccessoriesApplicable = useWatch({
    control,
    name: "OptionalCoverageDetails.TheftAccessoriesApplicable",
    defaultValue: false,
  });

  const isSideCarApplicable = useWatch({
    control,
    name: "OptionalCoverageDetails.IsSideCarApplicable",
    defaultValue: false,
  });

  const tppdLimitApplicable = useWatch({
    control,
    name: "OptionalCoverageDetails.TPPDLimitApplicable",
    defaultValue: false,
  });

  const externalCNGLPGkitApplicable = useWatch({
    control,
    name: "OptionalCoverageDetails.ExternalCNGkitApplicable",
    defaultValue: false,
  });

  const imt23Applicable = useWatch({
    control,
    name: "OptionalCoverageDetails.IMT23Applicable",
    defaultValue: false,
  });

  const imt34Applicable = useWatch({
    control,
    name: "OptionalCoverageDetails.IMT34Applicable",
    defaultValue: false,
  });
  const havingClaiminPrevPolicy = useWatch({
    control,
    name: "PrevPolicyDetails.HavingClaiminPrevPolicy",
    defaultValue: false,
  });
    // Watch the RegistrationDate field
    const registrationDate = useWatch({
      control,
      name: "VehicleDetails.RegistrationDate",
      defaultValue: currentDate,
    });
  
  // Update fields based on the watched values
  useEffect(() => {
    const updatedFields = fields.map((field) => {
      // Apply business type and policy product type conditions first
      if (businessType === "New Business") {
        if (["TMCMakeCode", "MiscTypeOfVehicle", "MiscTypeOfVehicleCode", "VehicleSubClassCode", "TACMakeCode"].includes(field.id)) {
          return { ...field, show: false };
        }
        if (["DetariffLoad", "DetariffDis", "IIBClaimSearchDetails", "SentPreInspectionLinkTo", "PreInspectionMobileNo"].includes(field.id) && 
        policyProductType !== "1TP1OD") {
      return { ...field, show: false };
    }
      } else if (businessType === "Roll Over") {
        if (["ElectricVehSpeed", "TypeOfBus", "BodyIDV"].includes(field.id)) {
          return { ...field, show: false };
        }
        
        if (["HigherIDV", "LowerIDV", "IDVofChassis", "PAOwnerCoverApplicable", "PAOwnerCoverDetails"].includes(field.id) && 
            policyProductType !== "1TP") {
          return { ...field, show: false };
        }
        if (["POSPCode", "POSPName", "DetariffLoad", "DetariffDis"].includes(field.id) && 
        policyProductType !== "1TP1OD") {
      return { ...field, show: false };
    }
      }

      switch (field.id) {
        // VehicleDetails fields
        case "BharatVehicleOwnBy":
          return {
            ...field,
            show: isVehicleBharatRegistered, // Show if "IsVehicleBharatRegistered" is true
          };
          case "TempRegistrationDate":
            return {
              ...field,
              show: !registrationDate || !currentDate
            };

        // AddOnsPlanApplicableDetails fields
        case "InconvenienceAllowanceDetails":
          return {
            ...field,
            show: inconvenienceAllowance, // Show if "InconvenienceAllowance" is true
          };
        case "KeyReplacementDetails":
          return {
            ...field,
            show: keyReplacement, // Show if "KeyReplacement" is true
          };
        case "LossofIncomeDetails":
          return {
            ...field,
            show: lossOfIncome, // Show if "LossofIncome" is true
          };
        case "EMIProtectorDetails":
          return {
            ...field,
            show: emiProtector, // Show if "EMIProtector" is true
          };
        case "AddOnBatterySecurePrem":
          return {
            ...field,
            show: batterySecureChk, // Show if "BatterySecureChk" is true
          };
        case "AddOnAdditionalTowingCoverPrem":
        case "AdditionalTowingCoverSI":
          return {
            ...field,
            show: additionalTowingCoverChk, // Show if "AdditionalTowingCoverChk" is true
          };
        case "AddOnMultipleDamageCoverPrem":
          return {
            ...field,
            show: multipleDamageCoverChk, // Show if "MultipleDamageCoverChk" is true
          };
        case "CarSpaDetails":
          return {
            ...field,
            show: carSpaCover, // Show if "CarSpaCover" is true
          };
        case "ZeroExcessDetails":
          return {
            ...field,
            show: zeroExcessCover, // Show if "ZeroExcessCover" is true
          };
        case "ElectricalDetails":
          return {
            ...field,
            show: electricalApplicable, // Show if "ElectricalDetails" is true
          };
        // Non-Electrical fields
        case "NonElectricalDetails":
          return {
            ...field,
            show: nonElectricalApplicable, // Show if "NonElectricalApplicable" is true
          };

        // PA Paid Driver fields
        case "PAPaidDriverDetails":
          return {
            ...field,
            show: paPaidDriverApplicable, // Show if "PAPaidDriverApplicable" is true
          };

        // Named PA Cover fields
        case "NamedPACoverDetails":
          return {
            ...field,
            show: namedPACoverApplicable, // Show if "NamedPACoverApplicable" is true
          };

        // Unnamed PA Cover fields
        case "UnnamedPACoverDetails":
          return {
            ...field,
            show: unnamedPACoverApplicable, // Show if "UnnamedPACoverApplicable" is true
          };

        // AA Membership fields
        case "AAMembershipDetails":
          return {
            ...field,
            show: aaMembershipApplicable, // Show if "AAMembershipApplicable" is true
          };

        // Fiber Fuel Tank fields
        case "FiberFuelTankDetails":
          return {
            ...field,
            show: fiberFuelTankApplicable, // Show if "FiberFuelTankApplicable" is true
          };

        // LL Paid Driver/Cleaner fields
        case "LLPaidDriverCleanerDetails.NoofPerson":
          return {
            ...field,
            show: llPaidDriverCleanerApplicable, // Show if "LLPaidDriverCleanerApplicable" is true
          };

        // LL Employees fields
        case "LLEmployeesDetails":
          return {
            ...field,
            show: llEmployeesApplicable, // Show if "LLEmployeesApplicable" is true
          };

        // LL Non-Employees fields
        case "LLNonEmployeesDetails":
          return {
            ...field,
            show: llNonEmployeesApplicable, // Show if "LLNonEmployeesApplicable" is true
          };

        // LL Workman fields
        case "LLWorkmanDetails":
          return {
            ...field,
            show: llWorkManApplicable, // Show if "LLWorkManApplicable" is true
          };

        // Additional Towing Charges fields
        case "AdditionalTowingChargesDetails":
          return {
            ...field,
            show: additionalTowingChargesApplicable, // Show if "AdditionalTowingChargesApplicable" is true
          };

        // Geographical Extension fields
        case "GeographicalExtensionDetails":
          return {
            ...field,
            show: geographicalExtensionApplicable, // Show if "GeographicalExtensionApplicable" is true
          };

        // Theft Accessories fields
        case "TheftAccessoriesDetails":
          return {
            ...field,
            show: theftAccessoriesApplicable, // Show if "TheftAccessoriesApplicable" is true
          };

        // Side Car fields
        case "SideCarDetails":
          return {
            ...field,
            show: isSideCarApplicable, // Show if "IsSideCarApplicable" is true
          };

        // TPPD Limit fields
        case "TPPDLimitDetails":
          return {
            ...field,
            show: tppdLimitApplicable, // Show if "TPPDLimitApplicable" is true
          };

        // External CNG/LPG Kit fields
        case "ExternalCNGLPGkitDetails":
          return {
            ...field,
            show: externalCNGLPGkitApplicable, // Show if "ExternalCNGkitApplicable" or "ExternalLPGkitApplicable" is true
          };

        // IMT 23 fields
        case "IMT23ApplicableDetails":
          return {
            ...field,
            show: imt23Applicable, // Show if "IMT23Applicable" is true
          };

        // IMT 34 fields
        case "IMT34ApplicableDetails":
          return {
            ...field,
            show: imt34Applicable, // Show if "IMT34Applicable" is true
          };

        // NoOfClaims
        case "NoOfClaims":
          return {
            ...field,
            show: havingClaiminPrevPolicy, // Show if "NoOfClaims" is true
          };


        default:
          return field; // No change for other fields
      }
    });
    setModifiedFields(updatedFields);
  }, [
    isVehicleBharatRegistered,
    registrationDate,
    currentDate,
    businessType,
    policyProductType,
    inconvenienceAllowance,
    keyReplacement,
    lossOfIncome,
    emiProtector,
    batterySecureChk,
    additionalTowingCoverChk,
    multipleDamageCoverChk,
    carSpaCover,
    zeroExcessCover,
    electricalApplicable,
    nonElectricalApplicable,
    paPaidDriverApplicable,
    namedPACoverApplicable,
    unnamedPACoverApplicable,
    aaMembershipApplicable,
    fiberFuelTankApplicable,
    llPaidDriverCleanerApplicable,
    llEmployeesApplicable,
    llNonEmployeesApplicable,
    llWorkManApplicable,
    additionalTowingChargesApplicable,
    geographicalExtensionApplicable,
    theftAccessoriesApplicable,
    isSideCarApplicable,
    tppdLimitApplicable,
    externalCNGLPGkitApplicable,
    imt23Applicable,
    imt34Applicable,
    havingClaiminPrevPolicy,
    fields,
  ]);

  return modifiedFields;
};

export default useConditionalFields;
