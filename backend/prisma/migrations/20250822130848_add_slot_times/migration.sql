/*
  Warnings:

  - You are about to drop the column `date` on the `Slot` table. All the data in the column will be lost.
  - You are about to drop the column `slotType` on the `Slot` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `Slot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Slot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Slot" DROP COLUMN "date",
DROP COLUMN "slotType",
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;

-- DropEnum
DROP TYPE "SlotType";
