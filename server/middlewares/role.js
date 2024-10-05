const checkUserRole = (roleToCheck) => (req, res, next) => {
  try {
    const role = req.cookies.role;

    if (role !== roleToCheck) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission for this",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = checkUserRole;
