
import 'dotenv/config';
import { prisma } from '../lib/prisma';

// const prisma = new PrismaClient(); // Removed in favor of singleton

async function main() {
  try {
    console.log("Connecting to database...");
    await prisma.$connect();
    console.log("Connected successfully.");

    console.log("Fetching products...");
    const products = await prisma.product.findMany();
    console.log(`Found ${products.length} products.`);
    console.log(JSON.stringify(products, null, 2));
  } catch (error) {
    console.error("Error connecting to database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
