import multer from "multer";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
const currentModuleFile = fileURLToPath(import.meta.url);
// console.log(currentModuleFile);
const __dirname = dirname(currentModuleFile);
// console.log(__dirname);


const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    // Construct the upload path
    const uploadPath = path.join(__dirname, "../uploads");
    // console.log(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

// Define a function to filter files to only accept image files
const imageFilter = (req, file, cb) => {
  const allowedExtensions = /\.(jpg|jpeg|png|gif|heic|pdf|webp|docx|avif)$/;
  if (!allowedExtensions.test(path.extname(file.originalname).toLowerCase())) {
    return cb(new Error("Only image, pdf, or docx files are allowed."), false);
  }
  cb(null, true);
};


const uploadFile = multer({
  storage: storageConfig,
  fileFilter: imageFilter,
})
.fields([
  { name: "empaadhar", maxCount: 1 },
  { name: "empaadharfile", maxCount: 1},{
    unique: true,
    partialFilterExpression: { empaadharfile: { $exists: true } }
  },

  { name: "addpolicyimage", maxCount: 1 },
  { name: "addpolicylogo", maxCount: 1 },
  { name: "feedbackuser_upload", maxCount: 1 },
  { name: "comp_cfiles", maxCount: 1 },
  { name: "usercarousel_upload", maxCount: 1 },
  {name: "hraadharfile", maxCount:1},
  {name: "pdf", maxCount:1}
]);


export default uploadFile;

