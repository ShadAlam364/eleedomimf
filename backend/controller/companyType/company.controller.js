import CType from "../../models/compnyType/companyType.js";
// add staff
export const CompanyTypes = async (req, res) => {
  try {
    const { c_type } = req.body;
    // Create a new branch
    const types = await CType.findOne({ c_type });
    if (types) {
      return res.status(400).json({
        status: "Comapny Already Exists",
        message: "Company Type already exists....",
      });
    }

    const newStaff = new CType({
      c_type,
    });
    // Save the new branch to the database
    await newStaff.save();
    return res.status(201).json({
      status: "Company Type Added Successfully!",
      message: {
        newStaff,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "Error during Submit..!",
      message: err.message,
    });
  }
};

// lists of staff type

export const CompanyTypeList = async (req, res) => {
  try {
      const staff = await CType.aggregate([
          {
              $project: {
                  _id: 1,
                  c_type: 1,
                  category: 1,
                  // createdAt: 1,
                  // updatedAt: 1
              }
          },
          { $sort: { c_type: 1 } }
      ]);

      if (!staff || staff.length === 0) {
          return res.status(404).json({
              status: "Not Found",
              message: "No company types found",
          });
      }
      
      return res.status(200).json(staff);
  } catch (error) {
      return res.status(500).json({
          status: "Server Error",
          message: error.message,
      });
  }
}

// delete staff type
export const CompanyDelete = async (req, res) => {
    try {
      const cId = req.params.id;
      
      const deletedStaff = await CType.findByIdAndDelete(cId);
      if (!deletedStaff) {
        return res.status(404).json({ message: "Company Type not found" });
      }
      return res.json({ message: "Company Type deleted successfully", deletedStaff });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };



  // add product inside policy_lists
  // API endpoint to add a product to a policy type
export const CategoryAdd= async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;
    // Find the policy type by ID
    const cType = await CType.findById(id);
    if (!cType) {
      return res.status(404).json({ message: 'Company type not found' });
    }
    // Add the product to the products array
    cType.category.push(category);
    await cType.save();
    res.status(200).json({ message: 'Category added successfully' });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// delete product bu pulling from array
export const categoryTypeDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryId } = req.body; // Assuming productId is the ID of the product to be deleted

    // Find the policy type by ID
    const cType = await CType.findById(id);
    if (!cType) {
      return res.status(404).json({ message: 'Category type not found' });
    }

    // Remove the product from the products array
    cType.category.pull(categoryId);
    await cType.save();
    return res.status(200).json({ message: 'Category deleted successfully' } );
  } catch (error) {
    console.error('Error deleting Category', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



// export const AddSegment = async (req, res) => {
//     const { companyId } = req.params;
//     const { segment } = req.body;
    
//     try {
//       const company = await CType.findById(companyId);
//       if (!company) {
//         return res.status(404).json({ message: 'Company not found' });
//       }
  
//       // Transform the data to add the segment to the corresponding category
//       const transformedData = {};
//       company.category.forEach((category, index) => {
//         if (!transformedData[category]) {
//           transformedData[category] = [];
//         }
//         if (company.segment[index]) {
//           transformedData[category].push(company.segment[index]);
//         }
//       });
  
//       // Add the new segment to the corresponding category
//       if (!transformedData[segment.category]) {
//         transformedData[segment.category] = [];
//       }
//       transformedData[segment.category].push(segment.value);
  
//       // Update the company document with the new segment data
//       company.segment = [];
//       company.category = Object.keys(transformedData);
//       company.category.forEach(category => {
//         company.segment = company.segment.concat(transformedData[category]);
//       });
  
//       await company.save();
//       res.json({ success: true });
//     } catch (error) {
//       console.error('Error saving segment:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   };
 // Importing your Mongoose model

export const AddSegment = async (req, res) => {
  try {
    const { id } = req.params; // Extracting company ID from request parameters
    const { category, segment } = req.body; // Extracting category and segment from request body

    const cType = await CType.findById(id);
    if (!cType) {
      return res.status(404).json({ message: 'Company type not found' });
    }
    // Add the product to the products array
    // cType.category.push(category);
    // await cType.save();
    // Finding the company and updating it to add the segment to the specified category
    // const updatedCompany = await CType.findOne(
    cType.segment.push(segment);
    await cType.save();

    // Sending the updated company as the response
    res.json(cType);
  } catch (error) {
    // Handling errors
    console.error("Error adding segment:", error);
    res.status(500).json({ error: "Internal Server Error" }+ error);
  }
};
