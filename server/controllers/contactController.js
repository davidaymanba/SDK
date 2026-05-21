import { Contact } from "../models/index.js";
import { createContact, deleteContact, updateContact } from "../services/contentService.js";

const withoutDb = ({ id, clientId, createdAt, updatedAt, ...rest }) => ({ id: clientId || id, ...rest });

export async function submitContact(request, response, next) {
  try {
    const contact = await createContact(request.body);
    response.status(201).json(contact);
  } catch (error) {
    next(error);
  }
}

export async function listContacts(request, response, next) {
  try {
    const rows = await Contact.findAll({ order: [["createdAt", "DESC"]] });
    response.json(rows.map((row) => withoutDb(row.get({ plain: true }))));
  } catch (error) {
    next(error);
  }
}

export async function patchContact(request, response, next) {
  try {
    const contact = await updateContact(request.params.id, request.body);
    if (!contact) return response.status(404).json({ message: "Contact not found" });
    return response.json(contact);
  } catch (error) {
    return next(error);
  }
}

export async function removeContact(request, response, next) {
  try {
    const count = await deleteContact(request.params.id);
    if (!count) return response.status(404).json({ message: "Contact not found" });
    return response.status(204).end();
  } catch (error) {
    return next(error);
  }
}
