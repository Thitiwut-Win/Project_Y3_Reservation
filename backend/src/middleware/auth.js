import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    console.log(req.cookies)
    const token = req.cookies?.token;
    console.log(token)
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;

    next();
  } catch {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
