# FRONTEND INTEGRATION GUIDE

> **Role**: Senior NestJS Backend Architect  
> **Target Audience**: Frontend Development Team (Next.js + Ant Design)  
> **Objective**: Building the UI implementation from the API contract.

---

## 1. Architecture & Auth Strategy

### Authentication (Better Auth)

The backend uses **Better Auth** with a **Cookie-Based Session** strategy.

- **Auth Provider**: Better Auth (SQLite + Drizzle Adapter)
- **Mechanism**: `httpOnly` Cookie named `better-auth.session_token`
- **Global Guard**: The API is protected by default. Public endpoints are explicitly marked.

**Frontend Implementation:**

1.  **Login/Signup**: Use the Better Auth client or make requests to the Auth endpoints (standard Better Auth paths, typically `/api/auth/*`).
2.  **API Requests**: You **MUST** include `credentials: true` in your Axios/Fetch config to ensure cookies are sent with every request.
    ```typescript
    // Example Axios Instance
    const api = axios.create({
      baseURL: 'http://localhost:3000/api/v1',
      withCredentials: true, // CRITICAL: Sends the session cookie
    });
    ```
3.  **Session Handling**: Expect the server to set `Set-Cookie` headers. No manual token storage (localStorage) is required.

### API Structure

- **Base URL**: `http://localhost:3000`
- **Global Prefix**: `/api/v1`
- **Example Endpoint**: `http://localhost:3000/api/v1/users`

---

## 2. The API Contract

### Users Controller

**Base Path**: `/users`

| Method     | Path   | Description    | Payload (DTO)   | Response         |
| :--------- | :----- | :------------- | :-------------- | :--------------- |
| **POST**   | `/`    | Create User    | `CreateUserDto` | `User` object    |
| **GET**    | `/`    | Get All Users  | -               | `User[]` (Array) |
| **GET**    | `/:id` | Get User by ID | -               | `User` object    |
| **PATCH**  | `/:id` | Update User    | `UpdateUserDto` | `User` object    |
| **DELETE** | `/:id` | Delete User    | -               | 204 No Content   |

**Ant Design Helpers:**

- **List**: Map `GET /users` response to `<Table dataSource={data} />`.
- **Form**: Use `CreateUserDto` properties for `<Form initialValues={...} />`.

---

### Companies Controller

**Base Path**: `/companies`

| Method    | Path   | Description       | Payload (DTO)      | Response            |
| :-------- | :----- | :---------------- | :----------------- | :------------------ |
| **POST**  | `/`    | Register Company  | `CreateCompanyDto` | `Company` object    |
| **GET**   | `/`    | Get All Companies | -                  | `Company[]` (Array) |
| **GET**   | `/:id` | Get Company       | -                  | `Company` object    |
| **PATCH** | `/:id` | Update Company    | `UpdateCompanyDto` | `Company` object    |

---

### Categories Controller

**Base Path**: `/categories`

| Method     | Path                 | Description         | Payload (DTO)       | Response             |
| :--------- | :------------------- | :------------------ | :------------------ | :------------------- |
| **POST**   | `/`                  | Create Category     | `CreateCategoryDto` | `Category` object    |
| **GET**    | `/`                  | Get All Categories  | -                   | `Category[]` (Array) |
| **GET**    | `/roots`             | Get Root Categories | -                   | `Category[]` (Array) |
| **GET**    | `/:id`               | Get by ID           | -                   | `Category` object    |
| **GET**    | `/:id/subcategories` | Get Subcategories   | -                   | `Category[]` (Array) |
| **PATCH**  | `/:id`               | Update Category     | `UpdateCategoryDto` | `Category` object    |
| **DELETE** | `/:id`               | Delete Category     | -                   | 204 No Content       |

---

### Listings Controller

**Base Path**: `/listings`

| Method    | Path                    | Description      | Payload (DTO)            | Response                                             |
| :-------- | :---------------------- | :--------------- | :----------------------- | :--------------------------------------------------- |
| **POST**  | `/`                     | Create Listing   | `CreateListingDto`       | `Listing` object                                     |
| **GET**   | `/`                     | Get All Listings | Query: `limit`, `offset` | `Listing[]` **(Simple Array, NOT Paginated Object)** |
| **GET**   | `/search`               | Search Listings  | Query: `q`               | `Listing[]`                                          |
| **GET**   | `/seller/:sellerId`     | By Seller        | -                        | `Listing[]`                                          |
| **GET**   | `/category/:categoryId` | By Category      | -                        | `Listing[]`                                          |
| **GET**   | `/:id`                  | Get by ID        | -                        | `Listing` object                                     |
| **PATCH** | `/:id`                  | Update Listing   | `UpdateListingDto`       | `Listing` object                                     |

