// models/Announcement.js
import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
  message: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  priority: { type: Number, default: 1 }, // 1=low, 2=medium, 3=high
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Announcements = mongoose.model('Announcements', announcementSchema);

export default Announcements;