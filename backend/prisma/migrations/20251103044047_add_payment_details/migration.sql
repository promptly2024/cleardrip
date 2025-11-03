-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentPurpose" AS ENUM ('SERVICE_BOOKING', 'SUBSCRIPTION', 'PRODUCT_PURCHASE', 'OTHER');

-- CreateTable
CREATE TABLE "PaymentOrder" (
    "id" TEXT NOT NULL,
    "razorpayOrderId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "purpose" "PaymentPurpose" NOT NULL,
    "userId" TEXT NOT NULL,
    "bookingId" TEXT,
    "subscriptionId" TEXT,
    "productId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentTransaction" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "status" "PaymentStatus" NOT NULL,
    "method" TEXT,
    "amountPaid" DOUBLE PRECISION,
    "capturedAt" TIMESTAMP(3),
    "errorReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentOrder_razorpayOrderId_key" ON "PaymentOrder"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentTransaction_orderId_key" ON "PaymentTransaction"("orderId");

-- AddForeignKey
ALTER TABLE "PaymentOrder" ADD CONSTRAINT "PaymentOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentOrder" ADD CONSTRAINT "PaymentOrder_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "ServiceBooking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentOrder" ADD CONSTRAINT "PaymentOrder_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentOrder" ADD CONSTRAINT "PaymentOrder_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "PaymentOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
