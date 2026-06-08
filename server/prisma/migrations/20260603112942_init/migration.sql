-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PermissionEnum" ADD VALUE 'permission.create';
ALTER TYPE "PermissionEnum" ADD VALUE 'permission.update';
ALTER TYPE "PermissionEnum" ADD VALUE 'permission.delete';
ALTER TYPE "PermissionEnum" ADD VALUE 'audit.read';
ALTER TYPE "PermissionEnum" ADD VALUE 'audit.export';
ALTER TYPE "PermissionEnum" ADD VALUE 'settings.read';
ALTER TYPE "PermissionEnum" ADD VALUE 'settings.update';
ALTER TYPE "PermissionEnum" ADD VALUE 'system.backup';
ALTER TYPE "PermissionEnum" ADD VALUE 'system.restore';
ALTER TYPE "PermissionEnum" ADD VALUE 'system.admin';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PermissionGroupEnum" ADD VALUE 'Audit & Compliance';
ALTER TYPE "PermissionGroupEnum" ADD VALUE 'System Administration';
ALTER TYPE "PermissionGroupEnum" ADD VALUE 'Super Permission Management';
ALTER TYPE "PermissionGroupEnum" ADD VALUE 'Full System Access';
