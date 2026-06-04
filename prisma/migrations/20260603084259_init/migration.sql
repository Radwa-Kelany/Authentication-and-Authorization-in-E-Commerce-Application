-- CreateEnum
CREATE TYPE "UserTypeEnum" AS ENUM ('customer', 'dashboard_user');

-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('super_admin', 'admin', 'customer_service', 'seller');

-- CreateEnum
CREATE TYPE "PermissionGroupEnum" AS ENUM ('Customer Service & Support', 'Customer Management', 'Seller Management', 'Catalog Management', 'Inventory Management', 'Order Management', 'Payment Management', 'Marketing & Customer Retention', 'Notification Management', 'Reporting & Analytics', 'User & Access Management');

-- CreateEnum
CREATE TYPE "PermissionEnum" AS ENUM ('customer.read', 'customer.update', 'customer.delete', 'customer.block', 'customer.unblock', 'ticket.create', 'ticket.read', 'ticket.reply', 'ticket.assign', 'ticket.close', 'ticket.reopen', 'review.read', 'review.moderate', 'seller.read', 'seller.approve', 'seller.delete', 'seller.update', 'seller.suspend', 'product.create', 'product.read', 'product.update', 'product.delete', 'product.publish', 'product.unpublish', 'category.create', 'category.read', 'category.update', 'category.delete', 'inventory.read', 'inventory.update', 'inventory.adjust', 'order.read', 'order.update', 'order.cancel', 'order.refund', 'order.complete', 'payment.read', 'payment.refund', 'payment.cancel', 'coupon.create', 'coupon.read', 'coupon.update', 'coupon.delete', 'coupon.activate', 'coupon.deactivate', 'promotion.create', 'promotion.read', 'promotion.update', 'promotion.delete', 'loyalty.read', 'loyalty.adjust', 'loyalty.revoke', 'notification.read', 'notification.send', 'notification.delete', 'report.read', 'report.export', 'analytics.read', 'user.create', 'user.read', 'user.update', 'user.delete', 'user.activate', 'user.deactivate', 'role.create', 'role.read', 'role.update', 'role.delete', 'role.assign', 'permission.read', 'permission.assign');

-- CreateTable
CREATE TABLE "user_types" (
    "id" SERIAL NOT NULL,
    "name" "UserTypeEnum" NOT NULL,

    CONSTRAINT "user_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" "RoleEnum" NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission_groups" (
    "id" SERIAL NOT NULL,
    "name" "PermissionGroupEnum" NOT NULL,

    CONSTRAINT "permission_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "name" "PermissionEnum" NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permission_groups" (
    "roleId" INTEGER NOT NULL,
    "permissionGroupId" INTEGER NOT NULL,

    CONSTRAINT "role_permission_groups_pkey" PRIMARY KEY ("roleId","permissionGroupId")
);

-- CreateTable
CREATE TABLE "permission_group_permissions" (
    "permissionGroupId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,

    CONSTRAINT "permission_group_permissions_pkey" PRIMARY KEY ("permissionGroupId","permissionId")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "refreshToken" TEXT,
    "user_type_code" TEXT NOT NULL DEFAULT 'customer',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_types_name_key" ON "user_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permission_groups_name_key" ON "permission_groups"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "role_permission_groups" ADD CONSTRAINT "role_permission_groups_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permission_groups" ADD CONSTRAINT "role_permission_groups_permissionGroupId_fkey" FOREIGN KEY ("permissionGroupId") REFERENCES "permission_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission_group_permissions" ADD CONSTRAINT "permission_group_permissions_permissionGroupId_fkey" FOREIGN KEY ("permissionGroupId") REFERENCES "permission_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission_group_permissions" ADD CONSTRAINT "permission_group_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
