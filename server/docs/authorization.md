# Authorization Documentation

## RBAC Flowchart
```mermaid
flowchart LR

    subgraph Client
        A[User Requests Protected API Route]
        B[Send Request with Access Token]
        C[Receive Response]
    end


    subgraph Backend
        D[Auth Middleware]
        E{Validate Access Token}

        F[Extract User Identity]
        G[Load User Role and Permissions]

        H{Has Required Role?}
        I{Has Required Permission?}

        J[Allow Access to API Route]
        K[Denied Access Response]
    end


    A --> B
    B --> D

    D --> E

    E -->|Invalid| K
    E -->|Valid| F

    F --> G

    G --> H

    H -->|No| K
    H -->|Yes| I

    I -->|No| K
    I -->|Yes| J

    J --> C
    K --> C
```

## Roles, Permissions Groups and Permissions
```mermaid
flowchart LR

    R((Roles))

    R --> A[ADMIN]
    R --> SA[SUPER_ADMIN]
    R --> S[SELLER]
    R --> CS[CUSTOMER_SUPPORT]
    R --> SS[SYSTEM_SERVICE]


    A --> A1[Customer Service & Support]
    A --> A2[Customer Management]
    A --> A3[Seller Management]
    A --> A4[Catalog Management]
    A --> A5[Inventory Management]
    A --> A6[Order Management]
    A --> A7[Payment Management]
    A --> A8[Marketing & Retention]
    A --> A9[Notification Management]
    A --> A10[Reporting & Analytics]
    A --> A11[User & Access Management]


    A1 --> A11p[customer.read<br/>customer.update<br/>ticket.create<br/>ticket.read<br/>ticket.reply<br/>ticket.assign<br/>ticket.close<br/>ticket.reopen<br/>review.read<br/>review.moderate]

    A2 --> A21[customer.read<br/>customer.delete<br/>customer.block<br/>customer.unblock]

    A3 --> A31[seller.read<br/>seller.approve<br/>seller.delete<br/>seller.update<br/>seller.suspend]

    A4 --> A41[product.*<br/>category.*]

    A5 --> A51[inventory.read<br/>inventory.update<br/>inventory.adjust]

    A6 --> A61[order.read<br/>order.update<br/>order.cancel<br/>order.refund<br/>order.complete]

    A7 --> A71[payment.read<br/>payment.refund<br/>payment.cancel]

    A8 --> A81[coupon.*<br/>promotion.*<br/>loyalty.*]

    A9 --> A91[notification.read<br/>notification.send<br/>notification.delete]

    A10 --> A101[report.read<br/>report.export<br/>analytics.read]

    A11 --> A111[user.*<br/>role.*<br/>permission.*]


    SA --> SA1[Audit & Compliance]
    SA --> SA2[System Administration]
    SA --> SA3[Super Permission Management]
    SA --> SA4[Full System Access]

    SA1 --> SA11[audit.read<br/>audit.export]
    SA2 --> SA21[settings.*<br/>system.backup<br/>system.restore]
    SA3 --> SA31[permission.create<br/>permission.update<br/>permission.delete]
    SA4 --> SA41[system.admin]


    S --> S1[Catalog Management]
    S --> S2[Inventory Management]
    S --> S3[Order Management]

    S1 --> S11[product.*<br/>category.*]
    S2 --> S21[inventory.*]
    S3 --> S31[order.read<br/>order.update<br/>order.cancel<br/>order.complete]


    CS --> CS1[Customer Service & Support]
    CS --> CS2[Order Management]

    CS1 --> CS11[customer.*<br/>ticket.*<br/>review.*]
    CS2 --> CS21[order.read<br/>order.update]


    SS --> SS1[Notification Management]
    SS1 --> SS11[notification.read<br/>notification.send<br/>notification.delete]
```




## Permission Design Strategy

### why we use permission groups instead of assigning permissions to roles directly?

We organized permissions into **Permission Groups** based on business responsibilities rather than database structure or CRUD operations. This keeps the authorization model aligned with real business domains, making it easier to understand, maintain, and scale.

So each permission group represents a core business area such as:

- Customer Service & Support
- Catalog Management
- Inventory Management
- Order Management
- Marketing & Customer Retention
- User & Access Management
- System Administration

#### Hence we can get the following benefits:

- Groups permissions by business function instead of technical structure
- Makes role assignment clearer and easier to manage
- Improves system maintainability  as it grows
- Reduces duplication of permissions
- Simplifies onboarding for developers and administrators
- Allows new business domains to be added without redesigning RBAC


```text
Role
    ↓
Permission Group
    ↓
Permission
```
---

### Permission Naming Convention

All permissions follow a consistent pattern:

```text
resource.action
```

Examples:

```text
product.create
product.update
order.refund
ticket.close
seller.approve
user.assign_role
```












