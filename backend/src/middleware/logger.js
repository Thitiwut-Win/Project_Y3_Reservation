export function logger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    // Copy body but mask sensitive fields
    const safeBody = { ...req.body };
    if (safeBody.password) safeBody.password = "***hidden***";
    if (safeBody.token) safeBody.token = "***hidden***";

    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms\n`,
      "Body:", safeBody
    );
  });

  next();
}
