# Inmemso Architecture Project Summary

## Project Overview
The project named **Inmemso Architecture** appears to be a web application focused on delivering responsive and dynamic content. The architecture utilizes modern web technologies such as React (for frontend development), TypeScript (for type safety), and Prisma (an ORM for database management).

## Folder Structure Overview
- **Root Directory:**
  - Configuration and setup files, such as `package.json`, `.env`, and `README.md`.
  - Directory for `components` housing various React components.
  - `prisma` directory for database models and migrations.
  - Configuration files for tools like Tailwind CSS, Vite, and PostCSS.

## Frontend
1. **Technology Stack:** 
   - React.js with TypeScript.
   - CSS styling with Tailwind CSS.
   - State management is handled by React hooks.

2. **Key Components:**
   - Layout components like `Navbar`, `Footer`, and `Hero`.
   - Project-specific components like `Clients`, `Services`, and `TeamSection`.

3. **Development Instructions:**
   - Clone the repository and navigate into the project folder.
   - Run `npm install` to install dependencies.
   - Start the development server using `npm start` or the provided batch file `start-dev.bat`.

## Backend
1. **Technology Stack:**
   - Node.js for server-side logic.
   - Prisma as an ORM for interfacing with the database.
   - Express.js or a similar framework for handling API requests.

2. **Key Features:**
   - API endpoints for data interaction, referenced in service files within `src/services`.
   - Database schema defined in `schema.prisma` with migrations under `migrations/`.

3. **Development Instructions:**
   - Ensure your database is correctly configured (see `.env` settings).
   - Use `prisma migrate dev` to apply database migrations locally.
   - Start the server using `node server.ts`.

## Production Deployment
1. **Pre-deployment Steps:**
   - Ensure environment variables in `.env` are properly set for production.
   - Run database migrations with `prisma migrate deploy`.
   - Build the application for production using `npm run build`.

2. **Deployment Platforms:**
   - Recommended platforms include Vercel for frontend hosting, Heroku, or DigitalOcean for backend APIs.

3. **Post-deployment:**
   - Monitor and optimize the application, checking server logs and analytics for usage patterns and troubleshooting.

## Final Instructions
- Review local development instructions in the `INSTRUCCIONES_DESARROLLO_LOCAL.md`.
- Refer to the **migration guides** and **backup instructions** as necessary, located in the `prisma` directory.
- Ensure all components are fully functional, tested, and meet the intended use cases before production deployment.