import express from "express";
import { getCart, addToCart, updateQuantity, removeItem } from "../controllers/cartController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; 

const router = express.Router();

router.get("/", verifyToken, getCart);
router.post("/add", verifyToken, addToCart);
router.put("/update", verifyToken, updateQuantity);           // NAYA: Update ke liye
router.delete("/remove/:productId", verifyToken, removeItem); // NAYA: Delete ke liye

export default router;