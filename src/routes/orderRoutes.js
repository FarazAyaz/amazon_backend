import express from "express";
import { createOrder } from "../controllers/orderController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/checkout", verifyToken, createOrder);

export default router;