import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updatePrices() {
  // Get all car listings
  const carListings = await prisma.carListing.findMany({
    where: {
      askPrice: {
        not: null,
      },
    },
  });

  // Process each listing
  for (const listing of carListings) {
    if (!listing.askPrice) continue;

    // Convert price string to number
    // Remove "₹ " prefix and all commas, then convert to integer
    const priceInInt = parseInt(
      listing.askPrice.replace("₹", "").replace(/\s/g, "").replace(/,/g, "")
    );

    // Update the record
    await prisma.carListing.update({
      where: {
        id: listing.id,
      },
      data: {
        askPriceInInt: priceInInt,
      },
    });
  }
}

async function main() {
  try {
    console.log("Starting price conversion...");
    await updatePrices();
    console.log("Price conversion completed successfully!");
  } catch (error) {
    console.error("Error during price conversion:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
