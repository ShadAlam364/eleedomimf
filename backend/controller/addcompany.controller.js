import AddCompanies from "../models/addcompanySchema.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
 
const currentModuleFile = fileURLToPath(import.meta.url);
const __dirname = dirname(currentModuleFile);
// adding to db
export const addCompany = async (req, res) => {

    try {
      const { comp_insurance, comp_categories, comp_establishment, comp_cname, comp_cfiles } = req.body;
      // Create a new company instance
      const addNewCompany = new AddCompanies({
        comp_insurance,
        comp_categories,
        comp_establishment,
        comp_cname,
        comp_cfiles,
      });
  
      // Save the company to the database
      await addNewCompany.save();
      // console.log(serverURL);
      return res.status(201).json({
        status: "Company Added Successfully!",
        message: {
          addNewCompany,
          // Include the list of employees in the response
        },
      });
    } catch (err) {
      console.error('Error during Company Add to db:', err);
      return res.status(500).json({
          status: "Internal Server Error",
          message: err.message,
      });
  }
}


//   VIEW COMPANY LISTS
// ************************* view Companylist ************************* //
export const viewCompanies = async (req, res) => {
  try {
    const CompanyList = await AddCompanies.find({});
    if (!CompanyList || CompanyList.length === 0) {
      return res.status(400).json({
        status: "Error during CompanyList Update",
        message: "Invalid Company selected",
      });
    } else {
      // Assuming your server is running on 
      CompanyList.forEach(company => {
        company.usercarousel_upload = `https://eleedomimf.onrender.com${company.usercarousel_upload}`;
      });

      return res.status(200).json(CompanyList);
    }
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      message: "Internal Server Error",
    });
  }
};


// filter view list on Health Insurance
export const viewHealthInsuranceCompanies = async (req, res) => {
  try {
    const HealthInsuranceList = await AddCompanies.find({ comp_insurance: "Health Insurance" || "Health insurance" || "health insurance"});
    return res.status(200).json(HealthInsuranceList);
  } catch (err) {
    return res.status(500).json({
      status: "Error during Health Insurance CompanyList Update",
      message: err.message,
    });
  }
};



// New API for Motor Insurance
export const viewMotorInsuranceCompanies = async (req, res) => {
  try {
    const MotorInsuranceList = await AddCompanies.find({ comp_insurance: "Motor Insurance" || "Motor insurance" || "motor insurance"});
    return res.status(200).json(MotorInsuranceList);
  } catch (err) {
    return res.status(500).json({
      status: "Error during Motor Insurance CompanyList Update",
      message: err.message,
    });
  }
};


// New API for Non-Motor Insurance
export const viewNonMotorInsuranceCompanies = async (req, res) => {
  try {
    const NonMotorInsuranceList = await AddCompanies.find({ comp_insurance: "Non-motor Insurance" || "Non-Motor Insurance" || "Non-Motor insurance" || "non-Motor Insurance" || "non-motor Insurance" || "non-motor insurance"});
    return res.status(200).json(NonMotorInsuranceList);
  } catch (err) {
    return res.status(500).json({
      status: "Error during Non-Motor Insurance CompanyList Update",
      message: err.message,
    });
  }
};






// Controller function to handle updating specific fields of a company
export const updateCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const updatedCompanyData = req.body;

    // Check if the company exists before attempting to update
    const existingCompany = await AddCompanies.findById(companyId);

    if (!existingCompany) {
      return res.status(404).json({
        status: "Company not found",
        message: "The specified company ID does not exist in the database",
      });
    }

    // Perform the update
    const updatedCompany = await AddCompanies.findByIdAndUpdate(
      companyId,
      updatedCompanyData,
      {
        new: true,
        runValidators: true, // Optional: Run Mongoose validation
      }
    );

    return res.status(200).json({
      status: "Company Updated Successfully!",
      message: {
        updatedCompany,
      },
    });
  } catch (err) {
    console.error('Error during Company Update:', err);
 // Handle Mongoose validation errors
 if (err.name === 'ValidationError') {
  return res.status(400).json({
    status: "Validation Error",
    message: err.message,
  });
}
    return res.status(500).json({
      status: "Internal Server Error",
      message: err.message,
    });
  }
};





//  delete employee controller
export const deleteCompany = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedCompany = await AddCompanies.findByIdAndDelete(userId);
    if (!deletedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }
    return res.json({
      message: "Company deleted successfully",
      deletedCompany,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
