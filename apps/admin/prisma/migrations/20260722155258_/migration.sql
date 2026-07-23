/*
  Warnings:

  - You are about to drop the `Attachment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VoiceMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ChatGroupAdmins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ChatGroupMembers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ChatToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `typingInChatId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Attachment_url_key";

-- DropIndex
DROP INDEX "ChatGroup_chatId_key";

-- DropIndex
DROP INDEX "Message_status_createdAt_idx";

-- DropIndex
DROP INDEX "VoiceMessage_messageId_key";

-- DropIndex
DROP INDEX "VoiceMessage_url_key";

-- DropIndex
DROP INDEX "_ChatGroupAdmins_B_index";

-- DropIndex
DROP INDEX "_ChatGroupAdmins_AB_unique";

-- DropIndex
DROP INDEX "_ChatGroupMembers_B_index";

-- DropIndex
DROP INDEX "_ChatGroupMembers_AB_unique";

-- DropIndex
DROP INDEX "_ChatToUser_B_index";

-- DropIndex
DROP INDEX "_ChatToUser_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Attachment";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Chat";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ChatGroup";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Message";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "VoiceMessage";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ChatGroupAdmins";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ChatGroupMembers";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ChatToUser";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT,
    "emailVerifyToken" TEXT,
    "emailVerified" DATETIME,
    "password" TEXT,
    "passwordResetToken" TEXT,
    "passwordResetExpires" DATETIME,
    "avatar" TEXT,
    "profileBackground" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ONLINE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("avatar", "createdAt", "email", "emailVerified", "emailVerifyToken", "id", "name", "password", "passwordResetExpires", "passwordResetToken", "profileBackground", "status", "updatedAt", "username") SELECT "avatar", "createdAt", "email", "emailVerified", "emailVerifyToken", "id", "name", "password", "passwordResetExpires", "passwordResetToken", "profileBackground", "status", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_name_username_status_createdAt_idx" ON "User"("name", "username", "status", "createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
