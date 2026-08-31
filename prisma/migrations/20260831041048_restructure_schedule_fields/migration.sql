/*
  Warnings:

  - You are about to drop the column `description` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `endAt` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `startAt` on the `Schedule` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Schedule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "memo" TEXT,
    "location" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "allDay" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT '예정',
    "type" TEXT NOT NULL DEFAULT '개인',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
-- 기존 데이터 보존: description->memo, startAt->startDate, endAt->endDate로 매핑.
-- status/type은 이 INSERT에서 생략되어 위 컬럼 기본값("예정"/"개인")이 자동 적용됩니다.
INSERT INTO "new_Schedule" ("id", "title", "memo", "location", "startDate", "endDate", "allDay", "createdAt", "updatedAt")
SELECT "id", "title", "description", "location", "startAt", "endAt", "allDay", "createdAt", "updatedAt" FROM "Schedule";
DROP TABLE "Schedule";
ALTER TABLE "new_Schedule" RENAME TO "Schedule";
CREATE INDEX "Schedule_startDate_idx" ON "Schedule"("startDate");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
