# Plateform - Complete Project Details

This document provides an end-to-end overview of the Plateform Restaurant OS, detailing the architecture, data flow, features, and future recommendations.

## 1. System Architecture

Plateform operates on a decoupled client-server architecture:
*   **Client (Frontend):** A React-based Single Page Application (SPA) built on Next.js using the App Router. It handles all UI rendering, client-side routing, and state management.
*   **Server (Backend):** A Node.js/Express.js REST API that handles business logic, authentication, and data persistence.
*   **Storage Layer:** Currently utilizes an in-memory object store (`store.js`) to allow for rapid prototyping and zero-dependency setup.

## 2. Directory Structure

```text
Project-Taaza-main/
├── backend/
│   ├── routes/
│   │   ├── analytics.js    # Aggregates KPI data for the dashboard
│   │   ├── auth.js         # Handles customer registration and login
│   │   ├── booking.js      # Manages table reservations
│   │   ├── menu.js         # Serves menu items
│   │   ├── orders.js       # Processes incoming customer orders
│   │   └── upload.js       # Handles Excel file parsing for menu updates
│   ├── server.js           # Express app initialization and route binding
│   └── store.js            # In-memory database (users, orders, bookings, menu)
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── page.js                 # Premium Landing Page
    │   │   ├── globals.css             # Tailwind configuration & base styles
    │   │   ├── dashboard/page.js       # Admin Command Center
    │   │   └── customer/
    │   │       ├── page.js             # Customer Portal (Menu & Reservations)
    │   │       └── auth/page.js        # Customer Login / Signup
    │   └── components/
    │       └── UIComponents.js         # Reusable dashboard UI cards/widgets
```

## 3. Core Workflows

### Authentication Flow
1. A customer visits the portal. If no session exists in `localStorage`, they are redirected to `/customer/auth`.
2. The user registers or logs in. The frontend sends a `POST` request to `/api/auth/register` or `/api/auth/login`.
3. The backend validates the credentials against the in-memory `users` array in `store.js`.
4. On success, the user object is returned and stored in the browser's `localStorage` to persist the session.

### Order Processing & Live Synchronization
1. An authenticated customer adds items to their cart in the Customer Portal and clicks "Place Order".
2. A `POST` request is sent to `/api/orders` containing the customer's name, email, items, and total amount.
3. The backend appends this order to the `orders` array in `store.js` and marks its status as "Pending".
4. Simultaneously, the Admin Dashboard is running a `setInterval` that polls `/api/orders` every 5 seconds.
5. The dashboard fetches the newly updated array and renders the order instantly in the "Live Orders" feed.

### Table Reservations
1. A customer fills out the reservation form (Date, Time, Guests).
2. A `POST` request is sent to `/api/booking`.
3. The backend generates a random table assignment (for demonstration purposes), appends the booking to the `bookings` array, and marks the table status as "reserved".
4. The Admin Dashboard polls `/api/booking` every 5 seconds, updating the "Live Bookings" feed dynamically.

## 4. UI/UX Design System

The application utilizes a sophisticated, high-end "Stone and Amber" aesthetic designed to emulate premium restaurant software.
*   **Colors:** Deep charcoal/stone backgrounds (`bg-stone-900`, `bg-stone-950`) accented with warm amber (`text-amber-500`, `bg-amber-600`) to evoke the feel of a fine-dining bistro.
*   **Typography:** Elegant serif fonts for headings combined with clean sans-serif fonts for data and body text.
*   **Animations:** Powered by Framer Motion. Elements fade and slide in smoothly to create a responsive, tactile feel without being overly flashy.

## 5. API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Creates a new customer account. |
| `POST` | `/api/auth/login` | Authenticates an existing customer. |
| `GET` | `/api/menu` | Retrieves the current restaurant menu. |
| `GET` | `/api/orders` | Retrieves all orders (used by Admin Dashboard). |
| `POST` | `/api/orders` | Submits a new customer order. |
| `GET` | `/api/booking` | Retrieves all table reservations. |
| `POST` | `/api/booking` | Submits a new table reservation. |
| `GET` | `/api/analytics/overview`| Retrieves simulated KPI data and chart metrics. |
| `POST` | `/api/upload/excel` | Uploads an `.xlsx` file to overwrite the menu. |

## 6. Future Enhancements

To take this project to production, the following upgrades are recommended:
1.  **Persistent Database:** Replace `store.js` with PostgreSQL or MongoDB using an ORM like Prisma or Mongoose. This ensures data survives server restarts.
2.  **WebSockets:** Upgrade the 5-second polling mechanism in the Admin Dashboard to WebSockets (e.g., Socket.io) for true instant, bi-directional real-time updates.
3.  **JWT Authentication:** Replace the basic `localStorage` object with HttpOnly cookies and JSON Web Tokens (JWT) for secure, stateless authentication.
4.  **Order Management UI:** Build out interactive buttons on the Admin Dashboard to let staff transition orders from "Pending" -> "Preparing" -> "Completed".
