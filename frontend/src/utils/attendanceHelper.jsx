import axios from "axios";
import VITE_DATA from "../config/config";
// Utility function to check if today is a holiday or Sunday
export const isRestrictedDay = async () => {
  try {
    // Get the current date in 'DD/MM/YYYY' format
    const currentDate = new Date().toLocaleDateString("en-GB");

    // Check if today is Sunday
    const currentDay = new Date().getDay();
    if (currentDay === 0) {
      return { restricted: true, message: "Attendance is not allowed on Sundays." };
    }

    // Fetch holiday list 2rom the API
    const holidaysResponse = await axios.get(`${VITE_DATA}/holidays/alllists`);
    const holidays = holidaysResponse.data;

    // Check if today is a holiday
    const isHoliday = holidays.some(holiday => holiday.hdate === currentDate);
    if (isHoliday) {
      return { restricted: true, message: "Today is a holiday." };
    }

    return { restricted: false };
  } catch (error) {
    console.error("Error checking restricted days:", error);
    return { restricted: true, message: "Could not verify holidays. Attendance is restricted for now." };
  }
};
