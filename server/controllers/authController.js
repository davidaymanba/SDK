import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AdminUser } from "../models/index.js";

function sign(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "dev-secret-change-me",
    { expiresIn: "7d" }
  );
}

export async function login(request, response, next) {
  try {
    const { email, password } = request.body;
    const user = await AdminUser.findOne({ where: { email: String(email || "").trim().toLowerCase() } });
    if (!user || !(await bcrypt.compare(String(password || ""), user.passwordHash))) {
      return response.status(401).json({ message: "Invalid credentials" });
    }
    return response.json({ token: sign(user), user: { email: user.email, role: user.role } });
  } catch (error) {
    return next(error);
  }
}

export function me(request, response) {
  response.json({ user: request.user });
}
