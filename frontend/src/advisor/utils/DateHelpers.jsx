const formatDate = (dateString, format = "dd/MM/yyyy") => {
  if (!dateString) return ""; // Handle empty date

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date"; // Check if date is valid

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  if (format === "yyyy-MM-dd") {
    return `${year}-${month}-${day}`; // For input field
  }

  return `${day}/${month}/${year}`; // For Redux
};

export default formatDate;

export const getCurrentTime = () => {
  const now = new Date();
  return now.toTimeString().split(' ')[0]; // Returns "HH:MM:SS"
};
