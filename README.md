# Authentication & Authorization in E-Commerce Applications

This repository explains the complete flow of authentication and authorization in E-Commerce applications, starting from user registration up to implementing Role-Based Access Control (RBAC).

---

# Main Processes

The system is divided into three main processes:

1. Registration
2. Authentication
3. Authorization

---

# User Types in E-Commerce Applications

E-Commerce systems usually contain two main categories of users:

## 1. Customer

The main user of the platform who can:

- Browse products
- Place orders
- Make payments
- Track deliveries

## 2. Dashboard Users

Users who manage and operate the system, including:

- Super Admin (optional)
- Admin
- Customer Support Agent
- Sellers / Service Providers
- Delivery Drivers

---

# Registration Flow

Each user type has its own registration or creation flow:

| User Type | Registration Method |
|---|---|
| Customer | Registers using the application UI |
| Seller | Registers using the application UI |
| Delivery Driver | Registers using the application UI |
| Admin | Created by the system owner or super admin |
| Customer Support Agent | Created by admin |

---

# Unified User Authentication Model

All users in the system must have:

- Username or Email
- Password

Since all users authenticate into the system, they are stored inside a unified `User` model.

The `User` model contains a `type` field that determines whether the user is:

- `CUSTOMER`
- `DASHBOARD_USER`

---

# Roles for Dashboard Users

Dashboard users are assigned specific roles to control permissions and access levels within the system.

Available roles include:

- `SUPER_ADMIN`
- `ADMIN`
- `CUSTOMER_SUPPORT`
- `SELLER`
- `DELIVERY_DRIVER`

---

# Permissions

## User Management

- user.create
- user.read
- user.update
- user.delete
- user.activate
- user.deactivate

---

## Customer Management

- customer.read
- customer.update
- customer.delete
- customer.block
- customer.unblock

---

## Product Management

- product.create
- product.read
- product.update
- product.delete
- product.publish
- product.unpublish

---

## Category Management

- category.create
- category.read
- category.update
- category.delete

---

## Inventory Management

- inventory.read
- inventory.update
- inventory.adjust

---

## Order Management

- order.create
- order.read
- order.update
- order.cancel
- order.refund
- order.complete

---

## Payment Management

- payment.read
- payment.process
- payment.refund
- payment.cancel

---

## Seller Management

- seller.create
- seller.read
- seller.update
- seller.delete
- seller.approve
- seller.reject

---

## Support Ticket Management

- ticket.create
- ticket.read
- ticket.reply
- ticket.assign
- ticket.close
- ticket.reopen

---

## Review Management

- review.read
- review.update
- review.delete
- review.moderate

---

## Coupon Management

- coupon.create
- coupon.read
- coupon.update
- coupon.delete
- coupon.activate
- coupon.deactivate

---

## Promotion Management

- promotion.create
- promotion.read
- promotion.update
- promotion.delete

---

## Loyalty Program Management

- loyalty.read
- loyalty.adjust
- loyalty.redeem

---

## Notification Management

- notification.create
- notification.read
- notification.send
- notification.delete

---

## Report Management

- report.read
- report.export

---

## Role Management

- role.create
- role.read
- role.update
- role.delete
- role.assign

---

## Permission Management

- permission.create
- permission.read
- permission.update
- permission.delete
- permission.assign

---

## Audit Management

- audit.read
- audit.export

---

## System Administration

- settings.read
- settings.update
- system.backup
- system.restore

---

## Full System Access

- system.admin

# Authorization Strategy

Authorization is enforced entirely at the backend/server level to ensure strong security and prevent any client-side manipulation.

After successful JWT/session authentication, the system applies two different authorization strategies based on the user type.

---

## 1. Customer Authorization Strategy

For customers, authorization is based on ownership/resource validation.

The system verifies that the authenticated customer is accessing only resources that belong to them, such as:

- Orders
- Cart
- Addresses
- Payments
- Wishlist

Example:

- A customer can access their own order
- A customer cannot access another customer's order

This type of authorization is commonly known as:

- Ownership Validation or
- Resource-Based Authorization

---

## 2. Dashboard User Authorization Strategy

For dashboard users, authorization is based on Role-Based Access Control (RBAC) and permission checks.

After authentication, the system validates:

1. User role
2. Assigned permissions
3. Allowed dashboard actions

Examples:

- `SUPER_ADMIN` can manage the whole system
- `ADMIN` can manage operational data
- `CUSTOMER_SUPPORT` can handle support tickets
- `SELLER` can manage their products/orders
- `DELIVERY_DRIVER` can access delivery-related operations only

---
# ERD
```mermaid
erDiagram

    USER {
        int id PK
        string username
        string email
        string password
        string phone
        string refreshToken

        int userTypeId FK
        int roleId FK
    }

    CUSTOMER {
        int id PK
        string address
        date DOB
        string gender

        int userId FK
    }

    USER_TYPE {
        int id PK
        string name
    }

    ROLE {
        int id PK
        string name
    }

    PERMISSION {
        int id PK
        string name
        string description
    }

    ROLE_PERMISSION {
        int roleId FK
        int permissionId FK
    }

    USER o|--|| CUSTOMER : has_optional

    USER ||--|| USER_TYPE : belongs_to

    USER }o--|| ROLE : assigned_role

    ROLE ||--o{ ROLE_PERMISSION : contains

    PERMISSION ||--o{ ROLE_PERMISSION : assigned_to
```


