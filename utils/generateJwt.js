import jwt from "jsonwebtoken";
export const jwtTokenPost = async (req, res) => {
   try {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
         expiresIn: "1h",
      });
      res.status(200).json({ token });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};
