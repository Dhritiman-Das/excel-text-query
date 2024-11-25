-- CreateTable
CREATE TABLE "CarListing" (
    "id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "kmDriven" TEXT NOT NULL,
    "transmission" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "fuelType" TEXT NOT NULL,
    "postedDate" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "askPrice" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarListing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CarListing_brand_model_idx" ON "CarListing"("brand", "model");

-- CreateIndex
CREATE INDEX "CarListing_brand_fuelType_idx" ON "CarListing"("brand", "fuelType");

-- CreateIndex
CREATE INDEX "CarListing_askPrice_idx" ON "CarListing"("askPrice");
