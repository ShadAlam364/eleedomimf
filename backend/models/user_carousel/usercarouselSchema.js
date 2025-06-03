import Mongoose from "mongoose";
const UserCarouselSchema = new Mongoose.Schema(
  {
    usercarousel_title: {
      type: String,
      
    },
    usercarousel_desc: {
      type: String,
      
    },
    usercarousel_link: {
      type: String,
      
    },
    usercarousel_upload: {
      type: String,
      required:true,
    },
  },
  { timestamps: true }
);

const UserCarousel = Mongoose.model("UserCarousel", UserCarouselSchema);
export default UserCarousel;
