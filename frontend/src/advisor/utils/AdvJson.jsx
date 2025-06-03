const tableColumns = [
    { key: 'policyrefno', label: 'Reference ID' },
    { key: 'entryDate', label: 'Entry Date' },
    { key: 'branch', label: 'Branch' },
    { key: 'company', label: 'Company' },
    { key: 'category', label: 'Category' },
    { key: 'segment', label: 'Segment' },
    { key: 'sourcing', label: 'Sourcing' },
    { key: 'policyNo', label: 'Policy No' },
    { key: 'insuredName', label: 'Insured Name' },
    { key: 'contactNo', label: 'Contact No' },
    { key: 'states', label: 'State' },
    { key: 'district', label: 'District' },
    { key: 'vehRegNo', label: 'Vehicle Reg No' },
    { key: 'policyStartDate', label: 'Policy Start Date' },
    { key: 'policyEndDate', label: 'Policy End Date' },
    { key: 'odExpiry', label: 'OD Expiry' },
    { key: 'tpExpiry', label: 'TP Expiry' },
    { key: 'idv', label: 'IDV' },
    { key: 'bodyType', label: 'Body Type' },
    { key: 'makeModel', label: 'Make & Model' },
    { key: 'mfgYear', label: 'MFG Year' },
    { key: 'registrationDate', label: 'Registration Date' },
    { key: 'vehicleAge', label: 'Vehicle Age' },
    { key: 'fuel', label: 'Fuel' },
    { key: 'gvw', label: 'GVW' },
    { key: 'cc', label: 'C.C' },
    { key: 'engNo', label: 'Engine No' },
    { key: 'chsNo', label: 'Chassis No' },
    { key: 'policyType', label: 'Policy Type' },
    { key: 'productCode', label: 'Product Code' },
    { key: 'odPremium', label: 'OD Premium' },
    { key: 'liabilityPremium', label: 'Liability Premium' },
    { key: 'netPremium', label: 'Net Premium' },
    { key: 'finalEntryFields', label: 'Final Amount' },
    { key: 'odDiscount', label: 'OD Discount' },
    { key: 'ncb', label: 'NCB' },
    { key: 'advisorName', label: 'Advisor Name' },
    { key: 'subAdvisor', label: 'Sub Advisor' },
    { key: 'payoutOn', label: 'Payout On' },
    { 
      key: 'advisorPayoutAmount', 
      label: 'Advisor Payout',
      format: (value) => `₹${value}`
    },
    { 
      key: 'advisorPayableAmount', 
      label: 'Advisor Payable Amount',
      format: (value) => `₹${value}`
    }
  ];

  export default tableColumns;

  