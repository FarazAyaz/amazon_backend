import { prisma } from "../config/db.js";

// Function to place an order
export const createOrder = async (req, res) => {
  try {
    const userId = parseInt(req.user.userId || req.user.id);

    // 1. Find user's cart and its items
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: { include: { product: true } }
      }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Your cart is empty!" });
    }

    // 2. Calculate total price
    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity, 
      0
    );

    // 3. Create Order and OrderItems in the database
    const order = await prisma.order.create({
      data: {
        userId,
        totalPrice,
        status: "Pending",
        // Using 'orderItems' according to the schema
        orderItems: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: { orderItems: true },
    });

    // 4. Clear/delete the cart items after order placement
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    res.status(200).json({ 
      success: true, 
      message: "Order placed successfully!", 
      order 
    });

  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({ success: false, message: "An error occurred while placing the order." });
  }
};