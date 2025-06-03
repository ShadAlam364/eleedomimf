import OfferLetter from "../../models/letter/offerletter.js";
import { LetterCounter } from "../../models/letter/offerletter.js";

export const addUserOfferLetter = async (req, res) => {
  try {
    // Find the counter document for the policy reference numbers or create one if it doesn't exist
    let counter = await LetterCounter.findOneAndUpdate(
      { letterno: 'autoval' },
      { $inc: { sequence: 1 } },
      { new: true, upsert: true }
    );

    let seqId;
    if (!counter) {
      // If counter doesn't exist, create a new one with sequence value 1
      const newCounter = new LetterCounter({ letterno: 'autoval', sequence: 1 });
      await newCounter.save();
      seqId = 1;
    } else {
      // Use the sequence value from the counter document
      seqId = counter.sequence; // Change 'seq' to 'sequence'
    }
    // Generate the five-digit policy number with leading zeros
    const policyNumber = seqId.toString().padStart(4, '0');
    const {
      ofname,
      ofemail,
      ofaddress,
      ofmobile,
      ofdate,
      oflocation,
      ofsalaryWords,
      ofdesignation,
      ofgrosalary,
      ofvalidDate,
    } = req.body;
  
    // Check if the user with the given email already exists
    const emailExist = await OfferLetter.findOne({ ofemail });
    if (emailExist) {
      return res.status(400).json({
        status: "User Already Exists",
        message: "User with this email already exists.",
      });
    }
    // Create a new user
    const newUser = new OfferLetter({
      referenceno: `EIPL/${new Date().getFullYear()}/${policyNumber}`,
      ofname,
      ofsalaryWords,
      ofemail,
      ofaddress,
      ofmobile,
      oflocation,
      ofdate,
      ofdesignation,
      ofgrosalary,
      ofvalidDate,
    });
    // Save the new user to the database
    await newUser.save();
    return res.status(201).json({
      status: `${ofname} Offer Letter Added Successfully....!`,
      message: {
        newUser,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "Error during adding data",
      message: err.message,
    });
  }
};

// view all offer letters
export const OfferLetterList = async (req, res) =>{
    try {
        const offer = await OfferLetter.find({});
        if (!offer) {
            return res.status(400).json({
              status: "Error during offer letter lists Update",
              message: "Invalid offer letter selected",
            });
          }else{
            return res.status(200).json(offer);
          }
    } catch (error) {
        return res.status(400).json({
            status: "Error during View Offer Letter..!",
            message: error.message,
          });
    }
}

export const updateLetters = async (req, res) => {
  try {
    const letterId = req.params.id;
    const updateLetter = req.body;
    // Check if the insurace lists exists before attempting to update
    const existingDetails = await OfferLetter.findById(letterId);
    if (!existingDetails) {
      return res.status(404).json({
        status: "Letter Details not found",
        message: "The specified Letter/User does not exist in the database",
      });
    }

    // Perform the update
    const updatedDetails = await OfferLetter.findByIdAndUpdate(
      letterId,
      updateLetter,
      {
        new: true,
        runValidators: true,
      }
    );
    // console.log(updatedDetails);
    
    return res.status(200).json({
      status: "Letter Updated Successfully....! ",
      message: {
        updatedDetails,
      },
    });
  } catch (err) {
    console.error(err);
    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
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

// delete OFFer LETTER
export const offersDelete = async (req, res) => {
  try {
    const fId = req.params.id;
    
    const deletedOffer = await OfferLetter.findByIdAndDelete(fId);
    if (!deletedOffer) {
      return res.status(404).json({ message: "Offer Letter not found" });
    }
    return res.json({ message: `${deletedOffer} Offer Letter deleted successfully..!`});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" } + error);
  }
};