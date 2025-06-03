import express from "express";
import connectDB from "./connection/connection.js";
import cors from "cors";
import path from "path";
import compression from "compression";
import Routes from "./routes/routes.js";
import policyRoutes from "./routes/policy/policy-dashboard.routes.js";
import newdashboardRoutes from "./routes/newdashboard/new-dashboard.routes.js";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = process.env.PORT || 7000;
const { CORS, CORS1, CORSLOCAL } = process.env;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
  origin: [CORS, CORS1, CORSLOCAL, "*"], // Specify trusted domains
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Specify allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
};

app.use(cors(corsOptions));
app.use(compression());
app.use(cors());
app.use(express.urlencoded({extended:false}));
app.use(express.json({limit:'50mb'}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/policy", policyRoutes);
app.use("/new", newdashboardRoutes);

app.use("/", Routes);
// middleware call
connectDB();
app.listen(port, (err) => {
  if (err) {
    console.log(`Server is not running on ${port}`);
  } else {
    console.log(`Server is running on ${port}`);
  }
});
