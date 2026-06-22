# Authentication Documentation

## Login flowchart

```mermaid
flowchart LR

    subgraph Client
        A[User enters email and password]
        B[Send login request]
        C[Receive Access Token and Refresh Token]
        D[Call authenticated API]
        E[Attach tokens to request]
    end

    subgraph Backend
        F[Login Controller]
        G{Check email and password}
        H[Generate JWT tokens]
        I[Auth Middleware]
        J{Verify tokens}
        K[Allow request]
        L[Reject request]
    end

    A --> B
    B --> F
    F --> G

    G -->|Invalid| L
    G -->|Valid| H

    H --> C
    C --> D
    D --> E

    E --> I
    I --> J

    J -->|Valid| K
    J -->|Invalid| L
```

---

## Refresh Flowchart

```mermaid
flowchart LR

    subgraph Client
        A[Send request with Access Token]
        B[Receive Authentication Error: Access Token Expired]
        C[Send Refresh Token Request]
        D[Receive New Access Token]
        E[Retry Original Request]
        F[Redirect User To Login Page]
    end

    subgraph Backend
        G[Protected API Route]
        H[Auth Middleware Verify Access Token]
        I[Refresh Token Endpoint]
        J{Refresh Token Exists?}
        K{Refresh Token Valid?}
        L{Session Exists and Not Revoked?}
        M[Generate New Access Token]
        N[Return Authentication Error]
    end


    A --> G
    G --> H

    H -->|Expired| B
    H -->|Valid| G

    B --> C
    C --> I

    I --> J

    J -->|No| N
    J -->|Yes| K

    K -->|No| N
    K -->|Yes| L

    L -->|No| N
    L -->|Yes| M

    M --> D
    D --> E

    N --> F
```

---

## Access Token and Refresh Token

Both tokens are generated using a JWT library and used within the authentication process, but each serves a distinct function.

### A. Access Token

As the name implies, the access token is used to allow or deny access to specific API routes. It is sent with the HTTP request header and verified by the authentication middleware, so its payload must be designed to support that responsibility.

#### Payload Design Considerations

Choosing what to include in the access token payload involves several important considerations:

1. **Avoid sensitive data.** If the payload is not encrypted, it can be decoded easily on the frontend. It must never include sensitive data such as passwords or credit card details.

2. **Keep the payload minimal.** It should include only the information required for the application to function — serving both ends of the system:
   - **Frontend:** data needed for UI rendering, such as `username` (displayed in the navbar) and `role` (used to show/hide UI sections).
   - **Backend:** unique identifiers, such as `userId`, required for authentication and authorization checks.

#### Example

```js
const payload = {
  sub: user.id, // e.g. "user_9f3a1b2c"
  name: user.name, // e.g. "John"
  roles: user.roles, // e.g. ["admin", "editor"]
};

const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
  expiresIn: '15m', // short-lived
  issuer: 'api.myapp.com',
  audience: 'myapp.com',
  jwtid: crypto.randomUUID(),
});
```

### B. Refresh Token

The refresh token's role is to regenerate the access token once it expires, as long as the associated session is still alive and the refresh token itself has not expired. Because of this, its lifetime is significantly longer than the access token's — typically up to 30 days, depending on business requirements.

Its payload is also much simpler, containing only the session identifier (`sub: sessionId`), which is used to verify both the refresh token and the underlying session.

#### Example

```js
const payload = {
  sub: session.id,
};

const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
  expiresIn: '30d', // long-lived
  issuer: 'api.myapp.com',
  audience: 'myapp.com',
  jwtid: crypto.randomUUID(),
});
```

---

## User Session Model: Purpose and Design Philosophy

### Overview

The User Session table is a core component of the authentication system. Its purpose is to manage and track user access across multiple devices in a way that is secure, scalable, and auditable.

Rather than storing a refresh token directly on the User model, this design introduces a dedicated session layer that represents each login instance as an independent entity.

---

### Why a Separate Session Table?

Users may access the system from multiple devices simultaneously (mobile, desktop, tablet). Supporting this is essential for a good user experience — particularly in applications like e-commerce platforms, where seamless multi-device access is expected.

To support this behavior, refresh tokens are stored in a dedicated **User Session** table rather than on the **User** model itself.

--- 

### What "Session" Means?

A session represents a single authenticated login instance. When a user successfully logs in, the system creates a session record that tracks that login's active presence until it becomes invalid (via revocation or expiration).

Each session record includes:

- **User identity** (`userId`)
- **Refresh token**
- **Device information** (device type, browser, OS)
- **Creation and expiration timestamps**
- **Status** (active / revoked) and, where applicable, a **revocation reason**

In this context, a session is a lifecycle record of authentication activity — not merely a token container.

---

### Why Not Store the Refresh Token on the User Model?

Storing the refresh token directly on the User model is simpler, but introduces several limitations:

