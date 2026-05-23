import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { ArrowDown, ArrowLeft, Building2, Check, ChevronLeft, Film, Flame, Gauge, Globe2, Instagram, Mail, MapPin, Menu, Moon, Phone, Send, Smartphone, Sun, Trophy, Users, Wrench, X, Zap, ZoomIn } from "lucide-react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import AdminDashboard from "./AdminDashboard.jsx";
import { useContentStore } from "./contentStore";

// Import car images
import carImage1 from "./assets/images/car-1.png";
import carImage2 from "./assets/images/car-2.png";
import carImage3 from "./assets/images/car-3.png";
import carImage4 from "./assets/images/car-4.png";
import driftActionImage from "./assets/images/drift_action.jpg";
import eventImage1 from "./assets/images/event-1.png";
import middleEastChampionshipImage from "./assets/images/middle-east-championship.png";
import redBullKumhoDriftImage from "./assets/images/red-bull-kumho-drift.png";

// Import garage images
import garageImage1 from "./assets/images/garage-1.png";
import garageImage2 from "./assets/images/garage-2.png";
import garageImage3 from "./assets/images/garage-3.png";
import garageImage4 from "./assets/images/garage-4.png";
import garageImage5 from "./assets/images/garage-5.png";
import garageImage6 from "./assets/images/garage-6.png";
import garageImage7 from "./assets/images/garage-7.png";
import garageImage8 from "./assets/images/garage-8.png";
import garageImage9 from "./assets/images/garage-9.png";
import sdkLogo from "./assets/images/sdk-2.png";

// Import driver images
import driverImage1 from "./assets/images/driver-1.png";
import driverImage2 from "./assets/images/driver-2.png";
import driverImage3 from "./assets/images/driver-3.png";
import driverImage4 from "./assets/images/driver-4.png";
import driverImage5 from "./assets/images/driver-5.png";

gsap.registerPlugin(ScrollTrigger);

// Use a tiny inline transparent placeholder to avoid external network requests
const PLACEHOLDER_IMG = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
const heroImage = driverImage1;
const driverPortrait = driverImage1;
const machineImage = PLACEHOLDER_IMG;
const raceTrackImage = PLACEHOLDER_IMG;
const garageImage = PLACEHOLDER_IMG;
const contactImage = PLACEHOLDER_IMG;

const navItems = [
  { label: "الرئيسية", to: "/" },
  { label: "من هو SDK", to: "/about" },
  { label: "الإنجازات", to: "/highlights" },
  { label: "السيارة", to: "/machine" },
  { label: "الفريق", to: "/community" },
  { label: "المعرض", to: "/gallery" },
  { label: "الرعاة", to: "/sponsors" },
  { label: "الباقات", to: "/packages" },
  { label: "تواصل", to: "/contact" },
];

function BrandLogo({ className = "h-14 w-auto" }) {
  const settings = useContentStore((state) => state.content.settings);
  return <img src={settings.siteLogo || sdkLogo} alt="Diki Garage" className={`${className} object-contain`} />;
}

const hudStats = [
  { icon: Zap, value: 600, suffix: " حصان" },
  { icon: Trophy, value: 15, suffix: "+ سنة خبرة" },
  { icon: Flame, value: 50, suffix: "+ فعالية" },
  { icon: Globe2, value: 5, suffix: " دول" },
];

const dkHighlights = [
  "أكثر من 15 سنة خبرة",
  "متسابق دولي في الدرفت",
  "مالك ديكي كراج",
  "مالك كراج متخصص",
  "مشاركات إقليمية ودولية",
  "مساهم في تطوير مجتمع السيارات",
];

const storyMilestones = [
  { year: "2009", title: "بداية المسيرة", location: "البصرة" },
  { year: "2011", title: "أول بطل لبطولة العراق للدرفت", location: "العراق" },
  { year: "2012", title: "ملك الدرفت في العراق", location: "بغداد" },
  { year: "2016", title: "بطولة ريد بُل كومهو للدرفت", location: "عُمان" },
  { year: "2019", title: "بطولة ريد بُل الشرق الأوسط للدرفت", location: "تركيا" },
  { year: "2021", title: "بطولة العالم للدرفت", location: "مصر" },
];

const careerHighlights = [
  { year: "2011", title: "أول بطل لبطولة العراق للدرفت", location: "العراق" },
  { year: "2012", title: "ملك الدرفت في العراق", location: "العراق" },
  { year: "2016", title: "بطولة ريد بُل كومهو للدرفت", location: "عُمان", image: redBullKumhoDriftImage },
  { year: "2019", title: "بطولة ريد بُل الشرق الأوسط للدرفت", location: "تركيا", image: middleEastChampionshipImage },
  { year: "2021", title: "بطولة العالم للدرفت", location: "مصر", image: driftActionImage },
];

const achievementFallbackImages = {
  2016: [redBullKumhoDriftImage],
  2019: [middleEastChampionshipImage, driftActionImage],
  2021: [driftActionImage],
};

function isUsableImage(value) {
  if (typeof value !== "string") return false;
  if (value.startsWith("http") || value.startsWith("data:") || value.startsWith("blob:")) return true;
  return value.includes("/") || /\.(png|jpe?g|webp|gif|svg)$/i.test(value);
}

const countryPins = [
  { flag: "🇮🇶", country: "العراق", x: "57%", y: "48%" },
  { flag: "🇴🇲", country: "عمان", x: "63%", y: "58%" },
  { flag: "🇯🇴", country: "الأردن", x: "53%", y: "46%" },
  { flag: "🇹🇷", country: "تركيا", x: "49%", y: "37%" },
  { flag: "🇪🇬", country: "مصر", x: "49%", y: "55%" },
];

const machineSpecs = [
  "محرك 2JZ احترافي",
  "قوة 600 حصان",
  "نظام تعليق احترافي للدرفت",
  "تجهيزات كاملة للمنافسات",
  "معدة خصيصاً للبطولات",
];

const audienceStats = [
  { icon: Smartphone, value: 120, suffix: "K+", label: "متابعو الصفحة الشخصية" },
  { icon: Wrench, value: 45, suffix: "K+", label: "متابعو صفحة الكراج" },
  { icon: Film, value: 8, suffix: "M+", label: "إجمالي المشاهدات" },
  { icon: Trophy, value: 50, suffix: "+", label: "الفعاليات المشارك بها" },
  { icon: Gauge, value: 80, suffix: "+", label: "سيارات صيانة شهرياً" },
  { icon: Globe2, value: 5, suffix: "+", label: "دول المشاركة" },
];

const audienceTags = [
  "جمهور الدرفت",
  "أصحاب السيارات الرياضية",
  "الشباب العراقي",
  "مجتمع السيارات",
  "جمهور الخليج",
  "متابعو ثقافة السيارات",
];

const mediaCards = [
  { icon: "🎬", title: "فيديوهات درفت احترافية", text: "لقطات عالية الطاقة تصلح للحملات والرعايات." },
  { icon: "📱", title: "ريلز السيارات", text: "محتوى قصير سريع الانتشار للمنصات الاجتماعية." },
  { icon: "🎥", title: "Behind The Scenes", text: "قصة الكواليس من التحضير إلى خط الانطلاق." },
  { icon: "🔧", title: "مشاريع تعديل السيارات", text: "تفاصيل تقنية تربط الجمهور بالمنتجات والخدمات." },
  { icon: "📸", title: "تغطيات الفعاليات", text: "حضور بصري منظم قبل وأثناء وبعد كل فعالية." },
  { icon: "🤝", title: "دمج المنتجات", text: "ظهور طبيعي للعلامات داخل سياق رياضي مؤثر." },
  { icon: "📣", title: "حملات ترويجية", text: "رسائل واضحة مع هوية SDK الحادة." },
  { icon: "🏎️", title: "فيديوهات اختبار الأداء", text: "اختبارات ومشاهد قيادة تبرز القوة والثقة." },
];