**Key Mapping**:

- **Search/Filter**: The `GET /` endpoint supports simple pagination via query params but returns a flat array. Handle `total` count estimation on client or request backend update if exact count is needed.

---

### Orders Controller

**Base Path**: `/orders`

| Method    | Path              | Description     | Payload (DTO)            | Response              |
| :-------- | :---------------- | :-------------- | :----------------------- | :-------------------- |
| **POST**  | `/`               | Create Order    | `CreateOrderDto`         | `Order` object        |
| **GET**   | `/`               | Get All Orders  | Query: `limit`, `offset` | `Order[]` (Array)     |
| **GET**   | `/buyer/:buyerId` | By Buyer        | -                        | `Order[]` (Array)     |
| **GET**   | `/:id`            | Get by ID       | -                        | `Order` object        |
| **GET**   | `/:id/items`      | Get Order Items | -                        | `OrderItem[]` (Array) |
| **PATCH** | `/:id/status`     | Update Status   | `UpdateOrderStatusDto`   | `Order` object        |

---

### Payments Controller

**Base Path**: `/payments`

| Method    | Path                  | Description      | Payload (DTO)            | Response            |
| :-------- | :-------------------- | :--------------- | :----------------------- | :------------------ |
| **POST**  | `/`                   | Create Payment   | `CreatePaymentDto`       | `Payment` object    |
| **GET**   | `/`                   | Get All Payments | -                        | `Payment[]` (Array) |
| **GET**   | `/:id`                | Get by ID        | -                        | `Payment` object    |
| **PATCH** | `/:id/status`         | Update Status    | `UpdatePaymentStatusDto` | `Payment` object    |
| **POST**  | `/:id/release-escrow` | Release Funds    | -                        | `Payment` object    |
| **POST**  | `/:id/refund`         | Refund           | -                        | `Payment` object    |

---

### Shipping Controller

**Base Path**: `/shipping`

| Method    | Path             | Description       | Payload (DTO)       | Response             |
| :-------- | :--------------- | :---------------- | :------------------ | :------------------- |
| **POST**  | `/`              | Create Shipment   | `CreateShippingDto` | `Shipping` object    |
| **GET**   | `/`              | Get All Shipments | -                   | `Shipping[]` (Array) |
| **GET**   | `/:id`           | Get by ID         | -                   | `Shipping` object    |
| **PATCH** | `/:id`           | Update Shipment   | `UpdateShippingDto` | `Shipping` object    |
| **POST**  | `/:id/delivered` | Mark Delivered    | -                   | `Shipping` object    |

---

### Disputes Controller

**Base Path**: `/disputes`

| Method    | Path   | Description      | Payload (DTO)      | Response            |
| :-------- | :----- | :--------------- | :----------------- | :------------------ |
| **POST**  | `/`    | Create Dispute   | `CreateDisputeDto` | `Dispute` object    |
| **GET**   | `/`    | Get All Disputes | -                  | `Dispute[]` (Array) |
| **GET**   | `/:id` | Get by ID        | -                  | `Dispute` object    |
| **PATCH** | `/:id` | Update Dispute   | `UpdateDisputeDto` | `Dispute` object    |

---

### Reviews Controller

**Base Path**: `/reviews`

| Method   | Path                  | Description     | Payload (DTO)       | Response           |
| :------- | :-------------------- | :-------------- | :------------------ | :----------------- |
| **POST** | `/`                   | Create Review   | `CreateReviewDto`   | `Review` object    |
| **GET**  | `/`                   | Get All Reviews | -                   | `Review[]` (Array) |
| **GET**  | `/product/:productId` | Product Reviews | -                   | `Review[]` (Array) |
| **GET**  | `/seller/:sellerId`   | Seller Reviews  | -                   | `Review[]` (Array) |
| **POST** | `/:id/response`       | Seller Respond  | `SellerResponseDto` | `Review` object    |
| **POST** | `/:id/helpful`        | Mark Helpful    | -                   | `Review` object    |

---

### Chat Controller

**Base Path**: `/chat`

| Method   | Path                          | Description        | Payload (DTO)            | Response             |
| :------- | :---------------------------- | :----------------- | :----------------------- | :------------------- |
| **POST** | `/conversations`              | Start Conversation | `StartConversationDto`   | `Conversation`       |
| **GET**  | `/conversations/user/:userId` | Get User Chats     | Query: `limit`, `offset` | `Conversation[]`     |
| **POST** | `/messages`                   | Send Message       | `SendMessageDto`         | `Message`            |
| **GET**  | `/conversations/:id/messages` | Get Messages       | Query: `limit`, `before` | `Message[]`          |
| **GET**  | `/unread/:userId`             | Get Unread Count   | -                        | Total count (number) |

