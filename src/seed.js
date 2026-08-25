import { prisma } from "./config/db.js";

async function main() {
  await prisma.product.createMany({
    data: [
      {
        title: "Apple MacBook Pro 16",
        description: "M3 Max chip, 36GB Unified Memory, 1TB SSD Storage - Space Black",
        price: 2499.99,
        image: "https://m.media-amazon.com/images/I/618vhnzKYzL._AC_SL1500_.jpg",
        category: "Computers & Laptops"
      },
      {
        title: "Sony WH-1000XM5 Wireless Headphones",
        description: "Industry Leading Noise Canceling Headphones with Auto NC Optimizer, Hands-Free Calling.",
        price: 398.00,
        image: "https://m.media-amazon.com/images/I/61vJbuPLs6L._AC_SL1500_.jpg",
        category: "Electronics"
      },
      {
        title: "Samsung Galaxy Watch 6",
        description: "44M Smartwatch, Fitness Tracker, Personalized Heart Rate Zones, Advanced Sleep Coaching.",
        price: 299.99,
        image: "https://m.media-amazon.com/images/I/61ZJQb1q7dL._AC_SL1500_.jpg",
        category: "Electronics"
      },
      {
        title: "Levi's Men's 501 Original Fit Jeans",
        description: "100% Cotton, Button fly, Sits at the waist, Regular fit through thigh.",
        price: 59.50,
        image: "https://m.media-amazon.com/images/I/811mxf911lL._AC_UY879_.jpg",
        category: "Fashion & Clothing"
      },
      {
        title: "Instant Pot Duo 7-in-1 Pressure Cooker",
        description: "Electric Pressure Cooker, Slow Cooker, Rice Cooker, Steamer, Sauté, Yogurt Maker, and Warmer.",
        price: 89.99,
        image: "https://m.media-amazon.com/images/I/71WylKdQe3L._AC_SL1500_.jpg",
        category: "Home & Kitchen"
      },
      {
        title: "Atomic Habits by James Clear",
        description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones.",
        price: 14.00,
        image: "https://m.media-amazon.com/images/I/81F90H7hnML._AC_UY320_FMwebp_QL65_.jpg",
        category: "Books"
      }
    ],
  });

  console.log("✅ Mazedar aur naye products database mein add ho gaye hain!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });