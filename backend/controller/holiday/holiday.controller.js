import Holidays from "../../models/holiday/holiday.js";


export const hDaysAdd = async (req, res) => {
    try {
      const { hdate, hdays } = req.body;
      // Create a new branch
      const types = await Holidays.findOne({ hdate });
      if (types) {
        return res.status(400).json({
          status: "Holiday Date or Name Already Exists",
          message: "Holiday Date or Name already exists....",
        });
      }
  
      const newDay = new Holidays({
        hdate,
        hdays,
      });
      // Save the new branch to the database
      await newDay.save();
      return res.status(201).json({
        status: "Holiday Date & Name Added Successfully...!",
        message: {
            newDay,
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
  export const hDaysList = async (req, res) =>{
      try {
          const dayss = await Holidays.find({});
  
          if (!dayss) {
              return res.status(400).json({
                status: "Error during Holiday Date or Name lists Update",
                message: "Invalid Holiday Date or Name selected..!",
              });
            }else{
              return res.status(200).json(dayss);
            }
          
      } catch (error) {
          return res.status(400).json({
              status: "Error during View Holiday Lists....!",
              message: error.message,
            });
      }
  }
  
  
  // delete staff type
  export const hDaysDelete = async (req, res) => {
      try {
        const hdId = req.params.id;
        
        const deleteHdays = await Holidays.findByIdAndDelete(hdId);
        if (!deleteHdays) {
          return res.status(404).json({ message: "Holiday Date & Name not found" });
        }
        return res.json({ message: "Holiday Date & Name deleted successfully", deleteHdays });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    };