---

## 3. Frontend Data Models

Copy these interfaces to `src/types/api.ts` in your frontend project.

```typescript
// Enums
export type UserType = 'Individual' | 'Business';
export type UserRole = 'Buyer' | 'Seller' | 'Admin' | 'Support';
export type BusinessType =
  | 'SoleProprietor'
  | 'Partnership'
  | 'Corporation'
  | 'LLC';
export type ListingType = 'Auction' | 'Fixed' | 'B2BOnly';
export type CustomerType = 'B2C' | 'B2B' | 'Both';
export type OrderStatus =
  | 'Pending'
  | 'AwaitingPayment'
  | 'Paid'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded';

// --- Users ---
export interface User {
  userId: string;
  email: string;
  fullName: string;
  phone?: string | null;
  avatarUrl?: string | null;
  userType: UserType;
  companyId?: string | null;
  role: UserRole;
  verificationStatus: 'Unverified' | 'EmailVerified' | 'IDVerified';
  isActive: boolean;
  lastLogin?: string | null; // ISO Date String
  createdAt: string;
  updatedAt: string;
}

// --- Companies ---
export interface Company {
  companyId: string;
  companyName: string;
  tradingName?: string | null;
  taxId: string;
  businessType: BusinessType;
  industry: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    [key: string]: any;
  };
  contactEmail: string;
  contactPhone: string;
  verificationStatus: 'Pending' | 'Verified' | 'Rejected';
  creditLimit: number;
  creditBalance: number;
  paymentTerms: 'Immediate' | 'Net15' | 'Net30' | 'Net60';
  isActive: boolean;
  createdAt: string;
}

// --- Categories ---
export interface Category {
  categoryId: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
}

// --- Listings ---
export interface Listing {
  listingId: string;
  sellerId: string;
  categoryId: string;
  title: string;
  description: string;
  listingType: ListingType;
  customerType: CustomerType;
  price: number;
  b2bPrice?: number | null;
  minOrderQty: number;
  stockQuantity: number;
  weight?: number | null;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    [key: string]: any;
  } | null;
  mediaUrls: string[];
  specifications?: Record<string, any> | null;
  status: 'Draft' | 'Active' | 'Expired' | 'Sold' | 'Suspended';
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

// --- Orders ---
export interface Order {
  orderId: string;
  orderNumber: string;
  buyerId: string;
  companyId?: string | null;
  orderType: 'B2C' | 'B2B';
  poNumber?: string | null;
  subtotal: number;
  bulkDiscount: number;
  taxAmount: number;
  shippingFee: number;
  platformFee: number;
  totalAmount: number;
  paymentTerms: 'Immediate' | 'Net15' | 'Net30' | 'Net60';
  paymentDueDate?: string | null;
  orderStatus: OrderStatus;
  shippingAddress: Record<string, any>;
  billingAddress: Record<string, any>;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  itemId: string;
  orderId: string;
  listingId: string;
  sellerId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  itemStatus:
    | 'Pending'
    | 'Processing'
    | 'Shipped'
    | 'Delivered'
    | 'Cancelled'
    | 'Refunded';
}

// --- Payments ---
export interface Payment {
  paymentId: string;
  orderId: string;
  transactionRef?: string | null;
  amount: number;
  currency: string;
  escrowStatus: 'Held' | 'Released' | 'Refunded' | 'Disputed';
  paymentMethod: string;
  paymentProvider: string;
  status: 'Pending' | 'Completed' | 'Failed' | 'Refunded' | 'Cancelled';
  createdAt: string;
}
```

## 4. Ant Design Compatibility Guide

### Table Data Sources

For the "All Items" pages, the API returns flat arrays.

- **Users Table**: `dataSource={users}` (where `users` is `User[]`)
- **Listings Table**: `dataSource={listings}` (where `listings` is `Listing[]`)
- **Orders Table**: `dataSource={orders}` (where `orders` is `Order[]`)

### Form Initial Values

When creating or editing, use these payload interfaces.

**Create Listing (Form)**

```typescript
interface CreateListingFormValues {
  title: string; // <Input />
  description: string; // <Input.TextArea />
  price: number; // <InputNumber />
  categoryId: string; // <Select /> mapped from categories array
  listingType: ListingType; // <Select />
  mediaUrls: string[]; // <Upload />
}
```

**Create Order (Form)**

```typescript
interface CreateOrderFormValues {
  items: { listingId: string; quantity: number }[]; // <Form.List />
  shippingAddress: any;
  billingAddress: any;
  paymentTerms?: string;
}
```
