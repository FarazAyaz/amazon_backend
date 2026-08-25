import { prisma } from "../config/db.js";

// 1. Get All Products (GET)
export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Fetch Products Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch products!" });
  }
};

// 2. Create New Product (POST)
export const createProduct = async (req, res) => {
  try {
    const { title, description, price, image, category, stock } = req.body;

    const newProduct = await prisma.product.create({
      data: {
        title,
        description,
        price,
        image,
        category,
        stock,
      },
    });

    res.status(201).json({ success: true, message: "Product added successfully!", data: newProduct });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ success: false, message: "Failed to add product!" });
  }
};

// Search Products Function
export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query; // e.g. /api/products/search?query=iphone

    if (!query) {
      return res.status(400).json({ success: false, message: "Search query is required" });
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
        ],
      },
    });

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ success: false, message: "Server error during search" });
  }
};
// Get Single Product by ID (GET)
export const getProductById = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found!" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Fetch Single Product Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch product details." });
  }
};