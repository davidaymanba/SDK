import { Router } from "express";
import { listContacts, patchContact, removeContact, submitContact } from "../controllers/contactController.js";
import { requireAuth } from "../middleware/auth.js";

export const contactRouter = Router();

contactRouter.post("/", submitContact);
contactRouter.get("/", requireAuth, listContacts);
contactRouter.patch("/:id", requireAuth, patchContact);
contactRouter.delete("/:id", requireAuth, removeContact);
