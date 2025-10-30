import express, { Application } from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { responsysQueue } from "@workers/queue";
import helmet from "helmet";
import morgan from "morgan";
import router from "@routes/index"
import { connectDB } from "@config/database";
import { Product } from "@models/Product";

dotenv.config();

const app: Application = express();
// Middleware
app.use(helmet());             // helmet header
// === Setup log file ===
const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
const logFile = path.join(logDir, "access.log");
const logStream = fs.createWriteStream(logFile, { flags: "a" });
app.use(morgan("combined", { stream: logStream }));
app.use(morgan("dev"));        // log request to console
app.use(express.json());

app.use("/", router);

(async () => {
  try {
    const db = await connectDB();
    // const repo = db.getMongoRepository(Product);
    // await repo.save({ name: 'Test', price: 100 });
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));

  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
})();
