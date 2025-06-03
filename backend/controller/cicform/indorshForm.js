import indorshmentForm from "../../models/cicform/indorshform.js";

export const createIndorsh = async (req, res) => {
  try {
    const { date, companyName, policyNo, regNo, insuredName, typeOfIndo, subTypeIndo, policyMadeBy, mistakeOf,reason, advisorName, branch, status, policyStatus, chequeNo, finalStatus, remarks } = req.body; 
 
    const newIndorsh = new indorshmentForm({
        date,
        companyName,
        policyNo,
        insuredName,
        regNo,
        typeOfIndo,
        subTypeIndo,
        policyMadeBy,
        mistakeOf,
        reason,
        advisorName,
        branch,
        status,
        policyStatus,
        chequeNo,
        finalStatus,
        remarks,  
      });
      const savedIndorsh = await newIndorsh.save();
       res.status(201).json({message: `${savedIndorsh.insuredName} Indorshment Successfully...!`});
    
  } catch (error) {
    res.status(500).json({ message: "Failed to add Indorshment", error: error.message });
  }
};



// Controller to get all Indorsh data
export const getAllIndorsh = async (req, res) => {
  try {
    const Indorshs = await indorshmentForm.find();
    return res.status(200).json(Indorshs);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve Indorshment", error });
  }
};

// Controller to get Indorsh data by branch
export const getIndorshsByBranch = async (req, res) => {
    const { branch } = req.params;
    try {
      const Indorshs = await indorshmentForm.find({ branch });
      return res.status(200).json(Indorshs);
    } catch (error) {
      res.status(500).json({ message: `Failed to retrieve Indorshment for branch: ${branch}`, error });
    }
  };
  

// Controller to update a Indorsh
export const updateIndorsh = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const updatedIndorsh = await indorshmentForm.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedIndorsh) {
      return res.status(404).json({ message: "Indorshment not found" });
    }
    res.status(200).json(updatedIndorsh);
  } catch (error) {
    res.status(500).json({ message: "Failed to update Indorshment", error });
  }
};


// Controller to delete a Indorsh
export const deleteIndorsh = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedIndorsh = await indorshmentForm.findByIdAndDelete(id);
      if (!deletedIndorsh) {
        return res.status(404).json({ message: "Indorshment not found" });
      }
      res.status(200).json({ message: "Indorshment deleted successfully...!" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete Indorshment", error });
    }
  };
  