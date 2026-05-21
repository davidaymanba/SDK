import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Bell,
  Camera,
  Car,
  Check,
  ChevronDown,
  ChevronsUpDown,
  Download,
  Eye,
  GalleryHorizontalEnd,
  Gauge,
  Handshake,
  Home,
  ImagePlus,
  Inbox,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Menu,
  Plus,
  Save,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Trash2,
  Trophy,
  Upload,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";

import { deleteById, moveItem, moveItemById, updateById, upsertById } from "./crudHelpers";
import { uid, useContentStore } from "./contentStore";
import { loginAdmin, uploadImage } from "./api";
import sdkLogo from "./assets/images/sdk-2.png";

const schema = z.object({ required: z.string().min(1) });
const chartColors = ["#CC0000", "#FF0000", "#22c55e", "#f59e0b", "#888888"];
const nav = [
  { to: "/admin", end: true, icon: LayoutDashboard, label: "الرئيسية", en: "Overview" },
  { to: "/admin/identity", icon: ShieldCheck, label: "هوية SDK", en: "Identity & Bio" },
  { to: "/admin/timeline", icon: Trophy, label: "الإنجازات", en: "Career Timeline" },
  { to: "/admin/machine", icon: Car, label: "السيارة", en: "The Machine" },
  { to: "/admin/garage", icon: Wrench, label: "الفريق والكراج", en: "Team & Garage" },
  { to: "/admin/gallery", icon: GalleryHorizontalEnd, label: "المعرض", en: "Gallery" },
  { to: "/admin/audience", icon: Users, label: "الجمهور والإحصائيات", en: "Audience Stats" },
  { to: "/admin/social", icon: Share2, label: "الـ Social Media", en: "Followers & Reach" },
  { to: "/admin/packages", icon: Camera, label: "باقات الرعاية", en: "Packages" },
  { to: "/admin/sponsors", icon: Handshake, label: "الرعاة", en: "Sponsors" },
  { to: "/admin/contacts", icon: Inbox, label: "طلبات التواصل", en: "Contact Requests" },
  { to: "/admin/settings", icon: Settings, label: "الإعدادات", en: "Settings" },
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("en-US");
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = (type, message) => {
    const id = uid("toast");
    setToasts((items) => [...items, { id, type, message }]);
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 2600);
  };
  const node = (
    <div className="fixed left-4 top-4 z-[100] grid gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: -30, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.96 }}
            className={`rounded-lg border px-4 py-3 text-sm font-black shadow-2xl ${
              toast.type === "success"
                ? "border-green-500/40 bg-green-500/15 text-green-200"
                : toast.type === "warning"
                  ? "border-yellow-500/40 bg-yellow-500/15 text-yellow-200"
                  : toast.type === "info"
                    ? "border-blue-500/40 bg-blue-500/15 text-blue-200"
                    : "border-red-500/40 bg-red-500/15 text-red-200"
            }`}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
  return { push, node };
}

export default function AdminDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [authenticated, setAuthenticated] = useState(() => Boolean(useContentStore.getState().authToken));
  const dirty = useContentStore((state) => state.dirty);
  const save = useContentStore((state) => state.save);
  const setAuth = useContentStore((state) => state.setAuth);
  const clearAuth = useContentStore((state) => state.clearAuth);
  const loadContent = useContentStore((state) => state.loadContent);
  const { push, node } = useToast();

  const handleSave = () => {
    push("info", "ℹ️ جاري التحديث...");
    window.setTimeout(() => {
      save();
      push("success", "✅ تم الحفظ بنجاح");
    }, 450);
  };

  const handleLogin = async ({ email, password }) => {
    try {
      const session = await loginAdmin({ email: email.trim().toLowerCase(), password });
      setAuth(session);
      setAuthenticated(true);
      await loadContent();
      push("success", "تم تسجيل الدخول بنجاح");
      return true;
    } catch {
      push("error", "بيانات الدخول غير صحيحة");
      return false;
    }
  };

  const handleLogout = () => {
    clearAuth();
    setAuthenticated(false);
    push("info", "تم تسجيل الخروج");
  };

  if (!authenticated) {
    return (
      <div dir="rtl" className="admin-dashboard min-h-screen bg-[#0d0d0d] text-white">
        {node}
        <AdminLogin onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div dir="rtl" className="admin-dashboard min-h-screen bg-[#0d0d0d] text-white">
      {node}
      <aside className={`fixed inset-y-0 right-0 z-50 hidden border-l border-[#2a2a2a] bg-[#111] transition-all duration-300 md:block ${collapsed ? "w-20" : "w-[260px]"}`}>
        <div className="flex h-20 items-center justify-between border-b border-[#2a2a2a] px-5">
          <Link to="/admin" className="overflow-hidden whitespace-nowrap" aria-label="Diki Garage admin">
            <img src={sdkLogo} alt="Diki Garage" className="h-11 w-auto object-contain" />
          </Link>
          <button type="button" onClick={() => setCollapsed(!collapsed)} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-white/70">
            <Menu className="h-4 w-4" />
          </button>
        </div>
        <nav className="grid gap-1 p-3">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={item.label}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg border px-3 py-3 transition ${
                  isActive ? "border-[#CC0000] bg-[#CC0000]/18 text-white shadow-neon" : "border-transparent text-white/62 hover:border-white/10 hover:bg-white/[0.035]"
                }`
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && (
                <span className="min-w-0">
                  <span className="block truncate text-sm font-black">{item.label}</span>
                  <span className="block truncate text-[10px] uppercase text-white/35">{item.en}</span>
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className={`transition-all duration-300 ${collapsed ? "md:mr-20" : "md:mr-[260px]"}`}>
        <header className="sticky top-0 z-40 flex h-20 items-center gap-4 border-b border-[#2a2a2a] bg-[#0d0d0d]/92 px-4 backdrop-blur-xl lg:px-7">
          <div className="relative max-w-xl flex-1">
            <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888]" />
            <input className="h-12 rounded-lg border-[#2a2a2a] bg-[#1e1e1e] pr-11" placeholder="بحث في لوحة التحكم..." />
          </div>
          {dirty && <span className="h-3 w-3 rounded-full bg-[#f59e0b] shadow-[0_0_18px_rgba(245,158,11,0.8)]" title="تغييرات غير محفوظة" />}
          <button type="button" onClick={handleSave} className="inline-flex h-12 items-center gap-2 rounded-lg bg-[#CC0000] px-4 font-black transition hover:bg-[#FF0000]">
            <Save className="h-4 w-4" />
            حفظ
          </button>
          <Link to="/" target="_blank" className="hidden h-12 items-center gap-2 rounded-lg border border-white/10 px-4 font-black text-white/75 hover:border-[#CC0000] sm:inline-flex">
            <Eye className="h-4 w-4" />
            معاينة الموقع
          </Link>
          <button type="button" className="grid h-12 w-12 place-items-center rounded-lg border border-white/10 text-white/75">
            <Bell className="h-5 w-5" />
          </button>
          <button type="button" onClick={handleLogout} className="grid h-12 w-12 place-items-center rounded-lg border border-white/10 text-white/75 transition hover:border-[#CC0000] hover:text-white" aria-label="تسجيل الخروج">
            <LogOut className="h-5 w-5" />
          </button>
          <div className="hidden items-center gap-3 lg:flex">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-black/40">
              <img src={sdkLogo} alt="" className="h-9 w-auto object-contain" />
            </span>
            <span>
              <span className="block text-sm font-black">Admin</span>
              <span className="block text-xs text-[#888]">Content manager</span>
            </span>
          </div>
        </header>
        <main className="min-h-[calc(100vh-80px)] overflow-x-hidden p-4 pb-24 lg:p-7">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <Routes>
              <Route path="/admin" element={<Overview push={push} />} />
              <Route path="/admin/identity" element={<IdentityPage push={push} />} />
              <Route path="/admin/timeline" element={<TimelinePage push={push} />} />
              <Route path="/admin/machine" element={<MachinePage push={push} />} />
              <Route path="/admin/garage" element={<GaragePage push={push} />} />
              <Route path="/admin/gallery" element={<GalleryPage push={push} />} />
              <Route path="/admin/audience" element={<AudiencePage push={push} />} />
              <Route path="/admin/social" element={<SocialPage push={push} />} />
              <Route path="/admin/packages" element={<PackagesPage push={push} />} />
              <Route path="/admin/sponsors" element={<SponsorsPageAdmin push={push} />} />
              <Route path="/admin/contacts" element={<ContactsPage push={push} />} />
              <Route path="/admin/settings" element={<SettingsPage push={push} />} />
              <Route path="/admin/*" element={<Overview push={push} />} />
            </Routes>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    const ok = await onLogin({ email, password });
    if (!ok) setSubmitting(false);
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-5 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(204,0,0,0.22),transparent_34%),linear-gradient(180deg,#0a0a0a,#151515,#090909)]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,.03)_1px,transparent_1px)] [background-size:64px_64px]" />
      <form onSubmit={submit} className="relative w-full max-w-md rounded-lg border border-[#2a2a2a] bg-[#111]/95 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <img src={sdkLogo} alt="Diki Garage" className="mx-auto h-24 w-auto object-contain" />
        <div className="mt-6 text-center">
          <p className="font-display text-sm uppercase tracking-[0.3em] text-[#FF0000]">Admin Login</p>
          <h1 className="mt-2 text-3xl font-black">تسجيل دخول الداشبورد</h1>
          <p className="mt-2 text-sm text-[#888]">ادخلي بيانات الإدارة للوصول للوحة التحكم.</p>
        </div>
        <div className="mt-7 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-black">البريد الإلكتروني</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="username" placeholder="admin@dkmotorsport.iq" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-black">كلمة المرور</span>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" placeholder="••••••" />
          </label>
        </div>
        <button type="submit" disabled={submitting} className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#CC0000] px-4 font-black transition hover:bg-[#FF0000] disabled:opacity-60">
          <LockKeyhole className="h-4 w-4" />
          دخول
        </button>
      </form>
    </main>
  );
}

function PageTitle({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="font-display text-sm uppercase tracking-[0.3em] text-[#FF0000]">SDK ADMIN</p>
        <h1 className="mt-2 text-3xl font-black lg:text-5xl">{title}</h1>
        <p className="mt-2 text-sm text-[#888]">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border border-[#2a2a2a] bg-[#161616] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] ${className}`}
    >
      {children}
    </motion.section>
  );
}

