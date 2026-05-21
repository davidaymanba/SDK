import { create } from "zustand";
import { fetchContent, saveSection, submitContact } from "./api";

import carImage1 from "./assets/images/car-1.png";
import carImage2 from "./assets/images/car-2.png";
import carImage3 from "./assets/images/car-3.png";
import carImage4 from "./assets/images/car-4.png";
import drift2019Image1 from "./assets/images/drift_1.jpg";
import driftActionImage from "./assets/images/drift_action.jpg";
import eventImage1 from "./assets/images/event-1.png";
import garageImage1 from "./assets/images/garage-1.png";
import garageImage2 from "./assets/images/garage-2.png";
import garageImage3 from "./assets/images/garage-3.png";
import garageImage4 from "./assets/images/garage-4.png";
import garageImage5 from "./assets/images/garage-5.png";
import garageImage6 from "./assets/images/garage-6.png";
import garageImage7 from "./assets/images/garage-7.png";
import garageImage8 from "./assets/images/garage-8.png";
import garageImage9 from "./assets/images/garage-9.png";
import driverImage1 from "./assets/images/driver-1.png";
import driverImage2 from "./assets/images/driver-2.png";
import driverImage3 from "./assets/images/driver-3.png";
import driverImage4 from "./assets/images/driver-4.png";
import driverImage5 from "./assets/images/driver-5.png";
import drift2019Image3 from "./assets/images/international_2.jpg";
import middleEastChampionshipImage from "./assets/images/middle-east-championship.png";
import redBullKumhoDriftImage from "./assets/images/red-bull-kumho-drift.png";
import redBullKumhoDriftImage2 from "./assets/images/WhatsApp Image 2026-05-18 at 9.36.57 AM (2).jpeg";
import drift2019Image2 from "./assets/images/WhatsApp Image 2026-05-18 at 9.37.00 AM.jpeg";
import worldDrift2021Image1 from "./assets/images/WhatsApp Image 2026-05-18 at 9.37.01 AM (1).jpeg";
import worldDrift2021Image2 from "./assets/images/WhatsApp Image 2026-05-18 at 9.37.04 AM (1).jpeg";
import worldDrift2021Image3 from "./assets/images/WhatsApp Image 2026-05-18 at 9.37.03 AM (1).jpeg";
import worldDrift2021Image4 from "./assets/images/WhatsApp Image 2026-05-18 at 9.37.05 AM (1).jpeg";
import worldDrift2021Image5 from "./assets/images/WhatsApp Image 2026-05-18 at 9.37.05 AM.jpeg";
import worldDrift2021Image6 from "./assets/images/WhatsApp Image 2026-05-18 at 9.37.06 AM.jpeg";

