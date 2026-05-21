import bcrypt from "bcryptjs";
import { AdminUser, Analytics, Audience, Contact, GalleryItem, Garage, Identity, Machine, Setting, Sponsor, SponsorshipPackage, TimelineItem } from "../models/index.js";
import { defaultContent } from "./defaultContent.js";

async function seedSingleton(Model, value) {
  const count = await Model.count();
  if (count === 0) await Model.create(value);
}

async function seedCollection(Model, rows) {
  const count = await Model.count();
  if (count > 0) return;
  await Model.bulkCreate(rows.map(({ id, ...row }, index) => ({ ...row, clientId: id, sortOrder: index })));
}

export async function seedDatabase() {
  await seedSingleton(Identity, defaultContent.identity);
  await seedSingleton(Machine, defaultContent.machine);
  await seedSingleton(Garage, defaultContent.garage);
  await seedSingleton(Audience, defaultContent.audience);
  await seedSingleton(Setting, defaultContent.settings);
  await seedSingleton(Analytics, defaultContent.analytics);
  await seedCollection(TimelineItem, defaultContent.timeline);
  await seedCollection(GalleryItem, defaultContent.gallery);
  await seedCollection(SponsorshipPackage, defaultContent.packages);
  await seedCollection(Sponsor, defaultContent.sponsors);
  await seedCollection(Contact, defaultContent.contacts);

  const email = process.env.ADMIN_EMAIL || "admin@dkmotorsport.iq";
  const password = process.env.ADMIN_PASSWORD || "dk2026";
  const existing = await AdminUser.findOne({ where: { email } });
  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 12);
    await AdminUser.create({ email, passwordHash, role: "admin" });
  }
}
