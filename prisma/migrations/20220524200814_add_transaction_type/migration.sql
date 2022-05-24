/*
  Warnings:

  - Added the required column `type` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "currencyFromId" TEXT NOT NULL,
    "currencyToId" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "price" DECIMAL NOT NULL
);
INSERT INTO "new_Order" ("amount", "currencyFromId", "currencyToId", "id", "price") SELECT "amount", "currencyFromId", "currencyToId", "id", "price" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
