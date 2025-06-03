import CancelForm from "../../models/cicform/cancelform.js";
export const createCancel = async (req, res) => {
    try {
      const { date,policyNo, policyIssueDate, company, insuredName, regNo, reason, advisorName, branch, policyAmount, status, refundAmount, refundDate, utrNeftNo, bankName, paidThrough } = req.body;
      
      const newCancel = new CancelForm({
        date,
        policyNo,
        policyIssueDate,
        company,
        insuredName,
        regNo,
        reason,
        advisorName,
        branch,
        policyAmount,
        status,
        refundAmount,
        refundDate,
        utrNeftNo,
        bankName,
        paidThrough
      });
  
      const savedCancel = await newCancel.save();
      return res.status(201).json({message: `${savedCancel.insuredName} Cancelation Details Successfully...!`});
    } catch (error) {
      res.status(500).json({ message: "Failed to add Details of cancelation", error });
    }
  };
  
  // Controller to get all Cancel data
  export const getAllCancel= async (req, res) => {
    try {
      const cancel = await CancelForm.find();
      return res.status(200).json(cancel);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve Details of cancelation", error });
    }
  };
  
  // Controller to get Cancel data by branch
  export const getCancelByBranch = async (req, res) => {
      const { branch } = req.params;
      try {
        const cancel = await CancelForm.find({ branch });
        return res.status(200).json(cancel);
      } catch (error) {
        res.status(500).json({ message: `Failed to retrieve Cancelation data for branch: ${branch}`, error });
      }
    };
    
  
  // Controller to update a Cancel
  export const updateCancel = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
      const updatedCancel = await CancelForm.findByIdAndUpdate(id, updateData, { new: true });
  
      if (!updatedCancel) {
        return res.status(404).json({ message: "Cancelation Details not found" });
      }
      res.status(200).json(updatedCancel);
    } catch (error) {
      res.status(500).json({ message: "Failed to update Details Cancelation", error });
    }
  };
  
  
  // Controller to delete a Cancelation
  export const deleteCancel = async (req, res) => {
      const { id } = req.params; 
      try {
        const deletedCancel = await CancelForm.findByIdAndDelete(id);
    
        if (!deletedCancel) {
          return res.status(404).json({ message: "Cancelation Details not found" });
        }
        res.status(200).json({ message: "Cancelation  deleted successfully...!" });
      } catch (error) {
        res.status(500).json({ message: "Failed to delete Cancelation", error });
      }
    };
    