import Mongoose from "mongoose";

const VehicleSlabSchema = new Mongoose.Schema(
  {
    advisorId: {
      type: String,
      ref: "Advisor",
      // required: true
    },
    company:{
      type :String,
      // required :true
    },
      branch: {
        type: String,
        // required: true
      },
    advisorName: {
      type: String,
      // required: true
    },
    sitcapacity: {
      type: String,
    },
    advisorUniqueId: {
      type: String,
      // required: true
    },
    
    vehicleSlab: {
      type: String,
      // required: true,
    },
    cnames: {
      type: String,
      // required: true,
    },
    states: {
      type: String,
      // required: true,
    },
    districts: {
      type: String,
      // required: true,
    },
    catnames: {
      type: String,
    },
    segments: {
      type: String,
      // required: true,
    },
    policytypes: {
      type: String,
      // required: true,
    },
    pcodes: {
      type: String,
      // required: true,
    },
    vage: {
      type: String,
      // required: true,
    },
    payoutons: {
      type: String,
      // required: true,
    },
    cvpercentage: {
      type: Number,
      // required: true,
    },
    branchpayoutper: {
      type: Number,
      // required: true,
    },
    vfuels: {
      type: String,
      // required: true,
    },
    vncb: {
      type: String,
      // required: true,
    },
    voddiscount: {
      type: Number,
      // required: true,
    },
    vcc: {
      type: String,
      // required: true,
    }, 
    companypayoutper: {
      type: Number,
      // required: true,
    },

  },
  { timestamps: true }
);

const VehicleSlab = Mongoose.model("VehicleSlab", VehicleSlabSchema);
export default VehicleSlab;