export const uid = (prefix = "item") => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const defaultContent = {
  identity: {
    fullName: "سيف ديكي",
    nickname: "SDK",
    role: "متسابق درفت عراقي | مالك ديكي كراج",
    shortAr: "سيف ديكي هو متسابق درفت عراقي ومالك ديكي كراج، يصنع حضوره من مزيج الخبرة، الجرأة، والصورة الاحترافية.",
    shortEn: "Iraqi drift driver, Diki Garage owner, and motorsport content platform built for regional sponsors.",
    startYear: 2009,
    profileImage: driverImage1,
    actionImage: driftActionImage,
    highlights: [
      { id: "hi-1", icon: "🏁", ar: "أكثر من 15 سنة خبرة", en: "15+ years of experience" },
      { id: "hi-2", icon: "🌍", ar: "متسابق دولي في الدرفت", en: "International drift driver" },
      { id: "hi-3", icon: "🔧", ar: "مالك ديكي كراج", en: "Diki Garage owner" },
      { id: "hi-4", icon: "🚗", ar: "مالك كراج متخصص", en: "Performance garage owner" },
      { id: "hi-5", icon: "🏆", ar: "مشاركات إقليمية ودولية", en: "Regional and global events" },
      { id: "hi-6", icon: "🔥", ar: "مساهم في تطوير مجتمع السيارات", en: "Car community builder" },
    ],
    storyAr: "بدأت قصة DK من شغف السيارات في البصرة، ثم تحولت إلى مسيرة درفت احترافية تجمع بين المنافسة، صناعة المحتوى، وبناء فريق يقدم صورة عراقية قوية في رياضة المحركات.",
    storyEn: "DK's story started with car culture in Basra and grew into a professional drift journey across competition, content, and team building.",
    storySubtitle: "من الشغف إلى الاحتراف",
  },
  timeline: [
    { id: "ach-1", year: 2011, titleAr: "أول بطل لبطولة العراق للدرفت", titleEn: "First Iraq Drift Championship winner", location: "العراق", type: "🏆 مركز أول", description: "أول بطل لبطولة العراق للدرفت.", image: "", images: [], visible: true },
    { id: "ach-2", year: 2012, titleAr: "ملك الدرفت في العراق", titleEn: "Iraq drift king", location: "العراق", type: "🏆 لقب", description: "ملك الدرفت في العراق.", image: "", images: [], visible: true },
    { id: "ach-3", year: 2016, titleAr: "بطولة ريد بُل كومهو للدرفت", titleEn: "Red Bull Kumho Drift", location: "عُمان", type: "🌍 تمثيل دولي", description: "مشاركة في بطولة ريد بُل كومهو للدرفت في عُمان.", image: redBullKumhoDriftImage, images: [redBullKumhoDriftImage, redBullKumhoDriftImage2], visible: true },
    { id: "ach-4", year: 2019, titleAr: "بطولة ريد بُل الشرق الأوسط للدرفت", titleEn: "Red Bull Middle East Drift Championship", location: "تركيا", type: "🔥 مشاركة مميزة", description: "مشاركة في بطولة ريد بُل الشرق الأوسط للدرفت في تركيا.", image: drift2019Image1, images: [drift2019Image1, drift2019Image2, drift2019Image3], visible: true },
    { id: "ach-5", year: 2021, titleAr: "بطولة العالم للدرفت", titleEn: "World Drift Championship", location: "مصر", type: "🌍 تمثيل دولي", description: "مشاركة في بطولة العالم للدرفت في مصر.", image: worldDrift2021Image1, images: [worldDrift2021Image1, worldDrift2021Image2, worldDrift2021Image3, worldDrift2021Image4, worldDrift2021Image5, worldDrift2021Image6], visible: true },
  ],
  machine: {
    carName: "Nissan GR 2025 Pro Drift",
    headlineAr: "آلة الدرفت — مبنية من الصفر للمنافسة",
    headlineEn: "THE MACHINE",
    descriptionAr: "منصة درفت مبنية للأداء العالي: قوة، توازن، استجابة، وحضور بصري يصنع لقطة لا تنسى.",
    descriptionEn: "A competition-ready drift machine built for power, balance, response, and camera presence.",
    specs: [
      { id: "spec-1", icon: "⚡", ar: "محرك 2JZ احترافي", en: "Built 2JZ engine" },
      { id: "spec-2", icon: "🔥", ar: "قوة 600 حصان", en: "600 horsepower" },
      { id: "spec-3", icon: "🔧", ar: "نظام تعليق احترافي للدرفت", en: "Pro drift suspension" },
      { id: "spec-4", icon: "🏁", ar: "تجهيزات كاملة للمنافسات", en: "Competition setup" },
    ],
    images: [
      { id: "car-1", image: carImage1, caption: "Main angle" },
      { id: "car-2", image: carImage2, caption: "Side profile" },
      { id: "car-3", image: carImage3, caption: "Track stance" },
      { id: "car-4", image: carImage4, caption: "Garage setup" },
    ],
  },
  garage: {
    name: "ديكي كراج",
    descriptionAr: "كراج وفريق متخصص في تجهيز سيارات الأداء والدرفت، من الصيانة الشهرية إلى بناء مشاريع كاملة.",
    descriptionEn: "A performance garage and team focused on drift builds, monthly service, and event preparation.",
    logo: "",
    services: [
      { id: "srv-1", icon: "🔧", titleAr: "صيانة أداء", titleEn: "Performance service", visible: true },
      { id: "srv-2", icon: "🏁", titleAr: "تجهيز درفت", titleEn: "Drift setup", visible: true },
      { id: "srv-3", icon: "⚙️", titleAr: "بناء مشاريع", titleEn: "Custom builds", visible: true },
    ],
    stats: { monthlyCars: 80, yearsExperience: 15, teamMembers: 12, carsBuilt: 35 },
    images: [
      { id: "gar-1", image: garageImage1, caption: "داخل الكراج", category: "داخل الكراج" },
      { id: "gar-2", image: garageImage2, caption: "صيانة", category: "صيانة" },
      { id: "gar-3", image: garageImage3, caption: "الفريق", category: "الفريق" },
    ],
  },
  gallery: [
    { id: "gal-1", category: "السيارة", image: carImage1, captionAr: "زاوية السيارة", captionEn: "Car angle", date: "2026-01-10", visible: true, featured: true },
    { id: "gal-2", category: "السيارة", image: carImage2, captionAr: "تفاصيل الهيكل", captionEn: "Body details", date: "2026-01-11", visible: true, featured: false },
    { id: "gal-3", category: "الفعاليات", image: eventImage1, captionAr: "منافسة درفت", captionEn: "Drift competition", date: "2026-02-02", visible: true, featured: true },
    { id: "gal-4", category: "الكراج", image: garageImage4, captionAr: "داخل الكراج", captionEn: "Inside garage", date: "2026-02-15", visible: true, featured: false },
    { id: "gal-5", category: "المتسابق", image: driverImage2, captionAr: "DK", captionEn: "DK portrait", date: "2026-03-01", visible: true, featured: false },
    { id: "gal-6", category: "الكراج", image: garageImage5, captionAr: "معدات", captionEn: "Tools", date: "2026-03-05", visible: true, featured: false },
    { id: "gal-7", category: "الكراج", image: garageImage6, captionAr: "ورشة العمل", captionEn: "Workshop", date: "2026-03-10", visible: true, featured: false },
    { id: "gal-8", category: "الكراج", image: garageImage7, captionAr: "تجهيز", captionEn: "Setup", date: "2026-03-12", visible: true, featured: false },
    { id: "gal-9", category: "الكراج", image: garageImage8, captionAr: "الفريق", captionEn: "Team", date: "2026-03-14", visible: true, featured: false },
    { id: "gal-10", category: "المتسابق", image: driverImage3, captionAr: "صورة متسابق", captionEn: "Driver shot", date: "2026-03-18", visible: true, featured: false },
    { id: "gal-11", category: "المتسابق", image: driverImage4, captionAr: "جلسة تصوير", captionEn: "Portrait session", date: "2026-03-20", visible: true, featured: false },
    { id: "gal-12", category: "المتسابق", image: driverImage5, captionAr: "خلف الكواليس", captionEn: "Behind the scenes", date: "2026-03-22", visible: true, featured: false },
  ],
  audience: {
    stats: [
      { id: "aud-1", icon: "📱", labelAr: "متابعو الحساب الشخصي", labelEn: "Personal followers", value: 120000, suffix: "+", visible: true },
      { id: "aud-2", icon: "🔧", labelAr: "متابعو صفحة الكراج", labelEn: "Garage followers", value: 45000, suffix: "+", visible: true },
      { id: "aud-3", icon: "🎬", labelAr: "إجمالي المشاهدات", labelEn: "Total views", value: 8000000, suffix: "+", visible: true },
      { id: "aud-4", icon: "🏆", labelAr: "الفعاليات المشارك بها", labelEn: "Events", value: 50, suffix: "+", visible: true },
      { id: "aud-5", icon: "🚗", labelAr: "سيارات صيانة شهرياً", labelEn: "Monthly service cars", value: 80, suffix: "+", visible: true },
      { id: "aud-6", icon: "🌍", labelAr: "دول المشاركة", labelEn: "Countries", value: 5, suffix: "+", visible: true },
    ],
    instagram: { personal: "saif_dk", garage: "dk_garage", personalFollowers: 120000, garageFollowers: 45000, lastFetched: "2026-05-20" },
    tags: [
      { id: "tag-1", ar: "جمهور الدرفت", en: "Drift fans" },
      { id: "tag-2", ar: "أصحاب السيارات الرياضية", en: "Sports car owners" },
      { id: "tag-3", ar: "الشباب العراقي", en: "Iraqi youth" },
      { id: "tag-4", ar: "مجتمع السيارات", en: "Car community" },
    ],
    platformSplit: [
      { platform: "Instagram", value: 48 },
      { platform: "TikTok", value: 22 },
      { platform: "YouTube", value: 16 },
      { platform: "Events", value: 9 },
      { platform: "Other", value: 5 },
    ],
  },
  packages: [
    { id: "pkg-1", nameAr: "الشريك الداعم", nameEn: "SUPPORTING PARTNER", description: "ظهور مرن للعلامات الجديدة", price: "حسب الاتفاق", currency: "USD", featured: false, borderColor: "gray", ctaAr: "اختر الباقة", visible: true, features: [{ id: "pf-1", icon: "✓", textAr: "ظهور على السوشال ميديا", visible: true }, { id: "pf-2", icon: "✓", textAr: "شكر رسمي في الفعاليات", visible: true }] },
    { id: "pkg-2", nameAr: "الراعي الرسمي", nameEn: "OFFICIAL SPONSOR", description: "حضور واضح على السيارة والمحتوى", price: "حسب الاتفاق", currency: "USD", featured: true, borderColor: "red", ctaAr: "اختر الباقة", visible: true, features: [{ id: "pf-3", icon: "✓", textAr: "ظهور على السيارة", visible: true }, { id: "pf-4", icon: "✓", textAr: "ريلز شهرية مخصصة", visible: true }, { id: "pf-5", icon: "✓", textAr: "تقارير أداء للحملات", visible: true }] },
    { id: "pkg-3", nameAr: "الراعي الرئيسي", nameEn: "TITLE SPONSOR", description: "ملكية بصرية رئيسية وحملات موسعة", price: "حسب الاتفاق", currency: "USD", featured: false, borderColor: "gold", ctaAr: "تواصل معنا", visible: true, features: [{ id: "pf-6", icon: "✓", textAr: "الشعار الأكبر على السيارة", visible: true }, { id: "pf-7", icon: "✓", textAr: "محتوى مشترك موسع", visible: true }] },
  ],
  sponsors: [
    { id: "sp-1", name: "BREMBO", logo: "", url: "https://www.brembo.com", level: "Official", marquee: true, grid: true, startDate: "2026-01-01", notes: "", visible: true },
    { id: "sp-2", name: "HKS", logo: "", url: "https://www.hks-power.co.jp", level: "Supporting", marquee: true, grid: true, startDate: "2026-02-01", notes: "", visible: true },
    { id: "sp-3", name: "MOTUL", logo: "", url: "https://www.motul.com", level: "Title", marquee: true, grid: true, startDate: "2026-03-01", notes: "", visible: true },
  ],
  contacts: [
    { id: "req-1", name: "علي حسن", company: "Auto Parts IQ", email: "ali@example.com", type: "الراعي الرسمي", date: "2026-05-20", status: "جديد", message: "نرغب بمعرفة تفاصيل الرعاية الرسمية." },
    { id: "req-2", name: "Sara Motors", company: "Sara Motors", email: "sponsor@example.com", type: "الشريك الداعم", date: "2026-05-18", status: "قيد المراجعة", message: "طلب عرض أسعار للظهور على المحتوى." },
  ],
  settings: {
    phone: "+964 000 000 000",
    email: "contact@dkmotorsport.iq",
    instagramPersonal: "@saif_dk",
    instagramGarage: "@dk_garage",
    location: "البصرة — العراق",
    whatsapp: "+964 000 000 000",
    siteLogo: "",
    dkLogo: "",
    garageLogo: "",
    favicon: "",
    accent: "#CC0000",
    copyright: "© SDK 2026 — جميع الحقوق محفوظة.",
    footerLine: "LET'S BUILD THE FUTURE OF IRAQI MOTORSPORT TOGETHER",
    seoTitle: "SDK | Saif DK",
    metaDescription: "Official SDK profile, sponsorship packages, media gallery, and contact.",
    keywords: "SDK, drift, Iraq, Saif DK",
  },
  analytics: {
    visits: 186420,
    newSponsors: 12,
    totalViews: 8200000,
    maintenanceThisMonth: 80,
    visits30: Array.from({ length: 30 }, (_, index) => ({ day: `${index + 1}`, visits: 3200 + ((index * 719) % 4200) })),
    activity: ["تم تحديث صورة السيارة الرئيسية", "تمت إضافة طلب رعاية جديد", "تم نشر صورة في المعرض", "تم تعديل أرقام الجمهور"],
  },
};

