import jwt from "jsonwebtoken";
const authMiddleware = (req, res, next) => {
   const authHeader = req.headers["authorization"];
   const token = authHeader && authHeader.split(" ")[1];
   if (!token) {
      return res.status(403).json({ message: "Access denied. No token provided." });
   }

   try {
      const secret = process.env.ACCESS_TOKEN;
      console.log("secret", secret);
      const decoded = jwt.verify(token, secret);
      req.user = decoded;
      next();
   } catch (error) {
      return res.status(403).json({ message: "Invalid or expired token." });
   }
};

export default authMiddleware;
