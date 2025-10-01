export function validateBody(schema) {
  return (req, res, next) => {
    // Reject missing or empty bodies
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body is required" });
    }

    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map(d => d.message)
      });
    }

    req.body = value; // sanitized
    next();
  };
}