const sponsorPlacements = [
  "السيارة",
  "البدلة",
  "الخوذة",
  "الكراج",
  "السوشال ميديا",
  "الستيكرات",
  "المحتوى",
  "لوحات الكراج",
];

const brandingCards = [
  { icon: "🚗", title: "Car Branding", text: "ظهور مباشر على الهيكل، الزجاج، الأبواب، والمؤخرة أثناء السباقات والتصوير." },
  { icon: "👨", title: "Driver Branding", text: "دمج هوية الراعي على البدلة، الخوذة، والمحتوى الشخصي للمتسابق." },
  { icon: "🏪", title: "Garage Branding", text: "حضور داخل الكراج ولوحات الخدمة ومقاطع تجهيز السيارات." },
  { icon: "📱", title: "Digital Branding", text: "ظهور في الريلز، القصص، الفيديوهات، الحملات، والإعلانات المشتركة." },
];

const driftMarketingCards = [
  { icon: "🔥", title: "جمهور وفي ومتفاعل", text: "الدرفت يجذب جمهوراً يتابع التفاصيل، الأصوات، التعديلات، والبطولات بشغف." },
  { icon: "📹", title: "محتوى بصري فيروسي", text: "الدخان، الصوت، واللقطات القريبة تصنع محتوى سريع الانتشار." },
  { icon: "🎯", title: "استهداف دقيق لمجتمع السيارات", text: "الرسالة تصل مباشرة إلى أصحاب السيارات الرياضية ومحبي الأداء." },
  { icon: "💰", title: "استثمار تسويقي طويل الأمد", text: "كل فعالية ومقطع وصورة تضيف أرشيف ظهور مستمر للعلامة." },
];

const sponsorPackages = [
  {
    type: "SUPPORTING PARTNER",
    title: "الشريك الداعم",
    tier: "support",
    cta: "اختر الباقة",
    features: ["ظهور على السوشال ميديا", "شكر رسمي في الفعاليات", "دمج بسيط على المحتوى", "إمكانية استخدام صور DK"],
  },
  {
    type: "OFFICIAL SPONSOR",
    title: "الراعي الرسمي",
    tier: "official",
    badge: "الأكثر طلباً",
    cta: "اختر الباقة",
    features: ["ظهور على السيارة", "ظهور على بدلة السائق", "ريلز شهرية مخصصة", "حضور في الفعاليات", "تقارير أداء للحملات"],
  },
  {
    type: "TITLE SPONSOR",
    title: "الراعي الرئيسي",
    tier: "title",
    badge: "حصري",
    cta: "تواصل معنا",
    features: ["ملكية بصرية رئيسية", "الشعار الأكبر على السيارة", "محتوى مشترك موسع", "ظهور في الكراج والفعاليات", "حملات مخصصة للعلامة", "أولوية في جميع المواد الإعلامية"],
  },
];

const futureGoals = [
  "🏆 بطولات دولية",
  "📺 توسيع المحتوى",
  "🤝 شراكات إقليمية",
  "🎓 أكاديمية درفت",
  "👕 ميرشنديز",
  "🎪 فعاليات مجتمعية",
];

const sponsorNames = ["BREMBO", "HKS", "BC RACING", "MOTUL", "RED BULL", "YOKOHAMA"];

const galleryCategories = ["الكل", "السيارة", "الفعاليات", "الكراج", "المتسابق"];

const galleryItems = [
  { category: "السيارة", image: carImage1, title: "XAD Racing Car 1" },
  { category: "السيارة", image: carImage2, title: "XAD Racing Car 2" },
  { category: "السيارة", image: carImage3, title: "XAD Racing Car 3" },
  { category: "السيارة", image: carImage4, title: "XAD Racing Car 4" },
  { category: "الفعاليات", image: eventImage1, title: "Event Competition" },
  { category: "الكراج", image: garageImage1, title: "الكراج 1" },
  { category: "الكراج", image: garageImage2, title: "الكراج 2" },
  { category: "الكراج", image: garageImage3, title: "الكراج 3" },
  { category: "الكراج", image: garageImage4, title: "الكراج 4" },
  { category: "الكراج", image: garageImage5, title: "الكراج 5" },
  { category: "الكراج", image: garageImage6, title: "الكراج 6" },
  { category: "الكراج", image: garageImage7, title: "الكراج 7" },
  { category: "الكراج", image: garageImage8, title: "الكراج 8" },
  { category: "الكراج", image: garageImage9, title: "الكراج 9" },
  { category: "المتسابق", image: driverImage1, title: "المتسابق 1" },
  { category: "المتسابق", image: driverImage2, title: "المتسابق 2" },
  { category: "المتسابق", image: driverImage3, title: "المتسابق 3" },
  { category: "المتسابق", image: driverImage4, title: "المتسابق 4" },
  { category: "المتسابق", image: driverImage5, title: "المتسابق 5" },
];

const assetImageModules = import.meta.glob("./assets/images/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
});

function galleryCategoryFromPath(path) {
  const name = path.toLowerCase();
  if (name.includes("garage")) return "الكراج";
  if (name.includes("driver")) return "المتسابق";
  if (name.includes("car")) return "السيارة";
  if (name.includes("event") || name.includes("drift") || name.includes("championship") || name.includes("red-bull") || name.includes("international")) return "الفعاليات";
  if (name.includes("touchpoints")) return "الرعاة";
  return "صور إضافية";
}

function galleryTitleFromPath(path) {
  return path
    .split("/")
    .pop()
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ");
}

const assetGalleryItems = Object.entries(assetImageModules).map(([path, image]) => ({
  category: galleryCategoryFromPath(path),
  image,
  title: galleryTitleFromPath(path),
})).filter((item) => !String(item.title).toLowerCase().includes("sdk-2"));

function galleryImageKey(image) {
  return String(image || "")
    .split("?")[0]
    .split("/")
    .pop()
    .replace(/-[A-Za-z0-9_-]{6,}(?=\.[^.]+$)/, "")
    .toLowerCase();
}

const sections = [
  {
    kicker: "WHO IS SDK",
    title: "من هو SDK",
    text: "سيف ديكي، متسابق درفت عراقي يحمل حضور SDK إلى ساحات إقليمية ودولية بروح تنافسية وصورة احترافية جاهزة للرعاة.",
  },
  {
    kicker: "MACHINE",
    title: "السيارة",
    text: "منصة درفت مبنية للأداء العالي: قوة، توازن، استجابة، وحضور بصري يصنع لقطة لا تنسى مع كل دخان إطار.",
  },
  {
    kicker: "SPONSORSHIP",
    title: "باقات الرعاية",
    text: "مساحات ظهور مرئية، محتوى اجتماعي، فعاليات، وتجارب ضيوف مصممة للعلامات التي تريد دخول عالم رياضة المحركات بجرأة.",
  },
];