function Field({ label, en, children }) {
  return (
    <label className="grid gap-2">
      <span>
        <span className="block text-sm font-black text-white">{label}</span>
        {en && <span className="block text-xs text-[#888]">{en}</span>}
      </span>
      {children}
    </label>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 rounded-full border transition ${checked ? "border-[#CC0000] bg-[#CC0000]" : "border-[#2a2a2a] bg-[#1e1e1e]"}`}
    >
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${checked ? "right-6" : "right-1"}`} />
    </button>
  );
}

function DropzoneBox({ label = "اسحب الصور هنا أو اضغط للرفع", multiple = false, onImages }) {
  const token = useContentStore((state) => state.authToken);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple,
    accept: { "image/*": [] },
    onDrop: async (files) => {
      const uploaded = await Promise.all(Array.from(files || []).map(async (file) => {
        const result = await uploadImage(file, token);
        return { image: result.url, name: result.originalName || file.name };
      }));
      if (!uploaded.length) return;
      onImages(multiple ? uploaded : uploaded[0]);
    },
  });
  return (
    <div
      {...getRootProps()}
      className={`grid min-h-36 cursor-pointer place-items-center rounded-lg border border-dashed p-5 text-center transition ${
        isDragActive ? "border-[#FF0000] bg-[#CC0000]/15 shadow-neon" : "border-[#2a2a2a] bg-[#1e1e1e]"
      }`}
    >
      <input {...getInputProps()} />
      <div>
        <Upload className="mx-auto mb-3 h-7 w-7 text-[#FF0000]" />
        <p className="font-black">{label}</p>
        <p className="mt-1 text-xs text-[#888]">Preview يظهر مباشرة ويتم حفظه في قاعدة البيانات</p>
      </div>
    </div>
  );
}

function RowActions({ onDelete, onUp, onDown, visible, onVisible }) {
  return (
    <div className="flex items-center gap-2">
      {onUp && <button type="button" onClick={onUp} className="rounded border border-white/10 p-2 text-white/70"><ChevronDown className="h-4 w-4 rotate-180" /></button>}
      {onDown && <button type="button" onClick={onDown} className="rounded border border-white/10 p-2 text-white/70"><ChevronDown className="h-4 w-4" /></button>}
      {typeof visible === "boolean" && <Toggle checked={visible} onChange={onVisible} />}
      {onDelete && <button type="button" onClick={onDelete} className="rounded border border-red-500/30 p-2 text-red-300"><Trash2 className="h-4 w-4" /></button>}
    </div>
  );
}

