-- CreateEnum
CREATE TYPE "Watering" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "Light" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'FULL_SUN');

-- CreateEnum
CREATE TYPE "PlantHeight" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "PlantPosition" AS ENUM ('INDOOR', 'OUTDOOR', 'BOTH');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "difficulty" "Difficulty",
ADD COLUMN     "height" "PlantHeight",
ADD COLUMN     "light" "Light",
ADD COLUMN     "petFriendly" BOOLEAN,
ADD COLUMN     "position" "PlantPosition",
ADD COLUMN     "watering" "Watering";
