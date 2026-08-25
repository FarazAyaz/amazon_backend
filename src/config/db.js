import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

// .env file se URL read karne ke liye
dotenv.config(); 

// 1. Connection Pool banayen
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. Adapter ko initialize karein
const adapter = new PrismaPg(pool);

// 3. Prisma ko adapter ke sath start karein
export const prisma = new PrismaClient({ adapter });