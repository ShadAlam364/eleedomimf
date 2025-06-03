import Mongoose from "mongoose";

const DailyVisitsSchema = new Mongoose.Schema({
  ids:{
    type: String,
    ref: "AddEmployee",
    required: true
  },
  srNo: {
    type: Number,
    unique: true,
  },
  currdate: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  branch: {
    type: String,
  },
  address: {
    type: String,
  },
  mobile: {
    type: Number,
    required: true,
    unique: true,
  },
  location: {
    type: String,
  },
});

// Pre-save hook to auto increment sNo
DailyVisitsSchema.pre("save", async function (next) {
  if (this.isNew) {
    const latestVisit = await Mongoose.model("DailyVisit")
      .findOne()
      .sort({ srNo: -1 });
    this.srNo = latestVisit ? latestVisit.srNo + 1 : 1;
  }
  next();
});

const DailyVisits = Mongoose.model("DailyVisit", DailyVisitsSchema);
export default DailyVisits;
