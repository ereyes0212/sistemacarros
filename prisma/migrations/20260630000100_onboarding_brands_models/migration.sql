ALTER TABLE `Usuarios` ADD COLUMN `onboardingCompleted` BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS `VehicleBrand` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `description` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `VehicleBrand_name_key`(`name`),
  UNIQUE INDEX `VehicleBrand_slug_key`(`slug`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `VehicleModel` (
  `id` VARCHAR(191) NOT NULL,
  `brandId` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  INDEX `VehicleModel_brandId_idx`(`brandId`),
  UNIQUE INDEX `VehicleModel_brandId_slug_key`(`brandId`, `slug`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
