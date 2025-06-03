import PolicyStaffType from "../../models/policytype/addTypePolicy.js";
// add staff
export const PolicystaffTypes = async (req, res) => {
  try {
    const { p_type } = req.body;
    // Create a new branch
    const newStaff = new PolicyStaffType({
      p_type,
    });
    // Save the new branch to the database
    await newStaff.save();
    return res.status(201).json({
      status: "Policy Type Added Successfully!",
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
export const PolicystaffList = async (req, res) =>{
    try {
        const staff = await PolicyStaffType.find({});
        if (!staff) {
            return res.status(400).json({
              status: "Error during Policy type lists Update",
              message: "Invalid staff type selected",
            });
          }else{
            return res.status(200).json(staff);
          }
        
    } catch (error) {
        return res.status(400).json({
            status: "Error during View..!",
            message: error.message,
          });
    }
}


// delete staff type
export const PolicydeleteStaff = async (req, res) => {
    try {
      const policyId = req.params.id;
      const deletedStaff = await PolicyStaffType.findByIdAndDelete(policyId);
      if (!deletedStaff) {
        return res.status(404).json({ message: "Policy Type not found" });
      }
      return res.json({ message: "Policy Type deleted successfully", deletedStaff });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  // add product inside policy_lists
  // API endpoint to add a product to a policy type
export const ProductPolicyAdd= async (req, res) => {
  try {
    const { id } = req.params;
    const { product } = req.body;
    // Find the policy type by ID
    const policyType = await PolicyStaffType.findById(id);
    if (!policyType) {
      return res.status(404).json({ message: 'Policy type not found' });
    }
    // Add the product to the products array
    policyType.products.push(product);
    await policyType.save();
    res.status(200).json({ message: 'Product added successfully' });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// delete product bu pulling from array
export const ProductPolicyDelete = async (req, res) => {
  try {
    const { id } = req.params; // Extract policy type ID from URL parameters
    const {productName } = req.body; // Extract product ID from request body 
    if (!productName) {
      return res.status(400).json({ message: 'Product Name is required' });
    }
    // Find the policy type by ID
    const policyType = await PolicyStaffType.findById(id);
    
    if (!policyType) {
      return res.status(404).json({ message: 'Policy type not found' });
    }

    // Check if the product exists in the products array
    if (!policyType.products.includes(productName)) {
      return res.status(404).json({ message: 'Product not found in the policy type' });
    }
    // Remove the product from the products array
    policyType.products.pull(productName);
    // Save the updated policy type
    await policyType.save();

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