function Overview({ push }) {
  const content = useContentStore((state) => state.content);
  const navigate = useNavigate();
  const personal = content.audience.stats[0]?.value || 0;
  const garage = content.audience.stats[1]?.value || 0;
  const kpis = [
    ["إجمالي زوار الموقع", content.analytics.visits, Home],
    ["طلبات رعاية جديدة", content.contacts.filter((item) => item.status === "جديد").length, Inbox],
    ["متابعو الحساب الشخصي", personal, Users],
    ["متابعو صفحة الكراج", garage, Wrench],
    ["إجمالي المشاهدات", content.analytics.totalViews, Gauge],
    ["سيارات صيانة هذا الشهر", content.garage.stats.monthlyCars, Car],
  ];
  const quick = [
    ["+ إضافة إنجاز", "/admin/timeline"],
    ["+ رفع صورة", "/admin/gallery"],
    ["+ تحديث إحصائية", "/admin/audience"],
    ["+ إضافة راعي", "/admin/sponsors"],
  ];
  return (
    <>
      <PageTitle title="الرئيسية" subtitle="نظرة تشغيلية على محتوى الموقع، الطلبات، الجمهور، والرعاة." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map(([label, value, Icon], index) => <Kpi key={label} label={label} value={value} icon={Icon} delay={index * 0.04} />)}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="mb-5 text-xl font-black">زيارات الموقع - آخر 30 يوم</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={content.analytics.visits30}>
                <CartesianGrid stroke="#2a2a2a" />
                <XAxis dataKey="day" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ background: "#161616", border: "1px solid #2a2a2a" }} />
                <Area type="monotone" dataKey="visits" stroke="#FF0000" fill="#CC0000" fillOpacity={0.28} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h2 className="mb-5 text-xl font-black">توزيع الجمهور حسب المنصة</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={content.audience.platformSplit} dataKey="value" nameKey="platform" innerRadius={70} outerRadius={110} paddingAngle={4}>
                  {content.audience.platformSplit.map((_, index) => <Cell key={index} fill={chartColors[index % chartColors.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#161616", border: "1px solid #2a2a2a" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <h2 className="mb-4 text-xl font-black">آخر طلبات التواصل</h2>
          <DataTable
            rows={content.contacts.slice(0, 5)}
            columns={[
              ["name", "الاسم"],
              ["company", "الشركة"],
              ["type", "نوع الرعاية"],
              ["status", "الحالة", (value) => <StatusBadge status={value} />],
            ]}
          />
        </Card>
        <Card>
          <h2 className="mb-4 text-xl font-black">آخر تحديثات المحتوى</h2>
          <div className="grid gap-3">
            {content.analytics.activity.map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-black/25 p-3 text-sm text-white/75">{item}</div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {quick.map(([label, to]) => (
              <button key={label} type="button" onClick={() => { push("info", "ℹ️ جاري التحديث..."); navigate(to); }} className="rounded-lg bg-[#CC0000] px-3 py-3 text-sm font-black hover:bg-[#FF0000]">{label}</button>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function Kpi({ label, value, icon: Icon, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="rounded-lg border border-[#2a2a2a] bg-[#161616] p-5">
      <Icon className="h-7 w-7 text-[#FF0000]" />
      <CountUp value={value} />
      <p className="mt-2 text-sm font-bold text-[#888]">{label}</p>
    </motion.div>
  );
}

function CountUp({ value }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let frame = 0;
    let active = true;
    const total = 38;
    const tick = () => {
      if (!active) return;
      frame += 1;
      setCount(Math.round((Number(value || 0) * frame) / total));
      if (frame < total) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => {
      active = false;
    };
  }, [value]);
  return <p className="mt-5 font-display text-4xl font-black">{formatNumber(count)}</p>;
}

function IdentityPage({ push }) {
  const identity = useContentStore((state) => state.content.identity);
  const updateSection = useContentStore((state) => state.updateSection);
  const { register, handleSubmit } = useForm({ defaultValues: { required: identity.fullName }, resolver: zodResolver(schema) });
  const set = (patch) => updateSection("identity", (value) => ({ ...value, ...patch }));
  const updateHighlight = (id, patch) => set({ highlights: identity.highlights.map((item) => (item.id === id ? { ...item, ...patch } : item)) });
  return (
    <>
      <PageTitle title="هوية SDK" subtitle="يدير قسم من هو SDK، القصة، الصور، ونقاط الهوية." />
      <form onSubmit={handleSubmit(() => push("success", "✅ تم الحفظ بنجاح"))} className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-6">
          <Card>
            <h2 className="mb-5 text-xl font-black">البيانات الأساسية</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="الاسم الكامل" en="Full name"><input {...register("required")} value={identity.fullName} onChange={(e) => set({ fullName: e.target.value })} /></Field>
              <Field label="اللقب / الكنية" en="Nickname"><input value={identity.nickname} onChange={(e) => set({ nickname: e.target.value })} /></Field>
              <Field label="المسمى الوظيفي" en="Role"><input value={identity.role} onChange={(e) => set({ role: e.target.value })} /></Field>
              <Field label="سنة البداية" en="Start year"><input type="number" value={identity.startYear} onChange={(e) => set({ startYear: Number(e.target.value) })} /></Field>
              <Field label="الوصف المختصر" en="Arabic"><textarea rows="4" value={identity.shortAr} onChange={(e) => set({ shortAr: e.target.value })} /></Field>
              <Field label="Short description" en="English"><textarea rows="4" dir="ltr" value={identity.shortEn} onChange={(e) => set({ shortEn: e.target.value })} /></Field>
            </div>
          </Card>
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black">نقاط الهوية</h2>
              <button type="button" onClick={() => set({ highlights: [...identity.highlights, { id: uid("hi"), icon: "🏁", ar: "", en: "" }] })} className="inline-flex items-center gap-2 rounded-lg bg-[#CC0000] px-3 py-2 text-sm font-black"><Plus className="h-4 w-4" /> إضافة</button>
            </div>
            <div className="grid gap-3">
              {identity.highlights.map((item, index) => (
                <div key={item.id} className="grid gap-3 rounded-lg border border-white/10 bg-black/25 p-3 md:grid-cols-[80px_1fr_1fr_auto]">
                  <input value={item.icon} onChange={(e) => updateHighlight(item.id, { icon: e.target.value })} />
                  <input value={item.ar} onChange={(e) => updateHighlight(item.id, { ar: e.target.value })} placeholder="Arabic text" />
                  <input dir="ltr" value={item.en} onChange={(e) => updateHighlight(item.id, { en: e.target.value })} placeholder="English text" />
                  <RowActions
                    onUp={index > 0 ? () => set({ highlights: moveItem(identity.highlights, index, index - 1) }) : null}
                    onDown={index < identity.highlights.length - 1 ? () => set({ highlights: moveItem(identity.highlights, index, index + 1) }) : null}
                    onDelete={() => window.confirm("حذف هذا العنصر؟") && set({ highlights: identity.highlights.filter((row) => row.id !== item.id) })}
                  />
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h2 className="mb-5 text-xl font-black">قصة SDK</h2>
            <div className="grid gap-4">
              <Field label="Timeline subtitle"><input value={identity.storySubtitle} onChange={(e) => set({ storySubtitle: e.target.value })} /></Field>
              <Field label="Arabic content"><textarea rows="7" value={identity.storyAr} onChange={(e) => set({ storyAr: e.target.value })} /></Field>
              <Field label="English content"><textarea rows="7" dir="ltr" value={identity.storyEn} onChange={(e) => set({ storyEn: e.target.value })} /></Field>
            </div>
          </Card>
        </div>
        <div className="grid content-start gap-6">
          <Card>
            <h2 className="mb-4 text-xl font-black">معاينة مباشرة</h2>
            <div className="text-center">
              <img src={identity.profileImage} alt="" className="mx-auto h-36 w-36 rounded-full border-4 border-[#CC0000] object-cover" />
              <h3 className="mt-4 text-2xl font-black">{identity.fullName}</h3>
              <p className="text-[#FF0000]">{identity.nickname}</p>
              <p className="mt-3 text-sm leading-7 text-white/65">{identity.shortAr}</p>
            </div>
          </Card>
          <Card>
            <h2 className="mb-4 text-xl font-black">صورة البروفايل</h2>
            <DropzoneBox onImages={(file) => set({ profileImage: file.image })} />
          </Card>
          <Card>
            <h2 className="mb-4 text-xl font-black">صورة الـ Action Shot</h2>
            <img src={identity.actionImage} alt="" className="mb-3 aspect-video w-full rounded-lg object-cover" />
            <DropzoneBox onImages={(file) => set({ actionImage: file.image })} />
          </Card>
          <button type="submit" className="rounded-lg bg-[#CC0000] py-4 font-black hover:bg-[#FF0000]">حفظ التغييرات</button>
        </div>
      </form>
    </>
  );
}

function TimelinePage({ push }) {
  const timeline = useContentStore((state) => state.content.timeline);
  const updateSection = useContentStore((state) => state.updateSection);
  const [editing, setEditing] = useState(null);
  const saveItem = (item) => {
    const images = Array.from(new Set([...(item.images || []), item.image].filter(Boolean)));
    updateSection("timeline", (list) => upsertById(list, { ...item, image: images[0] || "", images, visible: item.visible ?? true }, () => uid("ach")));
    setEditing(null);
    push("success", "✅ تم الحفظ بنجاح");
  };
  const deleteItem = (item) => {
    if (!window.confirm("حذف الإنجاز؟")) return;
    updateSection("timeline", (list) => deleteById(list, item.id));
    push("success", "✅ تم الحذف بنجاح");
  };
  return (
    <>
      <PageTitle title="الإنجازات" subtitle="إدارة محطات المسيرة وترتيبها وظهورها في الخط الزمني." action={<button type="button" onClick={() => setEditing({ year: 2026, titleAr: "", titleEn: "", location: "", type: "🏆 مركز أول", description: "", image: "", images: [], visible: true })} className="inline-flex items-center gap-2 rounded-lg bg-[#CC0000] px-4 py-3 font-black"><Plus /> إضافة إنجاز جديد</button>} />
      <CrudList
        rows={timeline}
        columns={["السنة", "العنوان", "الموقع", "الترتيب", "الحالة"]}
        render={(item, index) => [item.year, item.titleAr, item.location, index + 1, <StatusBadge status={item.visible ? "مرئي" : "مخفي"} />]}
        onEdit={setEditing}
        onDelete={deleteItem}
        onMove={(item, direction) => updateSection("timeline", (list) => moveItemById(list, item.id, direction))}
        onToggle={(item) => updateSection("timeline", (list) => updateById(list, item.id, { visible: !item.visible }))}
      />
      <TimelinePreview items={timeline} />
      <ItemModal open={!!editing} title="إضافة / تعديل إنجاز" onClose={() => setEditing(null)}>
        {editing && <AchievementForm item={editing} onSave={saveItem} />}
      </ItemModal>
    </>
  );
}

function AchievementForm({ item, onSave }) {
  const initialImages = Array.from(new Set([...(item.images || []), item.image].filter(Boolean)));
  const [draft, setDraft] = useState({ ...clone(item), images: initialImages, image: initialImages[0] || "" });
  const setImages = (images) => setDraft({ ...draft, images, image: images[0] || "" });
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="السنة"><input type="number" value={draft.year} onChange={(e) => setDraft({ ...draft, year: Number(e.target.value) })} /></Field>
        <Field label="الموقع / الدولة"><input value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} /></Field>
        <Field label="عنوان الإنجاز — Arabic"><input value={draft.titleAr} onChange={(e) => setDraft({ ...draft, titleAr: e.target.value })} /></Field>
        <Field label="Title — English"><input dir="ltr" value={draft.titleEn} onChange={(e) => setDraft({ ...draft, titleEn: e.target.value })} /></Field>
        <Field label="نوع الإنجاز"><select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })}><option>🏆 مركز أول</option><option>🥈 مركز ثاني</option><option>🌍 تمثيل دولي</option><option>🔥 مشاركة مميزة</option></select></Field>
        <Field label="مرئي على الموقع"><Toggle checked={draft.visible} onChange={(visible) => setDraft({ ...draft, visible })} /></Field>
      </div>
      <Field label="وصف تفصيلي"><textarea rows="4" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field>
      <div className="grid gap-3">
        <p className="font-black">صور الحدث</p>
        <DropzoneBox multiple label="اسحب صور الإنجاز هنا أو اضغط للرفع" onImages={(files) => setImages([...draft.images, ...files.map((file) => file.image)])} />
        {draft.images.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {draft.images.map((image, index) => (
              <div key={`${image}-${index}`} className="rounded-lg border border-white/10 bg-black/25 p-3">
                <img src={image} alt="" className="aspect-video w-full rounded object-cover" />
                <p className="mt-2 text-xs text-[#888]">{index === 0 ? "الصورة الأساسية" : `صورة ${index + 1}`}</p>
                <RowActions
                  onUp={index > 0 ? () => setImages(moveItem(draft.images, index, index - 1)) : null}
                  onDown={index < draft.images.length - 1 ? () => setImages(moveItem(draft.images, index, index + 1)) : null}
                  onDelete={() => window.confirm("حذف الصورة؟") && setImages(draft.images.filter((_, imageIndex) => imageIndex !== index))}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <button type="button" onClick={() => onSave(draft)} className="rounded-lg bg-[#CC0000] py-3 font-black">حفظ</button>
    </div>
  );
}

function MachinePage({ push }) {
  const machine = useContentStore((state) => state.content.machine);
  const updateSection = useContentStore((state) => state.updateSection);
  const set = (patch) => updateSection("machine", (value) => ({ ...value, ...patch }));
  const updateSpec = (id, patch) => set({ specs: updateById(machine.specs, id, patch) });
  return (
    <>
      <PageTitle title="السيارة" subtitle="إدارة THE MACHINE، المواصفات، الصور، والترتيب." />
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="اسم السيارة"><input value={machine.carName} onChange={(e) => set({ carName: e.target.value })} /></Field>
            <Field label="العنوان الرئيسي — English"><input dir="ltr" value={machine.headlineEn} onChange={(e) => set({ headlineEn: e.target.value })} /></Field>
            <Field label="العنوان الرئيسي — Arabic"><input value={machine.headlineAr} onChange={(e) => set({ headlineAr: e.target.value })} /></Field>
            <Field label="الوصف — English"><textarea dir="ltr" rows="4" value={machine.descriptionEn} onChange={(e) => set({ descriptionEn: e.target.value })} /></Field>
            <Field label="الوصف — Arabic"><textarea rows="4" value={machine.descriptionAr} onChange={(e) => set({ descriptionAr: e.target.value })} /></Field>
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 text-xl font-black">Preview</h2>
          <img src={machine.images[0]?.image} alt="" className="aspect-video rounded-lg object-cover" />
          <p className="mt-4 text-2xl font-black">{machine.carName}</p>
          <p className="text-[#888]">{machine.headlineAr}</p>
        </Card>
      </div>
      <EditableList
        title="Car Specs"
        items={machine.specs}
        add={() => set({ specs: [...machine.specs, { id: uid("spec"), icon: "⚡", ar: "", en: "" }] })}
        render={(item, index) => (
          <div className="grid gap-3 md:grid-cols-[80px_1fr_1fr_auto]">
            <input value={item.icon} onChange={(e) => updateSpec(item.id, { icon: e.target.value })} />
            <input value={item.ar} onChange={(e) => updateSpec(item.id, { ar: e.target.value })} />
            <input dir="ltr" value={item.en} onChange={(e) => updateSpec(item.id, { en: e.target.value })} />
            <RowActions onUp={index > 0 ? () => set({ specs: moveItemById(machine.specs, item.id, -1) }) : null} onDown={index < machine.specs.length - 1 ? () => set({ specs: moveItemById(machine.specs, item.id, 1) }) : null} onDelete={() => window.confirm("حذف المواصفة؟") && set({ specs: deleteById(machine.specs, item.id) })} />
          </div>
        )}
      />
      <ImageManager title="Car Images" images={machine.images} onChange={(images) => set({ images })} />
    </>
  );
}

function GaragePage() {
  const garage = useContentStore((state) => state.content.garage);
  const updateSection = useContentStore((state) => state.updateSection);
  const set = (patch) => updateSection("garage", (value) => ({ ...value, ...patch }));
  const updateService = (id, patch) => set({ services: updateById(garage.services, id, patch) });
  return (
    <>
      <PageTitle title="الفريق والكراج" subtitle="معلومات الفريق، الخدمات، عدادات الكراج، وصور الورشة." />
      <Card>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="اسم الفريق / الكراج"><input value={garage.name} onChange={(e) => set({ name: e.target.value })} /></Field>
          <Field label="شعار الكراج"><DropzoneBox onImages={(file) => set({ logo: file.image })} /></Field>
          <Field label="وصف الفريق — Arabic"><textarea rows="5" value={garage.descriptionAr} onChange={(e) => set({ descriptionAr: e.target.value })} /></Field>
          <Field label="Team description — English"><textarea rows="5" dir="ltr" value={garage.descriptionEn} onChange={(e) => set({ descriptionEn: e.target.value })} /></Field>
        </div>
      </Card>
      <EditableList
        title="الخدمات"
        items={garage.services}
        add={() => set({ services: [...garage.services, { id: uid("srv"), icon: "🔧", titleAr: "", titleEn: "", visible: true }] })}
        render={(item) => (
          <div className="grid gap-3 md:grid-cols-[80px_1fr_1fr_auto]">
            <input value={item.icon} onChange={(e) => updateService(item.id, { icon: e.target.value })} />
            <input value={item.titleAr} onChange={(e) => updateService(item.id, { titleAr: e.target.value })} />
            <input dir="ltr" value={item.titleEn} onChange={(e) => updateService(item.id, { titleEn: e.target.value })} />
            <RowActions visible={item.visible} onVisible={(visible) => updateService(item.id, { visible })} onDelete={() => window.confirm("حذف الخدمة؟") && set({ services: deleteById(garage.services, item.id) })} />
          </div>
        )}
      />
      <Card className="mt-6">
        <h2 className="mb-5 text-xl font-black">إحصائيات الكراج</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["monthlyCars", "عدد السيارات صيانة شهرياً"],
            ["yearsExperience", "سنوات الخبرة"],
            ["teamMembers", "عدد أفراد الفريق"],
            ["carsBuilt", "سيارات تم بناؤها"],
          ].map(([key, label]) => (
            <Field key={key} label={label}><input type="number" value={garage.stats[key]} onChange={(e) => set({ stats: { ...garage.stats, [key]: Number(e.target.value) } })} /></Field>
          ))}
        </div>
      </Card>
      <ImageManager title="صور الكراج" images={garage.images} categories={["داخل الكراج", "صيانة", "الفريق", "معدات"]} onChange={(images) => set({ images })} />
    </>
  );
}

function GalleryPage() {
  const gallery = useContentStore((state) => state.content.gallery);
  const updateSection = useContentStore((state) => state.updateSection);
  const [filter, setFilter] = useState("الكل");
  const categories = ["الكل", "السيارة", "الفعاليات", "الكراج", "المتسابق", "البطولات"];
  const visible = filter === "الكل" ? gallery : gallery.filter((item) => item.category === filter);
  const update = (id, patch) => updateSection("gallery", (list) => updateById(list, id, patch));
  return (
    <>
      <PageTitle title="المعرض" subtitle="رفع صور متعددة، تصنيفها، تمييزها، والتحكم بظهورها." />
      <Card>
        <DropzoneBox multiple onImages={(files) => updateSection("gallery", (list) => [...files.map((file) => ({ id: uid("gal"), category: "السيارة", image: file.image, captionAr: file.name, captionEn: file.name, date: new Date().toISOString().slice(0, 10), visible: true, featured: false })), ...list])} />
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#1e1e1e]"><span className="block h-full w-2/3 animate-pulse bg-[#CC0000]" /></div>
      </Card>
      <div className="my-5 flex flex-wrap gap-2">
        {categories.map((cat) => <button type="button" key={cat} onClick={() => setFilter(cat)} className={`rounded-lg px-4 py-2 text-sm font-black ${filter === cat ? "bg-[#CC0000]" : "border border-white/10 text-white/65"}`}>{cat}</button>)}
        <button type="button" onClick={() => exportCsv(gallery, "gallery.csv")} className="mr-auto inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-black"><Download className="h-4 w-4" /> Export</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((item) => (
          <Card key={item.id}>
            <img src={item.image} alt="" className="aspect-video w-full rounded-lg object-cover" />
            <div className="mt-4 grid gap-3">
              <select value={item.category} onChange={(e) => update(item.id, { category: e.target.value })}>{categories.filter((cat) => cat !== "الكل").map((cat) => <option key={cat}>{cat}</option>)}</select>
              <input value={item.captionAr} onChange={(e) => update(item.id, { captionAr: e.target.value })} />
              <input dir="ltr" value={item.captionEn} onChange={(e) => update(item.id, { captionEn: e.target.value })} />
              <input type="date" value={item.date} onChange={(e) => update(item.id, { date: e.target.value })} />
              <div className="flex items-center justify-between"><span>مرئي</span><Toggle checked={item.visible} onChange={(visible) => update(item.id, { visible })} /></div>
              <div className="flex items-center justify-between"><span>Featured</span><Toggle checked={item.featured} onChange={(featured) => update(item.id, { featured })} /></div>
              <button type="button" onClick={() => window.confirm("حذف الصورة؟") && updateSection("gallery", (list) => deleteById(list, item.id))} className="rounded-lg border border-red-500/30 py-2 text-red-300">حذف</button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

function AudiencePage() {
  const audience = useContentStore((state) => state.content.audience);
  const garage = useContentStore((state) => state.content.garage);
  const updateSection = useContentStore((state) => state.updateSection);
  const updateStat = (id, patch) => updateSection("audience", (value) => ({ ...value, stats: updateById(value.stats, id, patch) }));
  return (
    <>
      <PageTitle title="الجمهور والإحصائيات" subtitle="الأرقام الرئيسية، فئات الجمهور، وبيانات الرسم البياني." />
      <EditableList
        title="الأرقام الرئيسية"
        items={audience.stats}
        add={() => updateSection("audience", (value) => ({ ...value, stats: [...value.stats, { id: uid("aud"), icon: "📊", labelAr: "", labelEn: "", value: 0, suffix: "", visible: true }] }))}
        render={(item) => (
          <div className="grid gap-3 md:grid-cols-[80px_1fr_1fr_130px_auto]">
            <input value={item.icon} onChange={(e) => updateStat(item.id, { icon: e.target.value })} />
            <input value={item.labelAr} onChange={(e) => updateStat(item.id, { labelAr: e.target.value })} />
            <input dir="ltr" value={item.labelEn} onChange={(e) => updateStat(item.id, { labelEn: e.target.value })} />
            <input type="number" value={item.value} onChange={(e) => updateStat(item.id, { value: Number(e.target.value) })} />
            <RowActions visible={item.visible} onVisible={(visible) => updateStat(item.id, { visible })} onDelete={() => window.confirm("حذف الإحصائية؟") && updateSection("audience", (value) => ({ ...value, stats: deleteById(value.stats, item.id) }))} />
          </div>
        )}
      />
      <Card className="mt-6">
        <h2 className="mb-5 text-xl font-black">فئات الجمهور</h2>
        <TagEditor tags={audience.tags} onChange={(tags) => updateSection("audience", (value) => ({ ...value, tags }))} />
      </Card>
      <Card className="mt-6">
        <h2 className="mb-5 text-xl font-black">توزيع الجمهور</h2>
        <div className="grid gap-3 md:grid-cols-5">
          {audience.platformSplit.map((item, index) => (
            <Field key={item.platform} label={item.platform}><input type="number" value={item.value} onChange={(e) => updateSection("audience", (value) => ({ ...value, platformSplit: value.platformSplit.map((row, i) => (i === index ? { ...row, value: Number(e.target.value) } : row)) }))} /></Field>
          ))}
        </div>
      </Card>
      <Card className="mt-6">
        <h2 className="mb-5 text-xl font-black">ربط الكراج</h2>
        <p className="text-[#888]">عدد السيارات الشهري في الموقع العام يقرأ أيضاً من إحصائيات الكراج الحالية: {garage.stats.monthlyCars}</p>
      </Card>
    </>
  );
}

function SocialPage({ push }) {
  const audience = useContentStore((state) => state.content.audience);
  const updateSection = useContentStore((state) => state.updateSection);
  const ig = audience.instagram;
  const setIg = (patch) => updateSection("audience", (value) => ({ ...value, instagram: { ...value.instagram, ...patch } }));
  return (
    <>
      <PageTitle title="الـ Social Media" subtitle="إعداد حسابات إنستغرام والأرقام اليدوية للمتابعين والوصول." />
      <Card>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Instagram username - personal"><input dir="ltr" value={ig.personal} onChange={(e) => setIg({ personal: e.target.value })} /></Field>
          <Field label="Instagram username - garage"><input dir="ltr" value={ig.garage} onChange={(e) => setIg({ garage: e.target.value })} /></Field>
          <Field label="Personal followers"><input type="number" value={ig.personalFollowers} onChange={(e) => setIg({ personalFollowers: Number(e.target.value) })} /></Field>
          <Field label="Garage followers"><input type="number" value={ig.garageFollowers} onChange={(e) => setIg({ garageFollowers: Number(e.target.value) })} /></Field>
        </div>
        <p className="mt-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-100">يتم التحديث يدوياً أو عبر Instagram Basic Display API</p>
        <button type="button" onClick={() => { setIg({ lastFetched: new Date().toISOString().slice(0, 10) }); push("success", "✅ تم تحديث الأرقام"); }} className="mt-4 rounded-lg bg-[#CC0000] px-5 py-3 font-black">تحديث الأرقام</button>
        <p className="mt-3 text-[#888]">آخر تحديث: {ig.lastFetched}</p>
      </Card>
    </>
  );
}

function PackagesPage() {
  const packages = useContentStore((state) => state.content.packages);
  const updateSection = useContentStore((state) => state.updateSection);
  const updatePkg = (id, patch) => updateSection("packages", (list) => updateById(list, id, patch));
  return (
    <>
      <PageTitle title="باقات الرعاية" subtitle="إدارة أسماء الباقات، الأسعار، المميزات، وظهور CTA." action={<button type="button" onClick={() => updateSection("packages", (list) => [{ id: uid("pkg"), nameAr: "باقة جديدة", nameEn: "NEW PACKAGE", description: "", price: "حسب الاتفاق", currency: "USD", featured: false, borderColor: "gray", ctaAr: "تواصل معنا", visible: true, features: [] }, ...list])} className="rounded-lg bg-[#CC0000] px-4 py-3 font-black">+ إضافة باقة</button>} />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-5">
          {packages.map((pack) => (
            <Card key={pack.id}>
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="اسم الباقة — Arabic"><input value={pack.nameAr} onChange={(e) => updatePkg(pack.id, { nameAr: e.target.value })} /></Field>
                <Field label="Name — English"><input dir="ltr" value={pack.nameEn} onChange={(e) => updatePkg(pack.id, { nameEn: e.target.value })} /></Field>
                <Field label="السعر"><input value={pack.price} onChange={(e) => updatePkg(pack.id, { price: e.target.value })} /></Field>
                <Field label="عملة"><select value={pack.currency} onChange={(e) => updatePkg(pack.id, { currency: e.target.value })}><option>USD</option><option>IQD</option><option>SAR</option></select></Field>
                <Field label="لون الإطار"><select value={pack.borderColor} onChange={(e) => updatePkg(pack.id, { borderColor: e.target.value })}><option value="gray">gray</option><option value="red">red</option><option value="gold">gold</option></select></Field>
                <Field label="CTA"><input value={pack.ctaAr} onChange={(e) => updatePkg(pack.id, { ctaAr: e.target.value })} /></Field>
              </div>
              <Field label="الوصف المختصر"><input value={pack.description} onChange={(e) => updatePkg(pack.id, { description: e.target.value })} /></Field>
              <div className="mt-4 flex gap-6"><span>مميز</span><Toggle checked={pack.featured} onChange={(featured) => updatePkg(pack.id, { featured })} /><span>Visible</span><Toggle checked={pack.visible} onChange={(visible) => updatePkg(pack.id, { visible })} /></div>
              <FeatureEditor pack={pack} updatePkg={updatePkg} />
              <button type="button" onClick={() => window.confirm("حذف الباقة؟") && updateSection("packages", (list) => deleteById(list, pack.id))} className="mt-4 rounded-lg border border-red-500/30 px-4 py-2 text-red-300">حذف الباقة</button>
            </Card>
          ))}
        </div>
        <Card className="sticky top-24 h-fit">
          <h2 className="mb-4 text-xl font-black">Live Preview</h2>
          {packages.filter((item) => item.visible).slice(0, 1).map((pack) => <PackagePreview key={pack.id} pack={pack} />)}
        </Card>
      </div>
    </>
  );
}

function SponsorsPageAdmin() {
  const sponsors = useContentStore((state) => state.content.sponsors);
  const updateSection = useContentStore((state) => state.updateSection);
  const empty = { id: "", name: "", logo: "", url: "", level: "Official", marquee: true, grid: true, startDate: new Date().toISOString().slice(0, 10), notes: "", visible: true };
  const [draft, setDraft] = useState(empty);
  const save = () => {
    updateSection("sponsors", (list) => upsertById(list, draft, () => uid("sp")));
    setDraft(empty);
  };
  return (
    <>
      <PageTitle title="الرعاة" subtitle="إضافة الرعاة، الشعارات، مستوى الرعاية، وترتيب الماركي." />
      <Card>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="اسم الراعي"><input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
          <Field label="رابط الموقع"><input dir="ltr" value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} /></Field>
          <Field label="مستوى الرعاية"><select value={draft.level} onChange={(e) => setDraft({ ...draft, level: e.target.value })}><option>Title</option><option>Official</option><option>Supporting</option></select></Field>
          <Field label="تاريخ بداية الشراكة"><input type="date" value={draft.startDate} onChange={(e) => setDraft({ ...draft, startDate: e.target.value })} /></Field>
          <Field label="شعار الراعي"><DropzoneBox onImages={(file) => setDraft({ ...draft, logo: file.image })} /></Field>
          <Field label="ملاحظات داخلية"><textarea value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} /></Field>
        </div>
        <div className="mt-4 flex gap-6"><span>Marquee</span><Toggle checked={draft.marquee} onChange={(marquee) => setDraft({ ...draft, marquee })} /><span>Grid</span><Toggle checked={draft.grid} onChange={(grid) => setDraft({ ...draft, grid })} /></div>
        <button type="button" onClick={save} className="mt-4 rounded-lg bg-[#CC0000] px-5 py-3 font-black">حفظ الراعي</button>
      </Card>
      <CrudList
        rows={sponsors}
        columns={["Logo", "Name", "Level", "Status"]}
        render={(item) => [item.logo ? <img src={item.logo} className="h-10 w-16 object-contain" /> : "DK", item.name, item.level, <StatusBadge status={item.visible ? "مرئي" : "مخفي"} />]}
        onEdit={setDraft}
        onDelete={(item) => window.confirm("حذف الراعي؟") && updateSection("sponsors", (list) => deleteById(list, item.id))}
        onToggle={(item) => updateSection("sponsors", (list) => updateById(list, item.id, { visible: !item.visible }))}
        onMove={(item, direction) => updateSection("sponsors", (list) => moveItemById(list, item.id, direction))}
      />
    </>
  );
}

function ContactsPage() {
  const contacts = useContentStore((state) => state.content.contacts);
  const updateSection = useContentStore((state) => state.updateSection);
  const [filter, setFilter] = useState("الكل");
  const [open, setOpen] = useState(null);
  const currentOpen = open ? contacts.find((item) => item.id === open.id) : null;
  const rows = filter === "الكل" ? contacts : contacts.filter((item) => item.status === filter);
  const stats = [["Total requests", contacts.length], ["New today", contacts.filter((i) => i.status === "جديد").length], ["Pending", contacts.filter((i) => i.status === "قيد المراجعة").length], ["Completed", contacts.filter((i) => i.status === "تم الرد").length]];
  return (
    <>
      <PageTitle title="طلبات التواصل" subtitle="Inbox لطلبات الرعاية القادمة من نموذج التواصل." action={<button type="button" onClick={() => exportCsv(contacts, "contact-requests.csv")} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-3 font-black"><Download /> Export CSV</button>} />
      <div className="mb-6 grid gap-4 md:grid-cols-4">{stats.map(([label, value]) => <Card key={label}><p className="text-3xl font-black">{value}</p><p className="text-sm text-[#888]">{label}</p></Card>)}</div>
      <div className="mb-4 flex flex-wrap gap-2">{["الكل", "جديد", "قيد المراجعة", "تم الرد", "مؤرشف"].map((status) => <button type="button" key={status} onClick={() => setFilter(status)} className={`rounded-lg px-4 py-2 text-sm font-black ${filter === status ? "bg-[#CC0000]" : "border border-white/10 text-white/65"}`}>{status}</button>)}</div>
      <Card>
        <DataTable
          rows={rows}
          columns={[
            ["name", "الاسم"],
            ["company", "الشركة"],
            ["email", "البريد"],
            ["type", "نوع الرعاية"],
            ["date", "التاريخ"],
            ["status", "الحالة", (value) => <StatusBadge status={value} />],
            ["id", "إجراءات", (_, row) => <button type="button" onClick={() => setOpen(row)} className="rounded bg-[#1e1e1e] px-3 py-1">فتح</button>],
          ]}
        />
      </Card>
      <ItemModal open={!!currentOpen} title="تفاصيل الطلب" onClose={() => setOpen(null)}>
        {currentOpen && (
          <div className="grid gap-4">
            <p className="text-2xl font-black">{currentOpen.name}</p>
            <p className="text-[#888]">{currentOpen.company} - {currentOpen.email}</p>
            <p className="rounded-lg bg-[#1e1e1e] p-4 leading-8">{currentOpen.message}</p>
            <div className="flex flex-wrap gap-2">
              {["قيد المراجعة", "تم الرد", "مؤرشف"].map((status) => <button type="button" key={status} onClick={() => updateSection("contacts", (list) => updateById(list, currentOpen.id, { status }))} className="rounded-lg bg-[#CC0000] px-4 py-2 font-black">{status}</button>)}
              <a href={`mailto:${currentOpen.email}`} className="rounded-lg border border-white/10 px-4 py-2 font-black">Reply</a>
              <button type="button" onClick={() => { if (!window.confirm("حذف الطلب؟")) return; updateSection("contacts", (list) => deleteById(list, currentOpen.id)); setOpen(null); }} className="rounded-lg border border-red-500/30 px-4 py-2 text-red-300">Delete</button>
            </div>
          </div>
        )}
      </ItemModal>
    </>
  );
}

function SettingsPage() {
  const settings = useContentStore((state) => state.content.settings);
  const updateSection = useContentStore((state) => state.updateSection);
  const set = (patch) => updateSection("settings", (value) => ({ ...value, ...patch }));
  return (
    <>
      <PageTitle title="الإعدادات" subtitle="معلومات التواصل، الهوية البصرية، Footer، وSEO." />
      <div className="grid gap-6">
        <Card><h2 className="mb-5 text-xl font-black">معلومات التواصل</h2><SettingsFields settings={settings} set={set} keys={[["phone", "رقم الهاتف"], ["email", "البريد الإلكتروني"], ["instagramPersonal", "حساب إنستغرام الشخصي"], ["instagramGarage", "حساب إنستغرام الكراج"], ["location", "الموقع / المدينة"], ["whatsapp", "WhatsApp number"]]} /></Card>
        <Card><h2 className="mb-5 text-xl font-black">الهوية البصرية</h2><div className="grid gap-4 md:grid-cols-5">{["siteLogo", "dkLogo", "garageLogo", "favicon"].map((key) => <Field key={key} label={key}><DropzoneBox onImages={(file) => set({ [key]: file.image })} /></Field>)}<Field label="اللون الأساسي"><input type="color" value={settings.accent} onChange={(e) => set({ accent: e.target.value })} /></Field></div></Card>
        <Card><h2 className="mb-5 text-xl font-black">نص الـ Footer</h2><SettingsFields settings={settings} set={set} keys={[["copyright", "نص حقوق النشر"], ["footerLine", "الجملة الختامية"]]} /></Card>
        <Card><h2 className="mb-5 text-xl font-black">SEO</h2><SettingsFields settings={settings} set={set} keys={[["seoTitle", "عنوان الصفحة الرئيسية"], ["metaDescription", "الوصف التعريفي"], ["keywords", "الكلمات المفتاحية"]]} /></Card>
      </div>
    </>
  );
}

function SettingsFields({ settings, set, keys }) {
  return <div className="grid gap-4 md:grid-cols-2">{keys.map(([key, label]) => <Field key={key} label={label}><input value={settings[key]} onChange={(e) => set({ [key]: e.target.value })} /></Field>)}</div>;
}

function EditableList({ title, items, add, render }) {
  return (
    <Card className="mt-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-black">{title}</h2>
        <button type="button" onClick={add} className="inline-flex items-center gap-2 rounded-lg bg-[#CC0000] px-3 py-2 text-sm font-black"><Plus className="h-4 w-4" /> إضافة</button>
      </div>
      <div className="grid gap-3">{items.map((item, index) => <div key={item.id} className="rounded-lg border border-white/10 bg-black/25 p-3">{render(item, index)}</div>)}</div>
    </Card>
  );
}

function ImageManager({ title, images, onChange, categories }) {
  const update = (id, patch) => onChange(images.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  return (
    <Card className="mt-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-black">{title}</h2>
        <ImagePlus className="text-[#FF0000]" />
      </div>
      <DropzoneBox multiple onImages={(files) => onChange([...images, ...files.map((file) => ({ id: uid("img"), image: file.image, caption: file.name, category: categories?.[0] || "" }))])} />
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {images.map((item, index) => (
          <div key={item.id} className="rounded-lg border border-white/10 bg-black/25 p-3">
            <img src={item.image} alt="" className="aspect-video w-full rounded object-cover" />
            <input className="mt-3" value={item.caption} onChange={(e) => update(item.id, { caption: e.target.value })} />
            {categories && <select className="mt-3" value={item.category} onChange={(e) => update(item.id, { category: e.target.value })}>{categories.map((cat) => <option key={cat}>{cat}</option>)}</select>}
            <RowActions onUp={index > 0 ? () => onChange(moveItem(images, index, index - 1)) : null} onDown={index < images.length - 1 ? () => onChange(moveItem(images, index, index + 1)) : null} onDelete={() => onChange(images.filter((row) => row.id !== item.id))} />
          </div>
        ))}
      </div>
    </Card>
  );
}

function CrudList({ rows, columns, render, onEdit, onDelete, onToggle, onMove }) {
  const [sort, setSort] = useState(0);
  const sorted = [...rows].sort((a, b) => String(render(a, 0)[sort] || "").localeCompare(String(render(b, 0)[sort] || "")));
  return (
    <Card className="mt-6 overflow-x-auto">
      <table className="w-full min-w-[760px] border-separate border-spacing-y-2 text-right">
        <thead><tr>{columns.map((col, index) => <th key={col} onClick={() => setSort(index)} className="cursor-pointer px-3 py-2 text-sm text-[#888]">{col} <ChevronsUpDown className="inline h-3 w-3" /></th>)}<th className="px-3 py-2 text-sm text-[#888]">إجراءات</th></tr></thead>
        <tbody>
          {sorted.length === 0 && <tr><td colSpan={columns.length + 1} className="rounded-lg bg-[#1e1e1e] p-8 text-center text-[#888]">لا توجد بيانات حالياً</td></tr>}
          {sorted.map((row, index) => (
            <tr key={row.id} className="group bg-[#1e1e1e] transition hover:shadow-[inset_-4px_0_0_#CC0000]">
              {render(row, index).map((cell, i) => <td key={i} className="px-3 py-3 text-sm">{cell}</td>)}
              <td className="px-3 py-3">
                <div className="flex gap-2">
                  <button type="button" onClick={() => onEdit?.(clone(row))} className="rounded border border-white/10 px-3 py-1">Edit</button>
                  {onToggle && <button type="button" onClick={() => onToggle(row)} className="rounded border border-white/10 px-3 py-1">Toggle</button>}
                  {onMove && rows.findIndex((item) => item.id === row.id) > 0 && <button type="button" onClick={() => onMove(row, -1)} className="rounded border border-white/10 px-3 py-1">↑</button>}
                  {onMove && rows.findIndex((item) => item.id === row.id) < rows.length - 1 && <button type="button" onClick={() => onMove(row, 1)} className="rounded border border-white/10 px-3 py-1">↓</button>}
                  {onDelete && <button type="button" onClick={() => onDelete(row)} className="rounded border border-red-500/30 px-3 py-1 text-red-300">Delete</button>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > 10 && <p className="mt-3 text-sm text-[#888]">Pagination: عرض 10+ سجلات مدعوم بصرياً عبر الجدول القابل للفرز.</p>}
    </Card>
  );
}

function DataTable({ rows, columns }) {
  const [sort, setSort] = useState(columns[0]?.[0]);
  const sorted = [...rows].sort((a, b) => String(a[sort] || "").localeCompare(String(b[sort] || "")));
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-right">
        <thead><tr>{columns.map(([key, label]) => <th key={key} onClick={() => setSort(key)} className="cursor-pointer border-b border-white/10 px-3 py-3 text-sm text-[#888]">{label}</th>)}</tr></thead>
        <tbody>{sorted.map((row) => <tr key={row.id} className="hover:bg-[#CC0000]/8">{columns.map(([key, , render]) => <td key={key} className="border-b border-white/5 px-3 py-3 text-sm">{render ? render(row[key], row) : row[key]}</td>)}</tr>)}</tbody>
      </table>
      {!rows.length && <div className="p-8 text-center text-[#888]">لا توجد بيانات حالياً</div>}
    </div>
  );
}

function StatusBadge({ status }) {
  const color = status === "جديد" ? "bg-red-500/15 text-red-200 border-red-500/30" : status === "قيد المراجعة" ? "bg-yellow-500/15 text-yellow-200 border-yellow-500/30" : status === "تم الرد" || status === "مرئي" ? "bg-green-500/15 text-green-200 border-green-500/30" : "bg-white/10 text-white/55 border-white/10";
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${color}`}>{status}</span>;
}

function ItemModal({ open, title, onClose, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] grid place-items-center bg-black/70 p-4 backdrop-blur-md">
          <motion.div initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 20 }} className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-[#2a2a2a] bg-[#161616] p-5">
            <div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-black">{title}</h2><button type="button" onClick={onClose} className="rounded border border-white/10 p-2"><X /></button></div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TimelinePreview({ items }) {
  return (
    <Card className="mt-6">
      <h2 className="mb-5 text-xl font-black">Preview panel</h2>
      <div className="grid gap-3 md:grid-cols-3">
        {items.filter((item) => item.visible).map((item) => <div key={item.id} className="rounded-lg border border-[#CC0000]/30 bg-black/25 p-4"><p className="text-3xl font-black text-[#FF0000]">{item.year}</p><p className="font-black">{item.titleAr}</p><p className="text-sm text-[#888]">{item.location}</p></div>)}
      </div>
    </Card>
  );
}

function TagEditor({ tags, onChange }) {
  const update = (id, patch) => onChange(tags.map((tag) => (tag.id === id ? { ...tag, ...patch } : tag)));
  return (
    <div className="grid gap-3">
      {tags.map((tag) => <div key={tag.id} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"><input value={tag.ar} onChange={(e) => update(tag.id, { ar: e.target.value })} /><input dir="ltr" value={tag.en} onChange={(e) => update(tag.id, { en: e.target.value })} /><RowActions onDelete={() => window.confirm("حذف التصنيف؟") && onChange(deleteById(tags, tag.id))} /></div>)}
      <button type="button" onClick={() => onChange([...tags, { id: uid("tag"), ar: "", en: "" }])} className="rounded-lg border border-white/10 py-3 font-black">إضافة Tag</button>
    </div>
  );
}

function FeatureEditor({ pack, updatePkg }) {
  const updateFeature = (id, patch) => updatePkg(pack.id, { features: pack.features.map((item) => (item.id === id ? { ...item, ...patch } : item)) });
  return (
    <div className="mt-5 grid gap-3">
      <p className="font-black">Features list</p>
      {pack.features.map((feature) => <div key={feature.id} className="grid gap-3 md:grid-cols-[80px_1fr_auto]"><input value={feature.icon} onChange={(e) => updateFeature(feature.id, { icon: e.target.value })} /><input value={feature.textAr} onChange={(e) => updateFeature(feature.id, { textAr: e.target.value })} /><RowActions visible={feature.visible} onVisible={(visible) => updateFeature(feature.id, { visible })} onDelete={() => window.confirm("حذف الميزة؟") && updatePkg(pack.id, { features: deleteById(pack.features, feature.id) })} /></div>)}
      <button type="button" onClick={() => updatePkg(pack.id, { features: [...pack.features, { id: uid("pf"), icon: "✓", textAr: "", visible: true }] })} className="rounded-lg border border-white/10 py-2 text-sm font-black">+ Feature</button>
    </div>
  );
}

function PackagePreview({ pack }) {
  const border = pack.borderColor === "gold" ? "border-yellow-500" : pack.borderColor === "red" ? "border-[#CC0000]" : "border-white/10";
  return <div className={`rounded-lg border ${border} bg-black/35 p-5`}><p className="text-[#FF0000]">{pack.nameEn}</p><h3 className="mt-2 text-3xl font-black">{pack.nameAr}</h3><div className="mt-3 flex flex-wrap gap-2">{pack.featured && <span className="inline-block rounded bg-[#CC0000] px-3 py-1 text-xs font-black">الأكثر طلباً</span>}{pack.borderColor === "gold" && <span className="inline-block rounded border border-yellow-500/50 px-3 py-1 text-xs font-black text-yellow-200">المميز</span>}</div><p className="mt-4 text-[#888]">{pack.description}</p><ul className="mt-5 grid gap-2">{pack.features.filter((f) => f.visible).map((f) => <li key={f.id} className="flex gap-2"><Check className="h-4 w-4 text-[#FF0000]" />{f.textAr}</li>)}</ul><button type="button" className="mt-6 w-full rounded-lg bg-[#CC0000] py-3 font-black">{pack.ctaAr}</button></div>;
}

function exportCsv(rows, filename) {
  const csv = [Object.keys(rows[0] || {}).join(","), ...rows.map((row) => Object.values(row).map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
