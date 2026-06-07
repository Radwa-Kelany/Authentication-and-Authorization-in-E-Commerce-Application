/*
  Warnings:

  - The values [password.changed] on the enum `session_revocation_reason` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "session_revocation_reason_new" AS ENUM ('user.logout', 'user.logout_all_devices', 'password.reset', 'account.deactivated', 'account.suspended', 'account.deleted', 'admin.revoked', 'security.revoked', 'token.reuse_detected', 'refresh.rotated', 'session.expired');
ALTER TABLE "user_sessions" ALTER COLUMN "revoked_reason" TYPE "session_revocation_reason_new" USING ("revoked_reason"::text::"session_revocation_reason_new");
ALTER TYPE "session_revocation_reason" RENAME TO "session_revocation_reason_old";
ALTER TYPE "session_revocation_reason_new" RENAME TO "session_revocation_reason";
DROP TYPE "public"."session_revocation_reason_old";
COMMIT;
