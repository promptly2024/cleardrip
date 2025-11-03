-- CreateEnum
CREATE TYPE "SubscriptionPaymentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- AlterEnum
ALTER TYPE "ServiceStatus" ADD VALUE 'PAYMENT_INCOMPLETE';

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "status" "SubscriptionPaymentStatus" NOT NULL DEFAULT 'PENDING';
