import { prisma } from "../config/db.js";

// 1. Get User's Cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: true } } }
      });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch cart." });
  }
};

// 2. Add Item to Cart
export const addToCart = async (req, res) => {
  try {
    const userId = parseInt(req.user.userId || req.user.id);
    const productId = parseInt(req.body.productId);

    if (!userId || !productId) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    let cart = await prisma.cart.findUnique({ where: { userId } });

    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId }
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + 1 }
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity: 1 }
      });
    }

    res.status(200).json({ success: true, message: "Product added to cart successfully!" });
  } catch (error) {
    console.error("Cart add error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add product to cart.",
      errorDetails: error.message
    });
  }
};

// 3. Update Item Quantity in Cart (+ / -)
export const updateQuantity = async (req, res) => {
  try {
    const userId = parseInt(req.user.userId || req.user.id);
    const { productId, action } = req.body; // action: 'increase' or 'decrease'

    const cart = await prisma.cart.findUnique({ where: { userId } });
    const item = await prisma.cartItem.findFirst({ 
      where: { cartId: cart.id, productId: parseInt(productId) } 
    });

    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    // If quantity is 1 and user presses '-', delete the item
    if (action === 'decrease' && item.quantity <= 1) {
      await prisma.cartItem.delete({ where: { id: item.id } });
    } else {
      // Otherwise, increase or decrease the quantity
      await prisma.cartItem.update({
        where: { id: item.id },
        data: { quantity: action === 'increase' ? item.quantity + 1 : item.quantity - 1 }
      });
    }
    res.status(200).json({ success: true, message: "Quantity updated successfully!" });
  } catch (error) {
    console.error("Update Quantity Error:", error);
    res.status(500).json({ success: false, message: "Failed to update quantity." });
  }
};

// 4. Completely Remove Item from Cart
export const removeItem = async (req, res) => {
  try {
    const userId = parseInt(req.user.userId || req.user.id);
    const productId = parseInt(req.params.productId); // Get ID from URL

    const cart = await prisma.cart.findUnique({ where: { userId } });
    const item = await prisma.cartItem.findFirst({ 
      where: { cartId: cart.id, productId } 
    });

    if (item) {
      await prisma.cartItem.delete({ where: { id: item.id } });
    }
    res.status(200).json({ success: true, message: "Item deleted successfully!" });
  } catch (error) {
    console.error("Remove Item Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete item." });
  }
};