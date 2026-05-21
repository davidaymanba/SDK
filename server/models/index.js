import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Identity = sequelize.define("Identity", {
  fullName: DataTypes.STRING,
  nickname: DataTypes.STRING,
  role: DataTypes.STRING,
  shortAr: DataTypes.TEXT,
  shortEn: DataTypes.TEXT,
  startYear: DataTypes.INTEGER,
  profileImage: DataTypes.TEXT,
  actionImage: DataTypes.TEXT,
  highlights: DataTypes.JSON,
  storyAr: DataTypes.TEXT,
  storyEn: DataTypes.TEXT,
  storySubtitle: DataTypes.STRING,
});

export const TimelineItem = sequelize.define("TimelineItem", {
  clientId: { type: DataTypes.STRING, unique: true },
  year: DataTypes.INTEGER,
  titleAr: DataTypes.STRING,
  titleEn: DataTypes.STRING,
  location: DataTypes.STRING,
  type: DataTypes.STRING,
  description: DataTypes.TEXT,
  image: DataTypes.TEXT,
  images: DataTypes.JSON,
  visible: { type: DataTypes.BOOLEAN, defaultValue: true },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
});

export const Machine = sequelize.define("Machine", {
  carName: DataTypes.STRING,
  headlineAr: DataTypes.STRING,
  headlineEn: DataTypes.STRING,
  descriptionAr: DataTypes.TEXT,
  descriptionEn: DataTypes.TEXT,
  specs: DataTypes.JSON,
  images: DataTypes.JSON,
});

export const Garage = sequelize.define("Garage", {
  name: DataTypes.STRING,
  descriptionAr: DataTypes.TEXT,
  descriptionEn: DataTypes.TEXT,
  logo: DataTypes.TEXT,
  services: DataTypes.JSON,
  stats: DataTypes.JSON,
  images: DataTypes.JSON,
});

export const GalleryItem = sequelize.define("GalleryItem", {
  clientId: { type: DataTypes.STRING, unique: true },
  category: DataTypes.STRING,
  image: DataTypes.TEXT,
  captionAr: DataTypes.STRING,
  captionEn: DataTypes.STRING,
  date: DataTypes.STRING,
  visible: { type: DataTypes.BOOLEAN, defaultValue: true },
  featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
});

export const Audience = sequelize.define("Audience", {
  stats: DataTypes.JSON,
  instagram: DataTypes.JSON,
  tags: DataTypes.JSON,
  platformSplit: DataTypes.JSON,
});

export const SponsorshipPackage = sequelize.define("SponsorshipPackage", {
  clientId: { type: DataTypes.STRING, unique: true },
  nameAr: DataTypes.STRING,
  nameEn: DataTypes.STRING,
  description: DataTypes.TEXT,
  price: DataTypes.STRING,
  currency: DataTypes.STRING,
  featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  borderColor: DataTypes.STRING,
  ctaAr: DataTypes.STRING,
  visible: { type: DataTypes.BOOLEAN, defaultValue: true },
  features: DataTypes.JSON,
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
});

export const Sponsor = sequelize.define("Sponsor", {
  clientId: { type: DataTypes.STRING, unique: true },
  name: DataTypes.STRING,
  logo: DataTypes.TEXT,
  url: DataTypes.TEXT,
  level: DataTypes.STRING,
  marquee: { type: DataTypes.BOOLEAN, defaultValue: true },
  grid: { type: DataTypes.BOOLEAN, defaultValue: true },
  startDate: DataTypes.STRING,
  notes: DataTypes.TEXT,
  visible: { type: DataTypes.BOOLEAN, defaultValue: true },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
});

export const Contact = sequelize.define("Contact", {
  clientId: { type: DataTypes.STRING, unique: true },
  name: DataTypes.STRING,
  company: DataTypes.STRING,
  email: DataTypes.STRING,
  type: DataTypes.STRING,
  date: DataTypes.STRING,
  status: DataTypes.STRING,
  message: DataTypes.TEXT,
});

export const Setting = sequelize.define("Setting", {
  phone: DataTypes.STRING,
  email: DataTypes.STRING,
  instagramPersonal: DataTypes.STRING,
  instagramGarage: DataTypes.STRING,
  location: DataTypes.STRING,
  whatsapp: DataTypes.STRING,
  siteLogo: DataTypes.TEXT,
  dkLogo: DataTypes.TEXT,
  garageLogo: DataTypes.TEXT,
  favicon: DataTypes.TEXT,
  accent: DataTypes.STRING,
  copyright: DataTypes.STRING,
  footerLine: DataTypes.STRING,
  seoTitle: DataTypes.STRING,
  metaDescription: DataTypes.TEXT,
  keywords: DataTypes.TEXT,
});

export const Analytics = sequelize.define("Analytics", {
  visits: DataTypes.INTEGER,
  newSponsors: DataTypes.INTEGER,
  totalViews: DataTypes.INTEGER,
  maintenanceThisMonth: DataTypes.INTEGER,
  visits30: DataTypes.JSON,
  activity: DataTypes.JSON,
});

export const AdminUser = sequelize.define("AdminUser", {
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: "admin" },
});

export const models = {
  Identity,
  TimelineItem,
  Machine,
  Garage,
  GalleryItem,
  Audience,
  SponsorshipPackage,
  Sponsor,
  Contact,
  Setting,
  Analytics,
  AdminUser,
};