const requestedBrandOverrides = {
  identity: {
    fullName: "سيف ديكي",
    nickname: "SDK",
    role: "متسابق درفت عراقي | مالك ديكي كراج",
    shortAr: "سيف ديكي هو متسابق درفت عراقي ومالك ديكي كراج، يصنع حضوره من مزيج الخبرة، الجرأة، والصورة الاحترافية.",
  },
  garage: {
    name: "ديكي كراج",
  },
};

const requestedTimelineOverrides = [
  { id: "ach-1", year: 2011, titleAr: "أول بطل لبطولة العراق للدرفت", titleEn: "First Iraq Drift Championship winner", location: "العراق", type: "🏆 مركز أول", description: "أول بطل لبطولة العراق للدرفت." },
  { id: "ach-2", year: 2012, titleAr: "ملك الدرفت في العراق", titleEn: "Iraq drift king", location: "العراق", type: "🏆 لقب", description: "ملك الدرفت في العراق." },
  { id: "ach-3", year: 2016, titleAr: "بطولة ريد بُل كومهو للدرفت", titleEn: "Red Bull Kumho Drift", location: "عُمان", type: "🌍 تمثيل دولي", description: "بطولة ريد بُل كومهو للدرفت – عُمان.", image: redBullKumhoDriftImage, images: [redBullKumhoDriftImage, redBullKumhoDriftImage2] },
  { id: "ach-4", year: 2019, titleAr: "بطولة ريد بُل الشرق الأوسط للدرفت", titleEn: "Red Bull Middle East Drift Championship", location: "تركيا", type: "🔥 مشاركة مميزة", description: "بطولة ريد بُل الشرق الأوسط للدرفت – تركيا.", image: drift2019Image1, images: [drift2019Image1, drift2019Image2, drift2019Image3] },
  { id: "ach-5", year: 2021, titleAr: "بطولة العالم للدرفت", titleEn: "World Drift Championship", location: "مصر", type: "🌍 تمثيل دولي", description: "بطولة العالم للدرفت – مصر.", image: worldDrift2021Image1, images: [worldDrift2021Image1, worldDrift2021Image2, worldDrift2021Image3, worldDrift2021Image4, worldDrift2021Image5, worldDrift2021Image6] },
];

