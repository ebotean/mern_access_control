-- CreateEnum
CREATE TYPE "AccessStatus" AS ENUM ('SUCCESS', 'WARNING', 'ERROR', 'FAILURE');

-- AlterTable
ALTER TABLE "UserAccess" ADD COLUMN     "message" TEXT,
ADD COLUMN     "status" "AccessStatus" NOT NULL DEFAULT 'SUCCESS';