function useCountUp(value, margin = "-70px", duration = 1.35) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = { value: 0 };
    gsap.to(controls, {
      value,
      duration,
      ease: "power3.out",
      onUpdate: () => setCount(Math.round(controls.value)),
    });
  }, [duration, inView, value]);

  return { ref, count };
}

function App() {
  const location = useLocation();
  const loadContent = useContentStore((state) => state.loadContent);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    const savedTheme = window.localStorage.getItem("sdk-theme");
    if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });

  useEffect(() => {
    loadContent().catch((error) => console.error("Failed to load content", error));
  }, [loadContent]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("sdk-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  if (location.pathname.startsWith("/admin")) {
    return <AdminDashboard />;
  }
  return <PublicSite theme={theme} onToggleTheme={toggleTheme} />;
}

function PublicSite({ theme, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.075, smoothWheel: true });
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const onScroll = () => setScrolled(window.scrollY > 26);
    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => {
      lenis.destroy();
      window.removeEventListener("scroll", onScroll);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.utils.toArray(".reveal-section").forEach((section) => {
        const children = section.querySelectorAll(".reveal-child");
        gsap.fromTo(
          children,
          { y: 58, autoAlpha: 0, filter: "blur(14px)" },
          {
            y: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 1.05,
            stagger: 0.12,
            ease: "power4.out",
            scrollTrigger: { trigger: section, start: "top 76%" },
          }
        );
      });
      ScrollTrigger.refresh();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <main dir="rtl" className="min-h-screen overflow-hidden bg-bg-primary text-white selection:bg-accent-red selection:text-white">
      <Particles />
      <Navbar scrolled={scrolled} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu open={menuOpen} setOpen={setMenuOpen} />
      <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />

      <ScrollToTop />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<><WhoIsDkSection /><StorySection /><InternationalSection /></>} />
        <Route path="/highlights" element={<CareerHighlightsSection />} />
        <Route path="/machine" element={<MachineSection />} />
        <Route path="/community" element={<AudienceSection />} />
        <Route path="/gallery" element={<GallerySection />} />
        <Route path="/sponsors" element={<SponsorsPage />} />
        <Route path="/packages" element={<SponsorshipPackagesSection />} />
        <Route path="/contact" element={<ContactSection />} />
        <Route path="*" element={<HomePage />} />
      </Routes>

      <Footer />
    </main>
  );
}

function ThemeToggle({ theme, onToggleTheme }) {
  const isLight = theme === "light";

  return (
    <button
      type="button"
      className="theme-toggle fixed bottom-6 left-6 z-[70] inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/70 px-4 py-3 text-sm font-bold text-white backdrop-blur-md transition hover:border-accent-red hover:shadow-neon"
      onClick={onToggleTheme}
      aria-label={isLight ? "تفعيل الوضع الداكن" : "تفعيل الوضع الفاتح"}
      title={isLight ? "Dark" : "Light"}
    >
      {isLight ? <Moon className="theme-toggle-icon h-5 w-5" /> : <Sun className="theme-toggle-icon h-5 w-5" />}
      <span className="theme-toggle-label">{isLight ? "Dark" : "Light"}</span>
    </button>
  );
}

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);
  return null;
}

function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "24%"]);
  const smokeY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  return (
    <>
      <section ref={heroRef} id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: heroY, backgroundImage: `url(${heroImage})` }}
          className="absolute inset-0 scale-110 bg-cover bg-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-black/70 to-black/25" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(204,0,0,0.16),transparent_38%)]" />
        <motion.div style={{ y: smokeY }} className="pointer-events-none absolute inset-0 opacity-80">
          <SmokeOverlay />
          <TrackLines />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-5 pt-28 text-center"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="drop-shadow-[0_0_18px_rgba(255,0,0,0.72)]"
          >
            <BrandLogo className="h-36 w-auto sm:h-48 lg:h-56" />
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.95, duration: 0.8 }}
            className="max-w-3xl"
          >
            <h2 className="font-arabic text-[clamp(1.8rem,4vw,2.4rem)] font-black">سيف ديكي</h2>
            <p className="mt-2 font-arabic text-lg text-text-muted">متسابق درفت عراقي | مالك ديكي كراج</p>
            <p className="mt-3 font-arabic text-xl font-bold italic text-accent-red-bright drop-shadow-[0_0_14px_rgba(255,0,0,0.65)]">
              تمثيل رياضة المحركات العراقية إقليمياً ودولياً
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 36, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.12, duration: 0.75 }}
            className="mt-9 flex flex-col gap-4 sm:flex-row"
          >
            <Link to="/packages" className="group inline-flex items-center justify-center gap-3 rounded-xl bg-accent-red px-8 py-4 font-arabic text-base font-black text-white transition duration-300 hover:bg-accent-red-bright hover:shadow-neon">
              باقات الرعاية
              <ArrowLeft className="h-5 w-5 transition group-hover:-translate-x-1" />
            </Link>
            <Link to="/about" className="inline-flex items-center justify-center rounded-xl border border-white/35 px-8 py-4 font-arabic text-base font-black text-white backdrop-blur-sm transition duration-300 hover:border-accent-red hover:text-accent-red-bright hover:shadow-neon">
              تعرف على SDK
            </Link>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-0 z-20 w-full border-y border-white/10 bg-black/60 backdrop-blur-xl">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px md:grid-cols-4">
            {hudStats.map((stat) => (
              <Counter key={stat.suffix} {...stat} />
            ))}
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 14, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-36 left-1/2 z-20 -translate-x-1/2 text-accent-red-bright"
        >
          <ArrowDown className="h-8 w-8" />
        </motion.div>
      </section>

      <Ticker />
    </>
  );
}

function SponsorsPage() {
  return (
    <>
      <MediaValueSection />
      <SponsorshipVisibilitySection />
      <DriftMarketingSection />
      <FutureVisionSection />
      <PartnersSection />
    </>
  );
}