| Limitation                       | Description                                                                                                                                                                                              |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Limited multi-device support** | A single token field implies one active session per user, which conflicts with multi-device login.                                                                                                       |
| **Poor separation of concerns**  | The User model should represent identity data, not authentication lifecycle behavior. Mixing the two leads to a bloated, less maintainable design.                                                       |
| **Weak auditability**            | A bare token field carries no history — it can't capture login history, device usage, or suspicious activity.                                                                                            |
| **Coarse-grained revocation**    | Freezing access means mutating the User record directly. There's no clean way to record _why_ access was revoked without adding audit-specific fields to a model that shouldn't own that responsibility. |

---

### Advantages of the Session-Based Approach

**Security control**
Each session can be independently revoked, invalidated, or monitored. If a refresh token is compromised, the corresponding session can be revoked without touching the User record — and even though the stolen token is technically still unexpired, it becomes unusable the moment its session is marked invalid. This removes the need to wait out the token's natural expiration window.

**Improved auditing and monitoring**
The session table can capture metadata such as device type, IP address, user agent, and revocation reason — enabling tracking of user behavior and detection of suspicious activity.

**Fine-grained session management**
The system can revoke a single device's session, revoke all sessions for a user, or track concurrent logins across devices.

---

### Summary

The User Session table is the system's source of truth for authentication state. It represents:

- User login activity
- Device-level authentication context
- Session validity and lifecycle
- Security control and revocation

This design improves **security**, **scalability**, **observability**, and **maintainability**, while enabling a better user experience across multiple devices.

---

## User and Session ERD

```mermaid
erDiagram
    USER ||--o{ USER_SESSION : "has many"

    USER {
        uuid id PK
        string email
        string password
        string name
        string status
        datetime createdAt
        datetime updatedAt
    }

    USER_SESSION {
        uuid id PK
        uuid userId FK
        string refreshToken
        string deviceType
        string browser
        string os
        string ipAddress
        boolean isRevoked
        string revokeReason
        datetime createdAt
        datetime expiresAt
    }
```

---

# Session Revocation

A session can be terminated before its natural expiration through **revocation**. Revocation is triggered either by the user directly, or by the system in response to specific conditions.

## Revocation Triggers

### 1. User-Initiated

| Trigger            | Description                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------ |
| **Logout**         | The user explicitly ends their own session.                                                                  |
| **Password Reset** | The user resets their password, which implicitly invalidates all existing sessions as a security precaution. |

### 2. System-Initiated

| Trigger                                | Description                                                                                                                                             |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Security vulnerability**             | A detected threat (e.g., suspicious activity, credential leak) forces revocation of one or more sessions.                                               |
| **Account freezing**                   | An administrator or fraud-detection process disables a user's account, revoking all active sessions.                                                    |
| **Session / refresh token expiration** | Once the refresh token (or session) has actually expired, the system revokes the session and redirects the user to the login page to start a fresh one. |

> **Note:** Expiration is technically a _passive_ form of invalidation — the session simply lapses rather than being explicitly revoked. It's grouped here because, functionally, it produces the same end state: the session can no longer be used.

--- 

## Revocation Flows

### Logout Flow

```mermaid
flowchart TD
    A[User clicks Logout] --> B[Client sends refresh token via cookie]
    B --> C{Token valid & session found?}
    C -->|No| D[No action / reject]
    C -->|Yes| E[Revoke session]
    E --> F[Set reason: user_logout]
    F --> G[Clear stored refresh token]
```

--- 


### System-Initiated Revocation Flow

Covers security vulnerabilities and account freezing — admin- or system-triggered cases where a session is terminated independently of the user's activity.

```mermaid
flowchart TD
    A[System event detected] --> B{Trigger type}
    B -->|Security vulnerability| C[Locate affected session]
    B -->|Account frozen| C
    C --> D[Revoke session]
    D --> E[Set reason: security_violation / account_frozen]
    E --> F[Clear stored refresh token]
```

--- 

### Refresh Token Verification Flow

Triggered whenever the client uses its refresh token to request a new access token.

```mermaid
flowchart TD
    A[Client sends refresh token to request new access token] --> B{Refresh token / session valid?}
    B -->|No, expired| C[Revoke session]
    C --> D[Set reason: expired]
    D --> E[Clear stored refresh token]
    E --> F[Redirect user to login page]
    B -->|Yes| G[Issue new access token only]
```

---

### Password Reset Flow

```mermaid
flowchart TD
    A[User clicks Forgot Password] --> B[User enters email]
    B --> C{Email exists in DB?}
    C -->|No| D[Show generic response / no email sent]
    C -->|Yes| E[Send password reset link via email]
    E --> F[User opens link and sets new password]
    F --> G[Backend updates password in DB]
    G --> H[Revoke all sessions for user, across all devices]
```
