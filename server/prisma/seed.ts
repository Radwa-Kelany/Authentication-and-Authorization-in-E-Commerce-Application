import prisma from '../lib/prisma';
import {
  UserTypeEnum,
  RoleEnum,
  PermissionGroupEnum,
  PermissionEnum,
} from '@prisma/client';

const rolePermissionGroups = {
  [RoleEnum.SUPER_ADMIN]: [PermissionGroupEnum.FULL_SYSTEM_ACCESS],

  [RoleEnum.ADMIN]: [
    PermissionGroupEnum.CUSTOMER_SERVICE_SUPPORT,
    PermissionGroupEnum.CUSTOMER_MANAGEMENT,
    PermissionGroupEnum.SELLER_MANAGEMENT,
    PermissionGroupEnum.CATALOG_MANAGEMENT,
    PermissionGroupEnum.INVENTORY_MANAGEMENT,
    PermissionGroupEnum.ORDER_MANAGEMENT,
    PermissionGroupEnum.PAYMENT_MANAGEMENT,
    PermissionGroupEnum.MARKETING_CUSTOMER_RETENTION,
    PermissionGroupEnum.NOTIFICATION_MANAGEMENT,
    PermissionGroupEnum.REPORTING_ANALYTICS,
    PermissionGroupEnum.USER_ACCESS_MANAGEMENT,
  ],

  [RoleEnum.CUSTOMER_SERVICE]: [
    PermissionGroupEnum.CUSTOMER_SERVICE_SUPPORT,
    PermissionGroupEnum.ORDER_MANAGEMENT,
    PermissionGroupEnum.NOTIFICATION_MANAGEMENT,
  ],

  [RoleEnum.SELLER]: [
    PermissionGroupEnum.CATALOG_MANAGEMENT,
    PermissionGroupEnum.INVENTORY_MANAGEMENT,
    PermissionGroupEnum.ORDER_MANAGEMENT,
  ],
} as const;

const permissionGroupPermissions = {
  [PermissionGroupEnum.CUSTOMER_SERVICE_SUPPORT]: [
    PermissionEnum.CUSTOMER_READ,
    PermissionEnum.CUSTOMER_UPDATE,
    PermissionEnum.TICKET_CREATE,
    PermissionEnum.TICKET_READ,
    PermissionEnum.TICKET_REPLY,
    PermissionEnum.TICKET_ASSIGN,
    PermissionEnum.TICKET_CLOSE,
    PermissionEnum.TICKET_REOPEN,
    PermissionEnum.REVIEW_READ,
    PermissionEnum.REVIEW_MODERATE,
  ],

  [PermissionGroupEnum.CUSTOMER_MANAGEMENT]: [
    PermissionEnum.CUSTOMER_READ,
    PermissionEnum.CUSTOMER_DELETE,
    PermissionEnum.CUSTOMER_BLOCK,
    PermissionEnum.CUSTOMER_UNBLOCK,
  ],

  [PermissionGroupEnum.SELLER_MANAGEMENT]: [
    PermissionEnum.SELLER_READ,
    PermissionEnum.SELLER_APPROVE,
    PermissionEnum.SELLER_DELETE,
    PermissionEnum.SELLER_UPDATE,
    PermissionEnum.SELLER_SUSPEND,
  ],

  [PermissionGroupEnum.CATALOG_MANAGEMENT]: [
    PermissionEnum.PRODUCT_CREATE,
    PermissionEnum.PRODUCT_READ,
    PermissionEnum.PRODUCT_UPDATE,
    PermissionEnum.PRODUCT_DELETE,
    PermissionEnum.PRODUCT_PUBLISH,
    PermissionEnum.PRODUCT_UNPUBLISH,
    PermissionEnum.CATEGORY_CREATE,
    PermissionEnum.CATEGORY_READ,
    PermissionEnum.CATEGORY_UPDATE,
    PermissionEnum.CATEGORY_DELETE,
  ],

  [PermissionGroupEnum.INVENTORY_MANAGEMENT]: [
    PermissionEnum.INVENTORY_READ,
    PermissionEnum.INVENTORY_UPDATE,
    PermissionEnum.INVENTORY_ADJUST,
  ],

  [PermissionGroupEnum.ORDER_MANAGEMENT]: [
    PermissionEnum.ORDER_READ,
    PermissionEnum.ORDER_UPDATE,
    PermissionEnum.ORDER_CANCEL,
    PermissionEnum.ORDER_REFUND,
    PermissionEnum.ORDER_COMPLETE,
  ],

  [PermissionGroupEnum.PAYMENT_MANAGEMENT]: [
    PermissionEnum.PAYMENT_READ,
    PermissionEnum.PAYMENT_REFUND,
    PermissionEnum.PAYMENT_CANCEL,
  ],

  [PermissionGroupEnum.MARKETING_CUSTOMER_RETENTION]: [
    PermissionEnum.COUPON_CREATE,
    PermissionEnum.COUPON_READ,
    PermissionEnum.COUPON_UPDATE,
    PermissionEnum.COUPON_DELETE,
    PermissionEnum.COUPON_ACTIVATE,
    PermissionEnum.COUPON_DEACTIVATE,
    PermissionEnum.PROMOTION_CREATE,
    PermissionEnum.PROMOTION_READ,
    PermissionEnum.PROMOTION_UPDATE,
    PermissionEnum.PROMOTION_DELETE,
    PermissionEnum.LOYALTY_READ,
    PermissionEnum.LOYALTY_ADJUST,
    PermissionEnum.LOYALTY_REVOKE,
  ],

  [PermissionGroupEnum.NOTIFICATION_MANAGEMENT]: [
    PermissionEnum.NOTIFICATION_READ,
    PermissionEnum.NOTIFICATION_SEND,
    PermissionEnum.NOTIFICATION_DELETE,
  ],

  [PermissionGroupEnum.REPORTING_ANALYTICS]: [
    PermissionEnum.REPORT_READ,
    PermissionEnum.REPORT_EXPORT,
    PermissionEnum.ANALYTICS_READ,
  ],

  [PermissionGroupEnum.USER_ACCESS_MANAGEMENT]: [
    PermissionEnum.USER_CREATE,
    PermissionEnum.USER_READ,
    PermissionEnum.USER_UPDATE,
    PermissionEnum.USER_DELETE,
    PermissionEnum.USER_ACTIVATE,
    PermissionEnum.USER_DEACTIVATE,
    PermissionEnum.ROLE_CREATE,
    PermissionEnum.ROLE_READ,
    PermissionEnum.ROLE_UPDATE,
    PermissionEnum.ROLE_DELETE,
    PermissionEnum.ROLE_ASSIGN,
    PermissionEnum.PERMISSION_READ,
    PermissionEnum.PERMISSION_ASSIGN,
  ],
  [PermissionGroupEnum.AUDIT_COMPLIANCE]: [
    PermissionEnum.AUDIT_READ,
    PermissionEnum.AUDIT_EXPORT,
  ],

  [PermissionGroupEnum.SYSTEM_ADMINISTRATION]: [
    PermissionEnum.SETTINGS_READ,
    PermissionEnum.SETTINGS_UPDATE,
    PermissionEnum.SYSTEM_BACKUP,
    PermissionEnum.SYSTEM_RESTORE,
  ],

  [PermissionGroupEnum.SUPER_PERMISSION_MANAGEMENT]: [
    PermissionEnum.PERMISSION_CREATE,
    PermissionEnum.PERMISSION_UPDATE,
    PermissionEnum.PERMISSION_DELETE,
  ],
  [PermissionGroupEnum.FULL_SYSTEM_ACCESS]: [PermissionEnum.SYSTEM_ADMIN],
} as const;

