export const validateClientRequest = (req, res, next) => {
  const { message, clientData } = req.body;

  if (!message || !clientData || !clientData.name) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: name and message are mandatory.",
    });
  }

  // If everything is fine, move to the controller
  next();
};
