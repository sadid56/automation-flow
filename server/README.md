# TS Node Express Starter

A modern, production-ready Express.js server boilerplate written in TypeScript, featuring Prisma ORM, PostgreSQL integration, and enhanced logging.

## ✨ Features

- **Runtime**: Node.js with [pnpm](https://pnpm.io/)
- **Framework**: [Express.js 5](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **ORM**: [Prisma 7](https://www.prisma.io/) with PostgreSQL adapter
- **Logging**: [Morgan](https://github.com/expressjs/morgan) with [Chalk](https://github.com/chalk/chalk) for beautiful colored logs
- **Security**: [Helmet](https://helmetjs.github.io/) and [CORS](https://github.com/expressjs/cors)
- **Development**: [Nodemon](https://nodemon.io/) and [tsx](https://github.com/privatenumber/tsx) for fast reloads

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (`npm install -g pnpm`)
- PostgreSQL database

### Installation

1. **Clone the repository**:

   ```bash
   git clone <your-repository-url>
   cd express-mvc-architecture-with-prisma
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and add your configuration:

   ```env
   PORT=5001
   NODE_ENV=development
   DATABASE_URL="postgresql://user:password@localhost:5432/database_name?schema=public"
   CORS_ORIGIN="*"
   API_VERSION="v1"
   ```

4. **Prisma Setup**:
   Generate the Prisma client:
   ```bash
   pnpm prisma generate
   ```
   _(Optional) Run migrations if you have changes in schema:_
   ```bash
   pnpm prisma migrate dev
   ```

---

## 🛠️ Available Scripts

- `pnpm dev`: Start the development server with hot-reload.
- `pnpm build`: Compile the TypeScript code to JavaScript.
- `pnpm start`: Run the compiled production build.
- `pnpm lint`: Run ESLint to check for code quality.
- `pnpm format`: Format code using Prettier.

---

## 📂 Project Structure

```text
├── prisma/               # Prisma schema and migrations
├── src/
│   ├── config/           # Configuration and environment variables
│   ├── generated/        # Generated Prisma Client
│   ├── lib/              # Library initializations (Prisma client)
│   ├── middlewares/      # Express middlewares (Error handling, etc.)
│   ├── routes/           # API Route definitions
│   ├── app.ts            # Express application setup
│   └── server.ts         # Entry point & server bootstrapping
├── .env                  # Environment variables (git-ignored)
├── .gitignore            # Git ignore file
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

---

## 🔍 Project Analysis

### 1. **Server Bootstrapping (`server.ts`)**

The server uses a clean bootstrapping process with proper handling of:

- **Prisma Connection**: Manually handles `$connect()` and `$disconnect()`.
- **Graceful Shutdown**: Listens for `SIGTERM` and `SIGINT` to close the database connection and server gracefully.
- **Error Handling**: Catches `uncaughtException` and `unhandledRejection` to prevent silent crashes.

### 2. **Application Middleware (`app.ts`)**

- Uses **Helmet** for security headers.
- **CORS** enabled for cross-origin requests.
- **Custom Logging**: Implements a colored logging system using `chalk` and `morgan` that differentiates status codes by color (Green for 2xx, Yellow for 4xx, Red for 5xx).

### 3. **Database Layer (`src/lib/prisma.ts`)**

Uses the `@prisma/adapter-pg` for optimized PostgreSQL connections. The Prisma client is generated into a specific folder (`src/generated/prisma`) to keep the codebase structured.

### 4. **Modern Tooling**

The project uses `tsx` instead of `ts-node` for faster TypeScript execution during development, aligning with modern Node.js standards.