//  get roles, permission groups, permissions then map them as object with name as key and id as value
async function map_Role_PermissionGroups_Permissions() {
  const roles = await prisma.role.findMany();
  const permissionGroups = await prisma.permissionGroup.findMany();
  const permissions = await prisma.permission.findMany();

  const rolesMap = Object.fromEntries(roles.map((r) => [r.name, r.id]));
  const permissionGroupsMap = Object.fromEntries(
    permissionGroups.map((g) => [g.name, g.id]),
  );

  const permissionsMap = Object.fromEntries(
    permissions.map((p) => [p.name, p.id]),
  );
  return {
    rolesMap,
    permissionGroupsMap,
    permissionsMap,
  };
}

// then insert into role_permission_groups table depend on "rolePermissionGroups" constant
async function seedRolePermissionGroups() {
  const { rolesMap, permissionGroupsMap } =
    await map_Role_PermissionGroups_Permissions();

  const permissionGroupRows = Object.entries(rolePermissionGroups).flatMap(
    ([roleName, groups]) =>
      groups.map((groupName) => ({
        roleId: rolesMap[roleName],
        permissionGroupId: permissionGroupsMap[groupName],
      })),
  );

  await prisma.rolePermissionGroup.createMany({
    data: permissionGroupRows,
    skipDuplicates: true,
  });
}

async function seedPermissionsGroupsPermissions() {
  const { permissionGroupsMap, permissionsMap } =
    await map_Role_PermissionGroups_Permissions();

  const permissionGroupPermissionRows = Object.entries(
    permissionGroupPermissions,
  ).flatMap(([groupName, permissions]) =>
    permissions.map((permissionName) => ({
      permissionGroupId: permissionGroupsMap[groupName],
      permissionId: permissionsMap[permissionName],
    })),
  );

  await prisma.permissionGroupPermission.createMany({
    data: permissionGroupPermissionRows,
    skipDuplicates: true,
  });
}
async function main() {
  // ─────────────────────────────────────────
  // Clean existing data (order matters for FK)
  // ─────────────────────────────────────────
  await prisma.userType.deleteMany();
  await prisma.role.deleteMany();

  await prisma.permissionGroup.deleteMany();
  await prisma.permission.deleteMany();

  // await prisma.rolePermissionGroup.deleteMany();
  // await prisma.permissionGroupPermission.deleteMany();

  // ─────────────────────────────────────────
  // USER TYPES
  // ─────────────────────────────────────────
  await prisma.userType.createMany({
    data: Object.values(UserTypeEnum).map((name) => ({ name })),
    skipDuplicates: true,
  });

  // ─────────────────────────────────────────
  // ROLES
  // ─────────────────────────────────────────
  await prisma.role.createMany({
    data: Object.values(RoleEnum).map((name) => ({ name })),
    skipDuplicates: true,
  });

  // ─────────────────────────────────────────
  // PERMISSION GROUPS
  // ─────────────────────────────────────────
  await prisma.permissionGroup.createMany({
    data: Object.values(PermissionGroupEnum).map((name) => ({ name })),
    skipDuplicates: true,
  });

  // ─────────────────────────────────────────
  // PERMISSIONS
  // ─────────────────────────────────────────
  await prisma.permission.createMany({
    data: Object.values(PermissionEnum).map((name) => ({ name })),
    skipDuplicates: true,
  });

  // ─────────────────────────────────────────
  // ROLE PERMISSION GROUPS
  // ─────────────────────────────────────────
  await seedRolePermissionGroups();

  // ─────────────────────────────────────────
  // PERMISSION GROUP PERMISSIONS
  // ─────────────────────────────────────────
  await seedPermissionsGroupsPermissions();
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
