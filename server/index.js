import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { connectDatabase, sequelize } from "./config/database.js";
import { seedDatabase } from "./seed/seedDatabase.js";
import { authRouter } from "./routes/authRoutes.js";
import { contactRouter } from "./routes/contactRoutes.js";
import { contentRouter } from "./routes/contentRoutes.js";
import { uploadRouter } from "./routes/uploadRoutes.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5000);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

app.use(cors({ origin: process.env.CLIENT_ORIGIN || true, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(path.join(projectRoot, "uploads")));
app.use("/assets/images", express.static(path.join(projectRoot, "src", "assets", "images")));

app.get("/api/health", (_request, response) => response.json({ ok: true }));
app.use("/api/auth", authRouter);
app.use("/api/content", contentRouter);
app.use("/api/contact", contactRouter);
app.use("/api/upload", uploadRouter);

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(error.status || 500).json({ message: error.message || "Server error" });
});

async function start() {
  await connectDatabase();
  await sequelize.sync();
  await seedDatabase();
  app.listen(port, "0.0.0.0", () => {
    console.log(`DK Motorsport API: http://127.0.0.1:${port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start API", error);
  process.exit(1);
});
