/*
  Warnings:

  - Added the required column `updatedAt` to the `Holding` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'ADMIN');

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "capital" DECIMAL(20,2) NOT NULL DEFAULT 0,
ALTER COLUMN "accountType" SET DEFAULT 'managed';

-- AlterTable
ALTER TABLE "Holding" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER';
