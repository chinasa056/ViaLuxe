-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Blog` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `tagId` VARCHAR(191) NULL,
    `content` TEXT NOT NULL,
    `coverMedia` TEXT NULL,
    `datePublished` DATETIME(3) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED', 'HIGHLIGHTED') NOT NULL DEFAULT 'DRAFT',
    `highlighted` BOOLEAN NOT NULL DEFAULT false,
    `archived` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BlogTag` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TourType` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TourPackage` (
    `id` VARCHAR(191) NOT NULL,
    `tourTitle` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `minimumPrice` DOUBLE NULL,
    `tourTypeId` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED', 'HIGHLIGHTED') NULL DEFAULT 'DRAFT',
    `coverMedia` JSON NULL,
    `departureDate` DATETIME(3) NULL,
    `returnDate` DATETIME(3) NULL,
    `duration` INTEGER NULL,
    `datePublished` DATETIME(3) NULL,
    `description` TEXT NULL,
    `activities` VARCHAR(191) NULL,
    `highlighted` BOOLEAN NULL DEFAULT false,
    `archived` BOOLEAN NULL DEFAULT false,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DestinationTravel` (
    `id` VARCHAR(191) NOT NULL,
    `tourTitle` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `minimumPrice` DOUBLE NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED', 'HIGHLIGHTED') NULL DEFAULT 'DRAFT',
    `coverMedia` JSON NULL,
    `departureDate` DATETIME(3) NULL,
    `returnDate` DATETIME(3) NULL,
    `duration` INTEGER NULL,
    `datePublished` DATETIME(3) NULL,
    `description` VARCHAR(191) NULL,
    `activities` VARCHAR(191) NULL,
    `highlighted` BOOLEAN NULL DEFAULT false,
    `archived` BOOLEAN NULL DEFAULT false,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VisaChecklist` (
    `id` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED', 'HIGHLIGHTED') NULL DEFAULT 'DRAFT',
    `images` JSON NULL,
    `datePublished` DATETIME(3) NULL,
    `highlighted` BOOLEAN NULL DEFAULT false,
    `archived` BOOLEAN NULL DEFAULT false,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmailSubscriber` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `EmailSubscriber_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientCategoryPriceOption` (
    `id` VARCHAR(191) NOT NULL,
    `categoryName` VARCHAR(191) NULL,
    `price` DOUBLE NULL,
    `tourPackageId` VARCHAR(191) NULL,
    `destinationTravelId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VisaDurationPriceOption` (
    `id` VARCHAR(191) NOT NULL,
    `durationInDays` INTEGER NULL,
    `price` DOUBLE NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `visaChecklistId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Request` (
    `id` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phoneNo` VARCHAR(191) NULL,
    `requestDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('OPEN', 'IN_PROGRESS', 'COMPLETED') NULL DEFAULT 'OPEN',
    `requestType` ENUM('FLIGHT_BOOKING', 'HOTEL_RESERVATION', 'VISA_ASSISTANCE', 'PRIVATE_JET_CHARTER', 'EXECUTIVE_SHUTTLE', 'TRAVEL_INSURANCE', 'SEHEMBZ_PAY', 'TOUR_PACKAGE') NULL,
    `from` VARCHAR(191) NULL,
    `to` VARCHAR(191) NULL,
    `departureDate` DATETIME(3) NULL,
    `returnDate` DATETIME(3) NULL,
    `numberOfPersons` INTEGER NULL,
    `preferredAirline` VARCHAR(191) NULL,
    `ticketClass` VARCHAR(191) NULL,
    `flightType` ENUM('ONE_WAY', 'ROUND_TRIP', 'MULTI_CITY') NULL,
    `purposeOfTravel` VARCHAR(191) NULL,
    `destinationCountry` VARCHAR(191) NULL,
    `tavelTime` DATETIME(3) NULL,
    `arrivalAirport` VARCHAR(191) NULL,
    `arrivalDate` DATETIME(3) NULL,
    `arrivalTime` VARCHAR(191) NULL,
    `rideType` ENUM('AIRPORT_PICKUP', 'CAR_HIRE') NULL,
    `typeOfJet` VARCHAR(191) NULL,
    `comment` VARCHAR(191) NULL,
    `additionalRequest` VARCHAR(191) NULL,
    `travelDate` DATETIME(3) NULL,
    `budget` VARCHAR(191) NULL,
    `accomodationPreference` VARCHAR(191) NULL,
    `tourPackageType` VARCHAR(191) NULL,
    `durationOfInsurance` INTEGER NULL,
    `insuranceType` VARCHAR(191) NULL,
    `reasonForContacting` TEXT NULL,
    `amount` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RegistrationToken` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `token` VARCHAR(512) NULL,
    `expiresAt` DATETIME(3) NULL,
    `used` BOOLEAN NULL DEFAULT false,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `firstName` VARCHAR(191) NULL,
    `dateOfBirth` DATETIME(3) NULL,
    `gender` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,

    UNIQUE INDEX `RegistrationToken_token_key`(`token`),
    INDEX `RegistrationToken_token_used_expiresAt_idx`(`token`, `used`, `expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `type` ENUM('REMINDER', 'INSIGHT', 'ACCOUNT_ACTIVITY') NULL,
    `message` TEXT NULL,
    `isRead` BOOLEAN NULL DEFAULT false,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Notification_userId_idx`(`userId`),
    INDEX `Notification_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Blog` ADD CONSTRAINT `Blog_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `BlogTag`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TourPackage` ADD CONSTRAINT `TourPackage_tourTypeId_fkey` FOREIGN KEY (`tourTypeId`) REFERENCES `TourType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientCategoryPriceOption` ADD CONSTRAINT `ClientCategoryPriceOption_tourPackageId_fkey` FOREIGN KEY (`tourPackageId`) REFERENCES `TourPackage`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientCategoryPriceOption` ADD CONSTRAINT `ClientCategoryPriceOption_destinationTravelId_fkey` FOREIGN KEY (`destinationTravelId`) REFERENCES `DestinationTravel`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VisaDurationPriceOption` ADD CONSTRAINT `VisaDurationPriceOption_visaChecklistId_fkey` FOREIGN KEY (`visaChecklistId`) REFERENCES `VisaChecklist`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RegistrationToken` ADD CONSTRAINT `RegistrationToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
