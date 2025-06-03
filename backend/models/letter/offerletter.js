import Mongoose from "mongoose";
const OfferLetterSchema = new Mongoose.Schema(
  {
    referenceno: {
      type: String,
      required: true,
    },
    ofdate: {
      type: String,
      required: true,
    },
    incdate: {
      type: String,
      // required: true,
    },
    ofname: {
      type: String,
      required: true,
    },
    ofaddress: {
      type: String,
      required: true,
    },
    ofemail: {
      type: String,
      required: true,
    },
    ofmobile: {
      type: String,
      required: true,
    },
    ofdesignation: {
      type: String,
      required: true,
    },
    ofgrosalary: {
      type: Number,
      default: 0,
    },
    ofsalaryWords: {
      type: String,
    },
    oflocation: {
      type: String,
    },
    ofvalidDate: {
      type: String,
      required: true,
    },
    joinempdate: {
      type: String,
    },
    joinsigndate: {
      type: String,
    },
    joinbasicSalaryPercent: {
      type: Number,
    },
    joinbasicSalary: {
      type: Number,
    },
    joinhrapercentage: {
      type: Number,
    },
    joinhrapercentageamount: {
      type: Number,
    },
    joinmapercent: {
      type: Number,
    },
    joinma: {
      type: Number,
    },
    joinkitallowpercent: {
      type: Number,
    },
    joinkitallowance: {
      type: Number,
    },
    joinbenefitspercent: {
      type: Number,
    },
    joinbenefitsamount: {
      type: Number,
    },
    joinpipercent: {
      type: Number,
    },
    joinpi: {
      type: Number,
    },
    joinpf: {
      type: Number,
    },
    joinpfpercent: {
      type: Number,
    },
    joinesi: {
      type: Number,
    },
    joinesipercent: {
      type: Number,
    },
    joinstock: {
      type: Number,
    },
    joinstockpercent: {
      type: Number,
    },
    joincar: {
      type: Number,
    },
    joiningtotal: {
      type: Number,
    },

    reportingto: {
      type: String,
    },
  },
  { timestamps: true }
);

const OfferLetter = Mongoose.model("OfferLetter", OfferLetterSchema);
export default OfferLetter;

const letterSchema = new Mongoose.Schema({
  letterno: {
    type: String,
  },
  sequence: {
    type: Number,
  },
});
export const LetterCounter = Mongoose.model("LetterCounter", letterSchema);
