import {
  Analytics,
  Audience,
  Contact,
  GalleryItem,
  Garage,
  Identity,
  Machine,
  Setting,
  Sponsor,
  SponsorshipPackage,
  TimelineItem,
} from "../models/index.js";
import { defaultContent } from "../seed/defaultContent.js";

const rowJson = (row) => (row ? row.get({ plain: true }) : null);
const withoutDb = ({ id, clientId, createdAt, updatedAt, sortOrder, ...rest }) => ({ id: clientId || id, ...rest });
const ordered = (rows) => rows.sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));

function parseJson(value, fallback) {
  if (Array.isArray(value) || (value && typeof value === "object")) return value;
  if (typeof value !== "string" || value === "") return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalizeContent(content) {
  return {
    ...content,
    identity: {
      ...content.identity,
      highlights: parseJson(content.identity?.highlights, []),
    },
    timeline: content.timeline.map((item) => ({
      ...item,
      images: parseJson(item.images, []),
    })),
    machine: {
      ...content.machine,
      specs: parseJson(content.machine?.specs, []),
      images: parseJson(content.machine?.images, []),
    },
    garage: {
      ...content.garage,
      services: parseJson(content.garage?.services, []),
      stats: parseJson(content.garage?.stats, {}),
      images: parseJson(content.garage?.images, []),
    },
    audience: {
      ...content.audience,
      stats: parseJson(content.audience?.stats, []),
      instagram: parseJson(content.audience?.instagram, {}),
      tags: parseJson(content.audience?.tags, []),
      platformSplit: parseJson(content.audience?.platformSplit, []),
    },
    packages: content.packages.map((item) => ({
      ...item,
      features: parseJson(item.features, []),
    })),
    analytics: {
      ...content.analytics,
      visits30: parseJson(content.analytics?.visits30, []),
      activity: parseJson(content.analytics?.activity, []),
    },
  };
}

export async function getContent() {
  const [identity, machine, garage, audience, settings, analytics] = await Promise.all([
    Identity.findOne(),
    Machine.findOne(),
    Garage.findOne(),
    Audience.findOne(),
    Setting.findOne(),
    Analytics.findOne(),
  ]);

  const [timeline, gallery, packagesRows, sponsors, contacts] = await Promise.all([
    TimelineItem.findAll({ order: [["sortOrder", "ASC"], ["id", "ASC"]] }),
    GalleryItem.findAll({ order: [["sortOrder", "ASC"], ["id", "ASC"]] }),
    SponsorshipPackage.findAll({ order: [["sortOrder", "ASC"], ["id", "ASC"]] }),
    Sponsor.findAll({ order: [["sortOrder", "ASC"], ["id", "ASC"]] }),
    Contact.findAll({ order: [["createdAt", "DESC"]] }),
  ]);

  return normalizeContent({
    identity: rowJson(identity) || defaultContent.identity,
    timeline: timeline.map((row) => withoutDb(rowJson(row))),
    machine: rowJson(machine) || defaultContent.machine,
    garage: rowJson(garage) || defaultContent.garage,
    gallery: gallery.map((row) => withoutDb(rowJson(row))),
    audience: rowJson(audience) || defaultContent.audience,
    packages: packagesRows.map((row) => withoutDb(rowJson(row))),
    sponsors: sponsors.map((row) => withoutDb(rowJson(row))),
    contacts: contacts.map((row) => withoutDb(rowJson(row))),
    settings: rowJson(settings) || defaultContent.settings,
    analytics: rowJson(analytics) || defaultContent.analytics,
  });
}

async function replaceCollection(Model, rows) {
  await Model.destroy({ where: {} });
  await Model.bulkCreate(
    rows.map((row, index) => {
      const { id, ...rest } = row;
      return { ...rest, clientId: String(id), sortOrder: index };
    })
  );
}

export async function updateSection(section, value) {
  switch (section) {
    case "identity":
      await Identity.destroy({ where: {} });
      await Identity.create(value);
      break;
    case "machine":
      await Machine.destroy({ where: {} });
      await Machine.create(value);
      break;
    case "garage":
      await Garage.destroy({ where: {} });
      await Garage.create(value);
      break;
    case "audience":
      await Audience.destroy({ where: {} });
      await Audience.create(value);
      break;
    case "settings":
      await Setting.destroy({ where: {} });
      await Setting.create(value);
      break;
    case "analytics":
      await Analytics.destroy({ where: {} });
      await Analytics.create(value);
      break;
    case "timeline":
      await replaceCollection(TimelineItem, ordered(value));
      break;
    case "gallery":
      await replaceCollection(GalleryItem, ordered(value));
      break;
    case "packages":
      await replaceCollection(SponsorshipPackage, ordered(value));
      break;
    case "sponsors":
      await replaceCollection(Sponsor, ordered(value));
      break;
    case "contacts":
      await replaceCollection(Contact, value);
      break;
    default:
      throw new Error(`Unknown content section: ${section}`);
  }
  return getContent();
}

export async function createContact(payload) {
  const contact = await Contact.create({
    clientId: `req-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    date: new Date().toISOString().slice(0, 10),
    status: "جديد",
    name: payload.name || "",
    company: payload.company || "",
    email: payload.email || "",
    type: payload.type || "",
    message: payload.message || "",
  });
  return withoutDb(rowJson(contact));
}

export async function updateContact(id, patch) {
  const contact = await Contact.findOne({ where: { clientId: id } });
  if (!contact) return null;
  await contact.update(patch);
  return withoutDb(rowJson(contact));
}

export async function deleteContact(id) {
  return Contact.destroy({ where: { clientId: id } });
}
