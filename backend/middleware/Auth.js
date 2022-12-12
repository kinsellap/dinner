import { verifyToken } from '../service/AuthService';

const verify = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    res.status(403);
    res.json({ message: "No authentication found" });
  } else {
    try {
      const verifiedToken = verifyToken(token);
      req.user = verifiedToken;
    } catch (err) {
      res.status(401);
      return res.json({ message: "Invalid Token: " + err.message });
    }
    return next();
  }
};

module.exports = verify;
