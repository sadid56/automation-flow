# Message Mind - Automation Flow

This project consists of a client-side application built with Next.js and a server-side API built with Express and TypeScript.

## Project Structure

- `client/`: Next.js frontend application.
- `server/`: Express backend API.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [pnpm](https://pnpm.io/installation) (v10 or higher recommended)

---

## Server Setup

1. **Navigate to the server directory:**

   ```bash
   cd server
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the `server` directory and copy the contents from `.env.example`:

   ```bash
   cp .env.example .env
   ```

   Fill in the required values in `.env`:
   - `PORT`: Port number for the server (default: 5001).
   - `MONGODB_URI`: Your MongoDB connection string.
   - `GOOGLE_APP_EMAIL`: Your Google App Email for Nodemailer.
   - `GOOGLE_APP_PASSWORD`: Your Google App Password for Nodemailer.

4. **Run the server:**
   - Development mode (with nodemon):
     ```bash
     pnpm dev
     ```
   - Build for production:
     ```bash
     pnpm build
     ```
   - Start production server:
     ```bash
     pnpm start
     ```

---

## Client Setup

1. **Navigate to the client directory:**

   ```bash
   cd client
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Run the client:**
   - Development mode:
     ```bash
     pnpm dev
     ```
   - Build for production:
     ```bash
     pnpm build
     ```
   - Start production server:
     ```bash
     pnpm start
     ```

---

## Tech Stack

### Client

- Next.js 15
- React 19
- Tailwind CSS 4
- TypeScript
- TanStack Query
- React Hook Form + Zod
- Shadcn UI

### Server

- Node.js
- Express
- TypeScript
- MongoDB (Mongoose)
- Nodemailer
- Nodemon
- ESLint + Prettier
