import HomeView from "@/components/HomeView";
import { prisma } from "@/lib/prisma";
import { CarListing } from "@/lib/types";

export default async function Home() {
  const data = await prisma.carListing.findMany({});
  return (
    <main className="p-4">
      <HomeView properties={data as CarListing[]} />
    </main>
  );
}
