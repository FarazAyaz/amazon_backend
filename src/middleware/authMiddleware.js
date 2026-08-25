import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    // 1. Header se token nikalen
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: "you are not logged in" });
    }

    // 2. Token check karein
    const decoded = jwt.verify(token, "super_secret_key_amazon");
 
    // 3. User ki ID request mein daal dein taake agay controller ko mil sake
    req.user = decoded; 
    
    // 4. Agay jane do (Next function)
    next(); 
  } catch (error) {
    return res.status(401).json({ success: false, message: "The Token is invalid" });
  }
};