import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token || token === "null") {
    return res
      .status(401)
      .json({ success: false, message: "Not authorize to access this route" });
  }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch (err) {
    console.log(err.stack);
    return res
      .status(401)
      .json({ success: false, message: "Not authorize to access this route" });
  }
};

export const authorize = (req, res, next) => {
  if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
}