function applyTimelineOverrides(timeline = []) {
  return timeline.map((item) => {
    const override = requestedTimelineOverrides.find((entry) => entry.id === item.id || Number(entry.year) === Number(item.year));
    return override ? { ...item, ...override } : item;
  });
}

export const useContentStore = create(
    (set, get) => ({
      content: defaultContent,
      authToken: null,
      authUser: null,
      loading: false,
      error: null,
      dirty: false,
      lastSavedAt: null,
      setAuth: ({ token, user }) => set({ authToken: token, authUser: user }),
      clearAuth: () => set({ authToken: null, authUser: null }),
      loadContent: async () => {
        set({ loading: true, error: null });
        try {
          const content = await fetchContent();
          set({ content, loading: false, dirty: false, lastSavedAt: new Date().toISOString() });
          return content;
        } catch (error) {
          set({ loading: false, error: error.message });
          throw error;
        }
      },
      setSection: (section, value) =>
        get().updateSection(section, () => value),
      updateSection: async (section, updater) => {
        const token = get().authToken;
        const previous = get().content;
        const nextSection = updater(previous[section], previous);
        set({ content: { ...previous, [section]: nextSection }, dirty: true, error: null });
        try {
          const content = await saveSection(section, nextSection, token);
          set({ content, dirty: false, lastSavedAt: new Date().toISOString() });
          return content;
        } catch (error) {
          set({ content: previous, error: error.message });
          throw error;
        }
      },
      save: () => set({ dirty: false, lastSavedAt: new Date().toISOString() }),
      resetContent: () => get().loadContent(),
      addContact: async (request) => {
        const contact = await submitContact(request);
        set((state) => ({
          content: {
            ...state.content,
            contacts: [contact, ...state.content.contacts],
          },
          dirty: false,
        }));
        return contact;
      },
      snapshot: () => get().content,
    })
);
