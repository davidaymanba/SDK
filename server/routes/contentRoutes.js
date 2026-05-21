import { Router } from "express";
import { readContent, writeSection } from "../controllers/contentController.js";
import { requireAuth } from "../middleware/auth.js";

export const contentRouter = Router();

contentRouter.get("/", readContent);
contentRouter.put("/:section", requireAuth, writeSection);