function WhoIsDkSection() {
  const identity = useContentStore((state) => state.content.identity);
  const highlights = identity.highlights.map((item) => item.ar).filter(Boolean);
  return (
    <section id="about" className="reveal-section who-section relative overflow-hidden bg-bg-primary px-5 py-28 lg:py-36">
      <CircuitLines />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(204,0,0,0.22),transparent_34%),linear-gradient(180deg,#0a0a0a_0%,#111111_52%,#0a0a0a_100%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="reveal-child order-2 lg:order-1">
          <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0.5 }}
            whileInView={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="driver-frame group relative min-h-[520px] overflow-hidden rounded-2xl border border-white/10 bg-black"
          >
            <img
              src={identity.profileImage || driverPortrait}
              alt="Saif Yousif Al-Kaabi racing driver portrait"
              className="absolute inset-0 h-full w-full object-cover object-center grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/15 to-accent-red/55 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-6">
              <div className="text-right">
                <p className="font-display text-5xl leading-none text-white">SDK</p>
                <p className="mt-1 font-latin text-xs font-bold uppercase tracking-[0.28em] text-accent-red-bright">{identity.role}</p>
              </div>
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-xl border border-accent-red bg-black/70 font-display text-4xl text-white shadow-neon">
                {identity.nickname}
              </span>
            </div>
          </motion.div>
        </div>

        <div className="reveal-child order-1 text-right lg:order-2">
          <p className="font-display text-2xl tracking-[0.36em] text-accent-red-bright drop-shadow-[0_0_14px_rgba(255,0,0,0.72)]">
            WHO IS SDK
          </p>
          <h2 aria-label="من هو SDK" className="glitch mt-4 font-arabic text-[clamp(3rem,8vw,7rem)] font-black leading-none text-white">
            من هو SDK
          </h2>
          <span className="red-underline mt-7 block h-1.5 w-48 bg-accent-red-bright" />
          <p className="mt-9 max-w-2xl font-arabic text-xl leading-10 text-white/76">
            {identity.shortAr}
          </p>

          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {highlights.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.08, duration: 0.55, ease: "easeOut" }}
                className="check-item flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-4 font-arabic text-base font-bold text-white/90 backdrop-blur-sm transition hover:border-accent-red hover:bg-accent-red/10 hover:shadow-neon"
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-accent-red text-white shadow-[0_0_18px_rgba(255,0,0,0.48)]">
                  <Check className="h-4 w-4 stroke-[4]" />
                </span>
                {item}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StorySection() {
  const { identity, timeline } = useContentStore((state) => state.content);
  const milestones = timeline.filter((item) => item.visible).map((item) => ({ year: item.year, title: item.titleAr, location: item.location }));
  return (
    <section id="story" className="reveal-section carbon-section relative overflow-hidden px-5 py-28 lg:py-36">
      <TimelineSmoke />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading label="THE STORY" title={identity.storySubtitle} />
        <p className="reveal-child mt-8 max-w-4xl font-arabic text-xl leading-10 text-white/72">{identity.storyAr}</p>
        <div className="relative mt-16">
          <div className="timeline-line absolute right-4 top-0 hidden h-full w-1 bg-white/10 md:block">
            <span className="block h-full w-full origin-top bg-accent-red-bright" />
          </div>
          <div className="grid gap-8">
            {milestones.map((item, index) => (
              <motion.article
                key={`${item.year}-${item.title}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.08, duration: 0.7, ease: "easeOut" }}
                className="timeline-card relative mr-0 rounded-2xl border border-white/10 bg-black/45 p-6 backdrop-blur-md transition hover:border-accent-red hover:shadow-neon md:mr-16"
              >
                <span className="absolute -right-[4.95rem] top-8 hidden h-5 w-5 rounded-full border-2 border-accent-red-bright bg-black shadow-neon md:block" />
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <p className="motion-year font-display text-[clamp(4rem,10vw,8rem)] leading-none text-accent-red-bright">{item.year}</p>
                  <div className="pb-3 text-right">
                    <h3 className="font-arabic text-3xl font-black text-white">{item.title}</h3>
                    <p className="mt-2 inline-flex items-center gap-2 rounded-lg border border-accent-red/50 px-3 py-1 font-arabic text-sm font-bold text-white/70">
                      <MapPin className="h-4 w-4 text-accent-red-bright" />
                      {item.location}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CareerHighlightsSection() {
  const careerItems = useContentStore((state) => state.content.timeline).filter((item) => item.visible);
  return (
    <section id="highlights" className="reveal-section relative overflow-hidden bg-bg-primary px-5 py-28 lg:py-36">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(204,0,0,0.11),transparent_35%,rgba(255,255,255,0.035)_55%,transparent_72%)]" />
      <TimelineSmoke />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading label="CAREER HIGHLIGHTS" title="محطات لا تنسى" />
        <div className="relative mt-16">
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-white/10 md:block">
            <span className="timeline-line block h-full w-full origin-top bg-accent-red-bright" />
          </div>
          <div className="grid gap-8">
            {careerItems.map((item, index) => {
              const left = index % 2 === 0;
              return (
                <motion.article
                  key={`${item.year}-${item.titleAr}`}
                  initial={{ opacity: 0, x: left ? -90 : 90, filter: "blur(8px)" }}
                  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  className={`highlight-card relative w-full rounded-2xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-md transition hover:border-accent-red hover:shadow-neon md:w-[47%] ${left ? "md:ml-auto" : "md:mr-auto"}`}
                >
                  <AchievementImageCarousel item={item} />
                  <Trophy className="mb-6 h-10 w-10 text-accent-red-bright drop-shadow-[0_0_14px_rgba(255,0,0,0.7)]" />
                  <p className="motion-year font-display text-[clamp(4rem,9vw,7rem)] leading-none text-accent-red-bright">{item.year}</p>
                  <h3 className="mt-3 font-arabic text-3xl font-black">{item.titleAr}</h3>
                  <p className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent-red px-3 py-1 font-arabic text-sm font-black text-white">
                    <MapPin className="h-4 w-4" />
                    {item.location}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function AchievementImageCarousel({ item }) {
  const fallbackImages = achievementFallbackImages[Number(item.year)] || [];
  const images = Array.from(new Set([...(item.images || []), item.image, ...fallbackImages].filter(isUsableImage)));
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [item.id, images.length]);

  if (!images.length) return null;

  const goTo = (next) => {
    setActive((current) => (next + images.length) % images.length);
  };

  return (
    <div className="relative mb-6 overflow-hidden rounded-xl border border-white/10 bg-black/50">
      <div className="relative aspect-[16/10]">
        <motion.img
          key={`${item.id}-${active}`}
          src={images[active]}
          alt={`${item.titleAr} ${active + 1}`}
          initial={{ opacity: 0, scale: 1.04, x: 28 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className="absolute inset-0 h-full w-full object-contain"
        />
      </div>
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-lg border border-white/15 bg-black/70 text-white transition hover:border-accent-red hover:bg-accent-red"
            aria-label="الصورة السابقة"
          >
            <ChevronLeft className="h-5 w-5 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-lg border border-white/15 bg-black/70 text-white transition hover:border-accent-red hover:bg-accent-red"
            aria-label="الصورة التالية"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActive(index)}
                className={`h-2.5 rounded-full transition ${active === index ? "w-8 bg-accent-red-bright shadow-neon" : "w-2.5 bg-white/45 hover:bg-white"}`}
                aria-label={`عرض الصورة ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function InternationalSection() {
  return (
    <section id="international" className="reveal-section map-section relative overflow-hidden bg-bg-secondary px-5 py-28 lg:py-36">
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading label="INTERNATIONAL REPRESENTATION" title="من العراق إلى العالم" center />
        <div className="relative mt-14 min-h-[470px] overflow-hidden rounded-2xl border border-white/10 bg-black/45">
          <div className="world-map absolute inset-0" />
          {countryPins.map((pin, index) => (
            <motion.div
              key={pin.country}
              initial={{ opacity: 0, scale: 0.3, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.14, type: "spring", stiffness: 180, damping: 14 }}
              className="map-pin absolute z-10"
              style={{ left: pin.x, top: pin.y }}
            >
              <span className="text-3xl">{pin.flag}</span>
              <strong className="font-arabic text-sm">{pin.country}</strong>
            </motion.div>
          ))}
          <div className="absolute inset-0 grid place-items-center px-6 text-center">
            <h3 className="glitch font-arabic text-[clamp(2.5rem,7vw,6.5rem)] font-black" aria-label="من العراق إلى العالم">
              من العراق إلى العالم
            </h3>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <CounterCard value={5} suffix=" دول" label="شبكة مشاركات" icon={Globe2} />
          <CounterCard value={10} suffix="+ بطولات" label="حضور تنافسي" icon={Trophy} />
          <CounterCard value={1} suffix=" تمثيل عالمي" label="هوية عراقية" icon={Users} />
        </div>
      </div>
    </section>
  );
}

function MachineSection() {
  const machine = useContentStore((state) => state.content.machine);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const carY = useTransform(scrollYProgress, [0, 1], ["-5%", "12%"]);

  return (
    <section ref={sectionRef} id="machine" className="reveal-section garage-section relative overflow-hidden px-5 py-28 lg:py-36">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-bg-secondary to-black" />
      <motion.img
        src={machine.images[0]?.image || machineImage}
        alt="Nissan GR 2025 Pro Drift sports car"
        style={{ y: carY }}
        className="absolute inset-x-0 bottom-0 h-[58%] w-full object-cover object-center opacity-45"
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/55 to-transparent" />
      <div className="car-glow absolute bottom-[10%] left-1/2 h-20 w-[70vw] -translate-x-1/2 rounded-full bg-accent-red/30 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="reveal-child order-2 lg:order-1">
          <RpmGauge />
        </div>
        <div className="reveal-child order-1 text-right lg:order-2">
          <p className="font-display text-3xl tracking-[0.34em] text-accent-red-bright">THE MACHINE</p>
          <h2 className="mt-4 font-display text-[clamp(4rem,11vw,9.5rem)] leading-none text-white">
            {machine.carName}
          </h2>
          <p className="mt-4 font-arabic text-2xl font-black text-white/72">{machine.headlineAr}</p>
          <p className="mt-4 font-arabic text-lg leading-8 text-white/60">{machine.descriptionAr}</p>
          <div className="mt-10 grid gap-4">
            {machine.specs.map((spec, index) => (
              <motion.div
                key={spec.id || spec.ar}
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.08, duration: 0.58, ease: "easeOut" }}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/55 px-5 py-4 font-arabic text-lg font-black backdrop-blur-md transition hover:border-accent-red hover:shadow-neon"
              >
                <Zap className="h-6 w-6 shrink-0 fill-accent-red-bright text-accent-red-bright" />
                <span className="text-2xl">{spec.icon}</span>
                {spec.ar}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AudienceSection() {
  const { audience, garage } = useContentStore((state) => state.content);
  const stats = audience.stats.filter((item) => item.visible).map((item) => ({
    icon: item.labelAr.includes("الحساب") ? Smartphone : item.labelAr.includes("كراج") || item.labelAr.includes("صيانة") ? Wrench : item.labelAr.includes("مشاهد") ? Film : item.labelAr.includes("دول") ? Globe2 : Trophy,
    value: item.labelAr.includes("صيانة") ? garage.stats.monthlyCars : item.value,
    suffix: item.suffix || "",
    label: item.labelAr,
  }));
  return (
    <section id="community" className="reveal-section relative overflow-hidden bg-bg-primary px-5 py-28 lg:py-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_28%,rgba(204,0,0,0.18),transparent_34%)]" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading label="AUDIENCE & COMMUNITY" title="متابعين صفحة الكراج" />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <CounterCard key={stat.label} {...stat} />
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          {audience.tags.map((tag, index) => (
            <motion.span
              key={tag.id || tag.ar}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-5 py-3 font-arabic text-sm font-black text-white/78 backdrop-blur-md transition hover:border-accent-red hover:text-white hover:shadow-neon"
            >
              {tag.ar}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}

function MediaValueSection() {
  return (
    <section id="media" className="reveal-section relative overflow-hidden bg-bg-secondary px-5 py-28 lg:py-36">
      <div className="absolute inset-0 bg-[linear-gradient(140deg,transparent,rgba(255,0,0,0.12),transparent_58%)]" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading label="MEDIA & CONTENT VALUE" title="قيمة المحتوى الإعلامي" />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {mediaCards.map((card, index) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.045, duration: 0.55 }}
              whileHover={{ y: -8, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="group relative grid min-h-36 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-black/50 px-6 py-12 text-center backdrop-blur-md transition duration-500 hover:border-accent-red hover:shadow-neon"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(255,0,0,0.22),transparent_60%)]" />
              </div>

              <span className="absolute right-5 top-5 text-2xl transition duration-500 group-hover:scale-110">{card.icon}</span>
              <h3 className="font-arabic text-2xl font-black leading-snug text-white">{card.title}</h3>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SponsorshipVisibilitySection() {
  return (
    <section id="visibility" className="reveal-section stripe-divider relative overflow-hidden bg-bg-primary px-5 py-28 lg:py-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,0,0,0.17),transparent_34%)]" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading label="SPONSORSHIP VISIBILITY" title="مساحات ظهور الرعاة" center />
        <div className="mt-14 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="car-mockup relative overflow-hidden rounded-2xl border border-white/10 bg-black/65 p-6 backdrop-blur-xl"
          >
            <svg viewBox="0 0 980 420" className="w-full" aria-label="Sponsor placement diagram">
              <path className="mock-car-body" d="M92 268 C138 208 210 178 324 166 L428 86 H626 L726 166 C826 178 894 210 930 268 L890 310 H126 Z" />
              <path className="mock-window" d="M444 112 H604 L680 170 H360 Z" />
              <rect className="mock-zone zone-hood" x="394" y="202" width="196" height="70" rx="6" />
              <rect className="mock-zone zone-door" x="250" y="238" width="150" height="62" rx="6" />
              <rect className="mock-zone zone-rear" x="690" y="228" width="126" height="58" rx="6" />
              <rect className="mock-zone zone-windshield" x="424" y="126" width="210" height="28" rx="4" />
              <circle className="mock-wheel" cx="240" cy="314" r="48" />
              <circle className="mock-wheel" cx="752" cy="314" r="48" />
              <text x="492" y="246" textAnchor="middle">الشعار الرئيسي</text>
              <text x="325" y="276" textAnchor="middle">اسم الراعي</text>
              <text x="753" y="264" textAnchor="middle">الشعار الخلفي</text>
              <text x="529" y="147" textAnchor="middle">الشريط العلوي</text>
            </svg>
          </motion.div>
          <div className="grid gap-4">
            {brandingCards.map((card, index) => (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.025 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="expand-card group border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl hover:border-accent-red hover:shadow-neon"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{card.icon}</span>
                  <h3 className="font-latin text-xl font-black uppercase tracking-[0.08em] text-white">{card.title}</h3>
                </div>
                <p className="expand-detail mt-3 font-arabic text-base leading-8 text-text-muted">{card.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
        <div className="mt-12 border border-white/10 bg-black/55 p-6 backdrop-blur-md">
          <p className="font-latin text-sm font-black uppercase tracking-[0.22em] text-accent-red-bright">Sponsor logo will appear on:</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {sponsorPlacements.map((item, index) => (
              <motion.span key={item} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }} className="placement-chip font-arabic">
                {item}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DriftMarketingSection() {
  return (
    <section className="reveal-section stripe-divider relative overflow-hidden bg-bg-secondary px-5 py-28 lg:py-36">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,0,0,0.12),transparent_36%,rgba(255,255,255,0.03)_70%,transparent)]" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading label="WHY DRIFT MARKETING WORKS" title="لماذا الدرفت منصة تسويقية؟" />
        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {driftMarketingCards.map((card, index) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 44 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10, scale: 1.02 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.08 }}
              className="marketing-card min-h-72 border border-white/10 bg-black/55 p-7 backdrop-blur-md"
            >
              <span className="text-5xl">{card.icon}</span>
              <h3 className="mt-8 font-arabic text-3xl font-black">{card.title}</h3>
              <p className="mt-5 font-arabic text-lg leading-9 text-text-muted">{card.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SponsorshipPackagesSection() {
  const packages = useContentStore((state) => state.content.packages).filter((pack) => pack.visible);
  return (
    <section id="packages" className="reveal-section stripe-divider relative overflow-hidden bg-bg-primary px-5 py-28 lg:py-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(204,0,0,0.2),transparent_35%),linear-gradient(180deg,#0a0a0a,#151515,#090909)]" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading label="SPONSORSHIP PACKAGES" title="باقات الرعاية" center />
        <div className="mt-16 grid gap-6 lg:grid-cols-3 lg:items-stretch">
          {packages.map((pack, index) => (
            <motion.article
              key={pack.id}
              initial={{ opacity: 0, y: 70 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -12, scale: 1.018 }}
              viewport={{ once: true, margin: "-90px" }}
              transition={{ delay: index * 0.1, duration: 0.65 }}
              className={`package-card ${pack.borderColor === "gold" ? "package-title" : pack.borderColor === "red" ? "package-official" : "package-support"} relative flex min-h-[560px] flex-col border bg-black/72 p-7 pt-12 backdrop-blur-xl`}
            >
              <div className="absolute left-6 top-4 z-20 flex flex-wrap gap-2">
                {pack.featured && <span className="whitespace-nowrap rounded-md bg-accent-red px-5 py-2 font-arabic text-base font-black text-white shadow-neon">الأكثر طلباً</span>}
                {pack.borderColor === "gold" && <span className="whitespace-nowrap rounded-md border border-yellow-400/70 bg-black px-5 py-2 font-arabic text-base font-black text-yellow-200 shadow-[0_0_24px_rgba(234,179,8,0.35)]">المميز</span>}
              </div>
              <p className="font-display text-3xl tracking-[0.12em] text-accent-red-bright">{pack.nameEn}</p>
              <h3 className="mt-3 font-arabic text-4xl font-black">{pack.nameAr}</h3>
              <p className="mt-4 font-arabic text-white/60">{pack.description}</p>
              <ul className="mt-9 grid gap-4">
                {pack.features.filter((feature) => feature.visible).map((feature) => (
                  <li key={feature.id} className="flex items-center gap-3 font-arabic text-lg text-white/82">
                    <Check className="h-5 w-5 shrink-0 text-accent-red-bright" />
                    {feature.textAr}
                  </li>
                ))}
              </ul>
              <motion.div whileTap={{ scale: 0.96 }} className="mt-auto">
                <Link to="/contact" className={`racing-button inline-flex w-full items-center justify-center px-6 py-4 font-arabic text-lg font-black ${pack.borderColor === "gray" ? "border border-white/25 text-white" : "bg-accent-red text-white shadow-neon"}`}>
                {pack.ctaAr}
                </Link>
              </motion.div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FutureVisionSection() {
  return (
    <section className="reveal-section starfield stripe-divider relative overflow-hidden bg-bg-secondary px-5 py-28 lg:py-36">
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading label="FUTURE VISION" title="الرؤية المستقبلية" />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {futureGoals.map((goal, index) => (
            <motion.article key={goal} initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -8 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="vision-card border border-white/10 bg-black/50 p-8 font-arabic text-2xl font-black backdrop-blur-md hover:border-accent-red hover:shadow-neon">
              {goal}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnersSection() {
  const sponsors = useContentStore((state) => state.content.sponsors).filter((sponsor) => sponsor.visible);
  const names = sponsors.length ? sponsors.map((sponsor) => sponsor.name) : sponsorNames;
  const row = names.join(" ♦ ");
  return (
    <section id="sponsors" className="reveal-section stripe-divider overflow-hidden bg-bg-primary px-5 py-28 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeading label="PARTNERS / SPONSORS" title="الرعاة والشركاء" center />
      </div>
      <div className="mt-14 space-y-4 border-y border-white/10 py-6">
        <div className="sponsor-marquee font-display text-5xl text-white/80"><span>{`${row} ♦ `.repeat(5)}</span></div>
        <div className="sponsor-marquee reverse font-display text-5xl text-accent-red-bright"><span>{`${row} ♦ `.repeat(5)}</span></div>
      </div>
      <div className="mx-auto mt-12 grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sponsors.filter((sponsor) => sponsor.grid).map((sponsor) => (
          <motion.div key={sponsor.id} whileHover={{ scale: 1.04 }} className="sponsor-logo-card grid h-36 place-items-center border border-white/10 bg-white/[0.035] font-display text-4xl tracking-[0.08em] text-white/78 transition hover:border-white/50 hover:shadow-[0_0_34px_rgba(255,255,255,0.22)]">
            {sponsor.logo ? <img src={sponsor.logo} alt={sponsor.name} className="max-h-20 max-w-[70%] object-contain" /> : sponsor.name}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function GallerySection() {
  const [active, setActive] = useState("الكل");
  const [lightbox, setLightbox] = useState(null);
  const managedGallery = useContentStore((state) => state.content.gallery);
  const publicGallery = [
    ...managedGallery.filter((item) => item.visible).map((item) => ({ category: item.category, image: item.image, title: item.captionAr || item.captionEn })),
    ...assetGalleryItems,
  ];
  const seenImages = new Set();
  const categories = ["الكل", ...Array.from(new Set(publicGallery.map((item) => item.category)))];
  const items = (active === "الكل" ? publicGallery : publicGallery.filter((item) => item.category === active)).filter((item) => {
    const key = galleryImageKey(item.image);
    if (!item.image || item.image === PLACEHOLDER_IMG || !key || seenImages.has(key)) return false;
    seenImages.add(key);
    return true;
  });
  const lightboxIndex = lightbox ? items.findIndex((item) => item.image === lightbox.image) : -1;
  const showLightboxAt = (index) => {
    if (!items.length) return;
    setLightbox(items[(index + items.length) % items.length]);
  };

  return (
    <section id="gallery" className="reveal-section stripe-divider relative overflow-hidden bg-bg-secondary px-5 py-28 lg:py-36">
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading label="MEDIA GALLERY" title="المعرض الإعلامي" />
        <div className="mt-10 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button key={category} type="button" onClick={() => setActive(category)} className={`rounded-xl px-5 py-3 font-arabic text-sm font-black transition ${active === category ? "bg-accent-red text-white shadow-neon" : "border border-white/10 bg-black/40 text-white/70 hover:border-accent-red"}`}>
              {category}
            </button>
          ))}
        </div>
        <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {items.map((item, index) => (
            <motion.button key={`${item.title}-${index}`} type="button" onClick={() => setLightbox(item)} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="gallery-item group mb-5 block w-full overflow-hidden border border-white/10 bg-black text-right">
              <img src={item.image} alt={item.title} className="h-auto min-h-64 w-full object-cover transition duration-700 group-hover:scale-110" />
              <span className="absolute inset-0 grid place-items-center bg-accent-red/0 opacity-0 transition group-hover:bg-accent-red/45 group-hover:opacity-100">
                <ZoomIn className="h-12 w-12 text-white" />
              </span>
            </motion.button>
          ))}
        </div>
      </div>
      {lightbox && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/80 p-5 backdrop-blur-xl" onClick={() => setLightbox(null)}>
          <button type="button" className="absolute left-5 top-5 grid h-12 w-12 place-items-center rounded-xl border border-white/20 bg-black/55 text-white" aria-label="إغلاق"><X /></button>
          {items.length > 1 && (
            <>
              <button type="button" onClick={(event) => { event.stopPropagation(); showLightboxAt(lightboxIndex - 1); }} className="absolute right-5 top-1/2 z-10 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-xl border border-white/20 bg-black/65 text-white transition hover:border-accent-red hover:bg-accent-red" aria-label="الصورة السابقة">
                <ChevronLeft className="h-7 w-7 rotate-180" />
              </button>
              <button type="button" onClick={(event) => { event.stopPropagation(); showLightboxAt(lightboxIndex + 1); }} className="absolute left-5 top-1/2 z-10 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-xl border border-white/20 bg-black/65 text-white transition hover:border-accent-red hover:bg-accent-red" aria-label="الصورة التالية">
                <ChevronLeft className="h-7 w-7" />
              </button>
            </>
          )}
          <img src={lightbox.image} alt={lightbox.title} className="max-h-[82vh] max-w-5xl rounded-2xl border border-white/10 object-contain shadow-neon" />
        </div>
      )}
    </section>
  );
}

function ContactSection() {
  const { settings } = useContentStore((state) => state.content);
  const addContact = useContentStore((state) => state.addContact);
  const [formMessage, setFormMessage] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      await addContact({
        name: data.get("name") || "",
        company: data.get("company") || "",
        email: data.get("email") || "",
        type: data.get("type") || "",
        message: data.get("message") || "",
      });
      event.currentTarget.reset();
      setFormMessage("تم إرسال الطلب وحفظه في لوحة التحكم.");
    } catch {
      setFormMessage("تعذر إرسال الطلب حالياً. يرجى المحاولة مرة أخرى.");
    }
  };
  return (
    <section id="contact" className="reveal-section stripe-divider relative min-h-screen overflow-hidden bg-bg-primary px-5 py-24 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(204,0,0,0.22),transparent_34%),radial-gradient(circle_at_84%_70%,rgba(255,255,255,0.08),transparent_26%),linear-gradient(135deg,#050505,#111,#070707)]" />
      <CircuitLines />
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="text-right">
          <SectionHeading label="CONTACT" title="تواصل معنا" />
          <p className="mt-8 font-display text-[clamp(2.6rem,6vw,5.3rem)] leading-none text-white">
            {settings.footerLine}
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <ContactCard icon={Phone} label="الهاتف" value={settings.phone} />
            <ContactCard icon={Mail} label="البريد" value={settings.email} />
            <ContactCard icon={Instagram} label="إنستغرام" value={settings.instagramPersonal} />
            <ContactCard icon={MapPin} label="الموقع" value={settings.location} />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-white/10 bg-black/55 p-5 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="name" placeholder="الاسم" />
              <input name="company" placeholder="الشركة" />
            </div>
            <input name="email" placeholder="البريد الإلكتروني" type="email" />
            <select name="type" defaultValue="">
              <option value="" disabled>نوع الرعاية</option>
              <option>الشريك الداعم</option>
              <option>الراعي الرسمي</option>
              <option>الراعي الرئيسي</option>
            </select>
            <textarea name="message" placeholder="رسالة" rows="5" />
            {formMessage && <p className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 font-arabic text-sm text-green-200">{formMessage}</p>}
            <motion.button whileTap={{ scale: 0.98 }} type="submit" className="racing-button flex items-center justify-center gap-3 rounded-xl bg-accent-red px-6 py-4 font-arabic text-lg font-black text-white shadow-neon">
              إرسال الطلب
              <Send className="h-5 w-5" />
            </motion.button>
          </form>
      </div>
    </section>
  );
}

function ContactCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/50 p-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent-red text-white shadow-neon">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="font-arabic text-sm text-text-muted">{label}</p>
        <p className="font-latin text-base font-black text-white">{value}</p>
      </div>
    </div>
  );
}

function Footer() {
  const settings = useContentStore((state) => state.content.settings);
  const navByLabel = new Map(navItems.map((item) => [item.label, item]));
  const rightColumn = ["من هو SDK", "السيارة", "الرعاة", "المعرض"];
  const leftColumn = ["الإنجازات", "الفريق", "الباقات", "تواصل"];

  return (
    <footer dir="ltr" className="border-t border-white/10 bg-black px-5 pt-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[auto_1fr_auto] lg:items-start">
          <div className="flex items-start justify-center gap-3 lg:justify-start">
            <a
              href={`mailto:${settings.email}`}
              aria-label="البريد"
              className="grid h-11 w-11 place-items-center rounded-xl border border-white/12 bg-white/[0.02] text-white/80 transition hover:border-white/25 hover:text-white"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a
              href={`tel:${settings.phone}`}
              aria-label="الهاتف"
              className="grid h-11 w-11 place-items-center rounded-xl border border-white/12 bg-white/[0.02] text-white/80 transition hover:border-white/25 hover:text-white"
            >
              <Phone className="h-5 w-5" />
            </a>
            <a
              href={`https://instagram.com/${settings.instagramPersonal.replace("@", "")}`}
              target="_blank"
              rel="noreferrer"
              aria-label="إنستغرام"
              className="grid h-11 w-11 place-items-center rounded-xl border border-white/12 bg-white/[0.02] text-white/80 transition hover:border-white/25 hover:text-white"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>

          <div dir="rtl" className="mx-auto grid w-full max-w-xl grid-cols-2 gap-x-10 gap-y-3 text-center sm:gap-x-16">
            <div className="grid content-start gap-4">
              {rightColumn.map((label) => {
                const item = navByLabel.get(label);
                if (!item) return null;
                return (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    className={({ isActive }) =>
                      `font-arabic text-base font-bold transition ${isActive ? "text-accent-red-bright" : "text-white/80 hover:text-white"}`
                    }
                  >
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
            <div className="grid content-start gap-4">
              {leftColumn.map((label) => {
                const item = navByLabel.get(label);
                if (!item) return null;
                return (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    className={({ isActive }) =>
                      `font-arabic text-base font-bold transition ${isActive ? "text-accent-red-bright" : "text-white/80 hover:text-white"}`
                    }
                  >
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </div>

          <div className="text-center lg:text-right">
            <Link
              to="/"
              aria-label="Diki Garage"
              className="inline-flex justify-center lg:justify-end"
            >
              <BrandLogo className="h-20 w-auto" />
            </Link>
            <p dir="rtl" className="mt-3 font-arabic text-sm font-semibold text-white/55">
              رياضة محركات عراقية — {settings.location}.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 py-6">
          <p dir="rtl" className="text-center font-arabic text-sm font-semibold text-white/45">
            {settings.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}

function SectionHeading({ label, title, center = false }) {
  return (
    <div className={`reveal-child ${center ? "text-center" : "text-right"}`}>
      <p className="font-display text-3xl tracking-[0.34em] text-accent-red-bright drop-shadow-[0_0_14px_rgba(255,0,0,0.68)]">{label}</p>
      <h2 className="mt-4 font-arabic text-[clamp(2.5rem,7vw,6rem)] font-black leading-tight text-white">{title}</h2>
      <span className={`red-underline mt-6 block h-1.5 w-48 bg-accent-red-bright ${center ? "mx-auto" : ""}`} />
    </div>
  );
}

function CounterCard({ icon: Icon, value, suffix, label }) {
  const { ref, count } = useCountUp(value);

  return (
    <div ref={ref} className="stat-card group rounded-2xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-accent-red hover:shadow-neon">
      <Icon className="h-9 w-9 text-accent-red-bright transition group-hover:scale-110" />
      <p className="mt-7 font-display text-6xl leading-none text-white">{count}{suffix}</p>
      <p className="mt-3 font-arabic text-lg font-bold text-text-muted">{label}</p>
    </div>
  );
}

function TimelineSmoke() {
  return (
    <div className="timeline-smoke pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 10 }).map((_, index) => (
        <span key={index} style={{ "--i": index }} />
      ))}
    </div>
  );
}

function RpmGauge() {
  return (
    <div className="rpm-wrap relative mx-auto grid aspect-square w-full max-w-[430px] place-items-center">
      <svg className="rpm-gauge h-full w-full" viewBox="0 0 220 220" aria-hidden="true">
        <circle cx="110" cy="110" r="88" />
        <path d="M42 142 A78 78 0 1 1 178 142" />
        <path className="rpm-redline" d="M42 142 A78 78 0 1 1 178 142" />
        {Array.from({ length: 11 }).map((_, index) => {
          const angle = -130 + index * 26;
          return <line key={index} x1="110" y1="26" x2="110" y2="40" transform={`rotate(${angle} 110 110)`} />;
        })}
      </svg>
      <div className="absolute text-center">
        <p className="font-display text-7xl leading-none text-white">8.5K</p>
        <p className="font-latin text-xs font-black uppercase tracking-[0.32em] text-accent-red-bright">RPM</p>
      </div>
      <span className="rpm-needle absolute bottom-1/2 h-[38%] w-1 origin-bottom bg-accent-red-bright shadow-[0_0_18px_rgba(255,0,0,0.9)]" />
    </div>
  );
}

function Navbar({ scrolled, menuOpen, setMenuOpen }) {
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-6"}`}>
      <nav className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 px-4 py-3 transition-all duration-500 ${scrolled ? "bg-black/70 shadow-neon backdrop-blur-xl" : "bg-black/30 backdrop-blur-md"}`}>
        <Link to="/" className="flex items-center gap-3" aria-label="SDK">
          <BrandLogo className="h-12 w-auto" />
          <span className="hidden font-latin text-xs font-bold uppercase tracking-[0.26em] text-white/55 sm:block">Motorsport</span>
        </Link>
        <div className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? "nav-link--active" : ""} font-arabic text-sm font-bold text-white/78 transition hover:text-white`}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="grid h-12 w-12 place-items-center rounded-xl border border-white/15 text-white transition hover:border-accent-red hover:text-accent-red-bright hover:shadow-neon lg:hidden"
          aria-label="فتح القائمة"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </nav>
    </header>
  );
}

function MobileMenu({ open, setOpen }) {
  return (
    <motion.div
      initial={false}
      animate={open ? { opacity: 1, pointerEvents: "auto" } : { opacity: 0, pointerEvents: "none" }}
      className="fixed inset-0 z-40 bg-black/95 pt-28 backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto flex h-full max-w-sm flex-col items-stretch px-8">
        {navItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={false}
            animate={open ? { x: 0, opacity: 1 } : { x: -36, opacity: 0 }}
            transition={{ delay: open ? index * 0.055 : 0 }}
            className="border-b border-white/10"
          >
            <NavLink
              to={item.to}
              onClick={() => setOpen(false)}
              className="block py-5 text-right font-arabic text-3xl font-black text-white"
            >
              {item.label}
            </NavLink>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function Counter({ icon: Icon, value, suffix }) {
  const { ref, count } = useCountUp(value, "-80px", 1.8);

  return (
    <div ref={ref} className="flex items-center justify-center gap-3 px-3 py-5 font-arabic">
      <Icon className="h-6 w-6 text-accent-red-bright drop-shadow-[0_0_12px_rgba(255,0,0,0.75)]" />
      <span className="text-lg font-black sm:text-2xl">{count}{suffix}</span>
    </div>
  );
}

function Ticker() {
  const text = "SDK  /  600 حصان  /  IRAQI DRIFT  /  SDK TEAM  /  50+ فعالية  /  REDLINE PARTNERS  /  ";
  return (
    <div className="overflow-hidden border-y border-white/10 bg-accent-red py-3 text-black">
      <div className="ticker-track whitespace-nowrap font-display text-4xl leading-none tracking-[0.12em]">
        <span>{text.repeat(4)}</span>
      </div>
    </div>
  );
}

function Particles() {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden opacity-70 mix-blend-screen">
      {Array.from({ length: 42 }).map((_, index) => (
        <span
          key={index}
          className="ember"
          style={{
            "--x": `${(index * 37) % 100}%`,
            "--delay": `${(index % 9) * -0.7}s`,
            "--duration": `${5 + (index % 7)}s`,
            "--size": `${2 + (index % 4)}px`,
          }}
        />
      ))}
    </div>
  );
}

function SmokeOverlay() {
  return (
    <svg className="absolute inset-x-0 bottom-0 h-[58vh] w-full" viewBox="0 0 1440 520" preserveAspectRatio="none" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <circle key={item} className="smoke-puff" cx={120 + item * 240} cy={360 - (item % 2) * 56} r={150 + item * 10} />
      ))}
    </svg>
  );
}

function TrackLines() {
  return (
    <svg className="track-lines absolute inset-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
      <path d="M-120 870 L420 -80" />
      <path d="M60 930 L650 -70" />
      <path d="M980 980 L1540 -20" />
    </svg>
  );
}

function CircuitLines() {
  return (
    <svg className="circuit-lines pointer-events-none absolute inset-0 z-0 h-full w-full" viewBox="0 0 1440 760" preserveAspectRatio="none" aria-hidden="true">
      <path d="M70 132 H310 V250 H518 V174 H690 V346 H884 V258 H1184 V396 H1368" />
      <path d="M120 614 H346 V512 H596 V574 H760 V430 H1040 V506 H1288" />
      <path d="M24 392 H220 V326 H420 V428 H622 V320 H804 V382 H1010" />
      <circle cx="310" cy="132" r="8" />
      <circle cx="884" cy="258" r="8" />
      <circle cx="596" cy="574" r="8" />
      <circle cx="1040" cy="506" r="8" />
    </svg>
  );
}

function CustomCursor() {
  const cursorRef = useRef(null);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const updateEnabled = () => {
      const isCoarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
      const isSmall = window.innerWidth < 768;
      setEnabled(!(isCoarse || isSmall));
    };

    updateEnabled();
    window.addEventListener("resize", updateEnabled);
    return () => window.removeEventListener("resize", updateEnabled);
  }, []);

  useEffect(() => {
    if (!enabled) {
      if (cursorRef.current) cursorRef.current.classList.add("cursor--hidden");
      return;
    }

    const move = (event) => {
      if (!cursorRef.current) return;
      const x = event.clientX - 16;
      const y = event.clientY - 16;
      cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const interactiveSelector = "a, button, input, textarea, select, [role='button']";

    const over = (e) => {
      if (!cursorRef.current) return;
      if (e.target.closest && e.target.closest(interactiveSelector)) {
        cursorRef.current.classList.add("cursor--hover");
      }
    };
    const out = (e) => {
      if (!cursorRef.current) return;
      if (e.target.closest && e.target.closest(interactiveSelector)) {
        cursorRef.current.classList.remove("cursor--hover");
      }
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    window.addEventListener("pointerout", out);

    // ensure visible
    cursorRef.current?.classList.remove("cursor--hidden");

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerout", out);
    };
  }, [enabled]);

  return <div ref={cursorRef} className={`custom-cursor ${enabled ? "" : "cursor--hidden"}`} />;
}

export default App;
