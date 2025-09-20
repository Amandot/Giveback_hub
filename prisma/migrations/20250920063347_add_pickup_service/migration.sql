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
    "adminNotes" TEXT,
    "ngoId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "needsPickup" BOOLEAN NOT NULL DEFAULT false,
    "pickupDate" DATETIME,
    "pickupTime" TEXT,
    "pickupAddress" TEXT,
    "pickupNotes" TEXT,
    "pickupStatus" TEXT NOT NULL DEFAULT 'NOT_REQUIRED',
    CONSTRAINT "donations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "donations_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "ngos" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_donations" ("adminNotes", "amount", "createdAt", "description", "donationType", "id", "itemName", "ngoId", "quantity", "status", "updatedAt", "userId") SELECT "adminNotes", "amount", "createdAt", "description", "donationType", "id", "itemName", "ngoId", "quantity", "status", "updatedAt", "userId" FROM "donations";
DROP TABLE "donations";
ALTER TABLE "new_donations" RENAME TO "donations";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
