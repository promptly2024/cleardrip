/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `ServiceDefinition` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "ServiceDefinition" DROP COLUMN "imageUrl";
