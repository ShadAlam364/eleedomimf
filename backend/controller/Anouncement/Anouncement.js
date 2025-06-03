// routes/announcements.js
import Announcements from "../../models/Announcement/Announcement.js";

// Create announcement
const addAnnoucement = async (req, res) => {
  try {
    const data = req.body;
    if (!data) {
      return res.status(400).json({
        message: "Announcement Not Found",
      });
    }
    const announcement = new Announcements(data);
    await announcement.save();
    res.status(201).json(announcement);
  } catch (error) {
    res.status(400).json(error);
  }
};

// Get all active announcements
const getActiveAnnoucement = async (req, res) => {
  try {
    const announcements = await Announcements.find({ isActive: true });
    res.send(announcements);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Admin get all announcements
const getAnnoucement = async (req, res) => {
  try {
    const announcements = await Announcements.find().sort({ createdAt: -1 });
    res.send(announcements);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update announcement
const updateAnnoucement = async (req, res) => {
  try {
    const announcement = await Announcements.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.send(announcement);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete announcement
const deleteAnnoucement = async (req, res) => {
  try {
    await Announcements.findByIdAndDelete(req.params.id);
    res.send({ message: "Announcement deleted Successfully!" });
  } catch (error) {
    res.status(500).send(error);
  }
};

export {
  addAnnoucement,
  getAnnoucement,
  getActiveAnnoucement,
  updateAnnoucement,
  deleteAnnoucement,
};
