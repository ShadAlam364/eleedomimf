import Mongoose from "mongoose";

const DailyLegerSchema = new Mongoose.Schema(
    {
        advId: {
            type: String,
            ref: "AllInsurance",
            // required: true
        },
        branch: {
            type: String,
            ref: "AllInsurance",
            // required :true
        },
        advisorName: {
            type: String,
            ref: "AllInsurance",
            // required: true
        },
        entryDate: {
            type: String,
            ref: "AllInsurance",
            // required: true
        },
        policyNo: {
            type: String,
            ref: "AllInsurance",
            // required: true
        },
        insuredName: {
            type: String,
            ref: "AllInsurance",
            // required: true,
        },
        finalEntryfields: {
            type: Number,
            ref: "AllInsurance",
            // required: true,
        },
        advisorPayoutAmount: {
            type: Number,
            ref: "AllInsurance",
            // required: true,
        },
        debitAmount: {
            type: Number,
            // required: true,
        },
        paymentDate: {
            type: String,
        },
        paymentType: {
            type: String,
        },
        paymentRefNo: {
            type: String,
        },
        creditAmount: {
            type: Number,
        },
        balance: {
            type: Number,
        },
        company: {
            type: String,
        },

    }
);

const DailyLeger = Mongoose.model("DailyLeger", DailyLegerSchema);
export default DailyLeger;
