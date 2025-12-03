/*
  Warnings:

  - The primary key for the `FileMetadata` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `FileMetadata` DROP FOREIGN KEY `FileMetadata_ownerId_fkey`;

-- DropIndex
DROP INDEX `FileMetadata_ownerId_fkey` ON `FileMetadata`;

-- AlterTable
ALTER TABLE `FileMetadata` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `ownerId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `FileMetadata` ADD CONSTRAINT `FileMetadata_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
