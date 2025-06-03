import { format, parse } from "date-fns";
const JsonData = {
  // Generate month options
 monthOptions: [
  ...Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, "0"), // "01", "02", ..., "12"
    label: format(parse(String(i + 1).padStart(2, "0"), "MM", new Date()), "MMMM"), // "January", "February", ..., "December"
  })),
],

 yearOptions: [
  ...Array.from({ length: 25 }, (_, i) => ({
    value: String(new Date().getFullYear() - i), // "2023", "2022", ..., "1900"
    label: String(new Date().getFullYear() - i), // "2023", "2022", ..., "1900"
  })),
],
 segmentOptions: [
  { value: "C V", label: "C V" },
  { value: "PVT-CAR", label: "PVT-CAR" },
  { value: "TW", label: "TW" },
  { value: "HEALTH", label: "HEALTH" },
  { value: "NON-MOTOR", label: "NON-MOTOR" },
  { value: "LIFE", label: "LIFE" }
],
sourcings: [
  { value: "NEW", label: "NEW" },
  { value: "RENEWAL", label: "RENEWAL" },
  { value: "ROLL OVER", label: "ROLL OVER" },
  { value: "USED", label: "USED" },
  { value: "ENTRY CASE", label: "ENTRY CASE" }
],
  LoginType: [
    { id: 1, type: "admin", nameType: "Admin" },
    { id: 2, type: "advisor", nameType: "Advisor" },
    { id: 3, type: "branches", nameType: "Branch" },
    { id: 4, type: "cic", nameType: "CEC" },
    { id: 5, type: "employee", nameType: "Employee" },
    { id: 6, type: "finance", nameType: "Finance Admin" },
    { id: 7, type: "hrmanager", nameType: "HR Manager" },
    { id: 8, type: "ops", nameType: "OPS Admin" },
  ],
  InspectionBy: [
    { id: 1, type: "AAA", nameType: "AAA" },
    { id: 2, type: "Adroit", nameType: "Adroit" },
    { id: 3, type: "Auto India", nameType: "Auto India" },
    { id: 4, type: "Mahindra FC", nameType: "Mahindra FC" },
    { id: 5, type: "Self Inspection", nameType: "Self Inspection" },
    { id: 6, type: "Others", nameType: "Others" },
    { id: 7, type: "NA", nameType: "Not Applicable" },
  ]
};

export default JsonData;
