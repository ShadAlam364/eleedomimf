import UserCarousel from "../../models/user_carousel/usercarouselSchema.js";

export const firstUserCarousel = async (req, res) => {
  try {
    const { usercarousel_title, usercarousel_desc, usercarousel_link, usercarousel_upload } =
      req.body;
    // Check if the carousel with the given carousellink already exists
    const linkExist = await UserCarousel.findOne({ usercarousel_link });
    if (linkExist) {
      return res.status(400).json({
        status: "Carousel Already Exists",
        message: "This Carousel already exists.",
      });
    }
    // Create a new carousel
    const newCarousel = new UserCarousel({
      usercarousel_title,
      usercarousel_desc,
      usercarousel_link,
      usercarousel_upload: usercarousel_upload,
    });
    // Save the new carousel to the database
    await newCarousel.save();
    return res.status(201).json({
      status: "Carousel Submitted Successfully!",
      message: {
        newCarousel,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "Error during Carousel ..!",
      message: err.message,
    });
  }
};
// ************************* view carousel lists ************************* //
export const firstUserCarouselList = async (req, res) => {
  const CarouselList = await UserCarousel.find({});
  if (!CarouselList) {
    return res.status(400).json({
      status: "Error during Carousel lists Update",
      message: "Invalid Carousel selected",
    });
  } else {
    return res.status(200).json(CarouselList);
  }
};

// ************************** Update Carousel ****************************** //
export const updateCarousel = async (req, res) => {
  try {
    const carouselId = req.params.id;
    const carouselData = req.body;
    // Check if the carousel exists before attempting to update
    const existingCarousel = await UserCarousel.findById(carouselId);

    if (!existingCarousel) {
      return res.status(404).json({
        status: "Carousel not found",
        message: "The specified Carousel ID does not exist in the database",
      });
    }

    // Perform the update
    const updatedCarousel = await UserCarousel.findByIdAndUpdate(
      carouselId,
      carouselData,
      {
        new: true,
        runValidators: true, // Optional: Run Mongoose validation
      }
    );

    return res.status(200).json({
      status: "Carousel Updated Successfully!",
      message: {
        updatedCarousel,
      },
    });
  } catch (err) {
    console.error("Error during Carousel Update:", err);

    return res.status(500).json({
      status: "Internal Server Error",
      message: err.message,
    });
  }
};



// delete carousel
export const deleteCarousel = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedCarousel = await UserCarousel.findByIdAndDelete(userId);
    if (!deletedCarousel) {
      return res.status(404).json({ message: "Carousel not found" });
    }
    return res.json({
      message: "Carousel deleted successfully",
      deletedCarousel,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
