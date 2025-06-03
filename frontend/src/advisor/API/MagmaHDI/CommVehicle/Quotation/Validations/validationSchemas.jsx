import { z } from "zod";

// Schema for Business Type and Policy Product Type
export const quoteSchema = z.object({
  BusinessType: z.string().nonempty("Business Type is required"),
  PolicyProductType: z.string().nonempty("Policy Product Type is required"),
  ProposalDate: z.string().nonempty("Date is required"),
  selectedDate: z.string().nonempty("Date is required"),
});

// Schema for Vehicle Details
export const vehicleDetailsSchema = z.object({
  RegistrationDate: z.string().nonempty("Registration Date is required"),
  RegistrationNumber: z.string().nonempty("Registration Number is required"),
  MonthOfManufacture: z.string().nonempty("Month of Manufacture is required"),
  YearOfManufacture: z.string().nonempty("Year of Manufacture is required"),
  ChassisNumber: z.string().nonempty("Chassis Number is required"),
  EngineNumber: z.string().nonempty("Engine Number is required"),
  RTOCode: z.string().nonempty("RTO Code is required"),
  RTOName: z.string().nonempty("RTO Name is required"),
  FuelType: z.string().nonempty("Fuel Type is required"),
  SeatingCapacity: z.string().nonempty("Seating Capacity is required"),
  CarryingCapacity: z.string().nonempty("Carrying Capacity is required"),
});

// Schema for General Proposal Information
export const generalProposalInformationSchema = z.object({
  CustomerType: z.string().nonempty("Customer Type is required"),
  BusineeChannelType: z.string().nonempty("Business Channel Type is required"),
  PolicyEffectiveFromDate: z.string().nonempty("Policy Effective From Date is required"),
  PolicyEffectiveToDate: z.string().nonempty("Policy Effective To Date is required"),
});

// Schema for PA Owner Cover Details
export const paOwnerCoverDetailsSchema = z.object({
  PAOwnerSI: z.string().nonempty("PA Owner SI is required"),
  PAOwnerTenure: z.string().nonempty("PA Owner Tenure is required"),
  ValidDrvLicense: z.boolean(),
});

// Combine all schemas into one
export const combinedSchema = z.object({
  ...quoteSchema.shape,
  VehicleDetails: vehicleDetailsSchema,
  GeneralProposalInformation: generalProposalInformationSchema,
  PAOwnerCoverDetails: paOwnerCoverDetailsSchema,
});