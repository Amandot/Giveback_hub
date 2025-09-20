-- CreateTable
CREATE TABLE "ngos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "city" TEXT NOT NULL DEFAULT 'Mumbai',
    "adminId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ngos_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_donations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "donationType" TEXT NOT NULL DEFAULT 'ITEMS',
    "itemName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "amount" REAL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "ngoId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "donations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "donations_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "ngos" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_donations" ("createdAt", "description", "id", "itemName", "quantity", "status", "updatedAt", "userId") SELECT "createdAt", "description", "id", "itemName", "quantity", "status", "updatedAt", "userId" FROM "donations";
DROP TABLE "donations";
ALTER TABLE "new_donations" RENAME TO "donations";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ngos_email_key" ON "ngos"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ngos_adminId_key" ON "ngos"("adminId");
