export const checkRole = (allowedRoles) => {
    return (req, res, next) => {
      try {
        if (!allowedRoles.includes(req.user.role)) {
          return res.status(403).json({ error: 'Access denied. Insufficient privileges.' });
        }
        next();
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while checking privileges' });
      }
    };
  };
  