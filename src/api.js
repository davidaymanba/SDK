export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

function absoluteUrl(value) {
  if (typeof value !== "string" || !value.startsWith("/")) return value;
  return `${API_BASE_URL}${value}`;
}

function parseJson(value, fallback) {
  if (Array.isArray(value) || (value && typeof value === "object")) return value;
  if (typeof value !== "string" || value === "") return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalizeContentShape(content) {
  if (!content || typeof content !== "object") return content;
  return {
    ...content,
    identity: {
      ...(content.identity || {}),
      highlights: parseJson(content.identity?.highlights, []),
    },
    timeline: parseJson(content.timeline, []).map((item) => ({
      ...item,
      images: parseJson(item.images, []),
    })),
    machine: {
      ...(content.machine || {}),
      specs: parseJson(content.machine?.specs, []),
      images: parseJson(content.machine?.images, []),
    },
    garage: {
      ...(content.garage || {}),
      services: parseJson(content.garage?.services, []),
      stats: parseJson(content.garage?.stats, {}),
      images: parseJson(content.garage?.images, []),
    },
    gallery: parseJson(content.gallery, []),
    audience: {
      ...(content.audience || {}),
      stats: parseJson(content.audience?.stats, []),
      instagram: parseJson(content.audience?.instagram, {}),
      tags: parseJson(content.audience?.tags, []),
      platformSplit: parseJson(content.audience?.platformSplit, []),
    },
    packages: parseJson(content.packages, []).map((item) => ({
      ...item,
      features: parseJson(item.features, []),
    })),
    sponsors: parseJson(content.sponsors, []),
    contacts: parseJson(content.contacts, []),
    analytics: {
      ...(content.analytics || {}),
      visits30: parseJson(content.analytics?.visits30, []),
      activity: parseJson(content.analytics?.activity, []),
    },
  };
}

function normalizeMediaUrls(value) {
  if (Array.isArray(value)) return value.map(normalizeMediaUrls);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => {
      const mediaLike = ["image", "logo", "profileImage", "actionImage", "siteLogo", "dkLogo", "garageLogo", "favicon"].includes(key);
      return [key, mediaLike ? absoluteUrl(item) : normalizeMediaUrls(item)];
    })
  );
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Request failed: ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export async function fetchContent() {
  return normalizeMediaUrls(normalizeContentShape(await request("/api/content")));
}

export async function saveSection(section, value, token) {
  return normalizeMediaUrls(normalizeContentShape(await request(`/api/content/${section}`, {
    method: "PUT",
    body: JSON.stringify(value),
    token,
  })));
}

export async function submitContact(payload) {
  return normalizeMediaUrls(await request("/api/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  }));
}

export async function loginAdmin(credentials) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function uploadImage(file, token) {
  const form = new FormData();
  form.append("image", file);
  const result = await request("/api/upload", { method: "POST", body: form, token });
  return { ...result, url: absoluteUrl(result.url) };
}
