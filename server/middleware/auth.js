import jwt from "jsonwebtoken";

export function requireAuth(request, response, next) {
  const header = request.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return response.status(401).json({ message: "Missing token" });

  try {
    request.user = jwt.verify(token, process.env.JWT_SECRET || "dev-secret-change-me");
    return next();
  } catch {
    return response.status(401).json({ message: "Invalid token" });
  }
}
