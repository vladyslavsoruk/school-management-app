# School Management System

## About the project

A comprehensive **Next.js & Prisma** application backed by **PostgreSQL**, that handles teachers, students, parents, classes, subjects, exams, assignments, attendance, events and announcements. It features role‑based authentication with Clerk, Zod validation, dynamic data fetching (pagination, filters, charts, calendars), CRUD operations via React Hook Form, image uploads with Cloudinary and much more

## Installation

1. Create .env file in the root directory with the following variables:
   `DATABASE_URL=YOUR_DATABASE_LINK`
   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_.....`
   `CLERK_SECRET_KEY=sk_test_.....`
   `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/`
   `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME`
   `NEXT_PUBLIC_CLOUDINARY_API_KEY=YOUR_API_KEY`

2. ```bash
   $ npm i
   $ npx prisma migrate reset
   $ npm run dev
   ```

3. App should be running on `http://localhost:3000`
