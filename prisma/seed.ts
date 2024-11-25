import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "test@test.com" },
    update: {},
    create: {
      email: "test@test.com",
      name: "Test User",
      password: "123123",
    },
  });
  await prisma.property.deleteMany();
  const properties = [
    {
      address: "123 Beacon Street",
      city: "Boston",
      state: "MA",
      zipCode: "02116",
      price: 750000,
      area: 1200,
      bedrooms: 2,
      bathrooms: 2,
    },
    {
      address: "456 Commonwealth Ave",
      city: "Boston",
      state: "MA",
      zipCode: "02215",
      price: 550000,
      area: 950,
      bedrooms: 1,
      bathrooms: 1.5,
    },
    // Add more seed data as needed
  ];

  for (const property of properties) {
    await prisma.property.create({
      data: property,
    });
  }

  //   await prisma.carListing.deleteMany();
  //   const carListings = [];
  //   for (const listing of carListings) {
  //     await prisma.carListing.create({
  //       data: listing,
  //     });
  //   }

  console.log({ user });
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });
