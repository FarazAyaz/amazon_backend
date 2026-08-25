import express from "express";
import { getAllProducts, createProduct, searchProducts, getProductById } from "../controllers/productController.js";

const router = express.Router();

router.get("/search", searchProducts);
router.get("/", getAllProducts);
router.get("/:id", getProductById); // Yeh naya route single product ke liye hai
router.post("/", createProduct);

export default router;