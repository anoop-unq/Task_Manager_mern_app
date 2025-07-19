import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const userAuthMiddleware = async (req, res, next) => {
  const  {token} = req.cookies;
  console.log("token",token)
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Please log in again.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    
    // Attach user ID to the request for future use
    req.userId = decoded.id;

    next(); // Proceed to the next middleware/controller
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};
