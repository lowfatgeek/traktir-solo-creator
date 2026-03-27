# ☕ Traktir Kopi Admin Dashboard

A premium, high-performance donation web application built with **Next.js 15**, **Supabase**, and **Tailwind CSS v4**. This project features a real-time dashboard for managing donations and creating custom reward pages with high-end aesthetics.

## ✨ Key Features

- **🚀 Real-time Dashboard**: Instant updates for donation stats and recent supporters without page refreshes.
- **🎨 Premium UI/UX**: Horizon Ethos design system with dark mode, glassmorphism, and smooth micro-animations.
- **🛠️ Reward Pages CRUD**: Full control to Create, Read, Update, and Delete reward pages.
- **🖼️ Custom Image Support**: Upload optional 4:3 reward images to personalize your supporter's experience.
- **📂 Tab-based Navigation**: Seamlessly switch between Overview, Donations, and Reward Pages.
- **🛡️ Secure Admin Access**: Whitelist-based authentication ensuring only the authorized administrator can manage the system.
- **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop views.

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend/Database**: [Supabase](https://supabase.com/) (Postgres, Auth, Realtime)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: `canvas-confetti`, custom CSS keyframes

## 🚦 Getting Started

### 1. Prerequisites
- Node.js 18.x or later
- A Supabase account and project

### 2. Environment Variables
Create a `.env.local` file in the root directory and add the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_EMAIL=your_admin_email_address
```

### 3. Database Setup
Go to your **Supabase SQL Editor** and run the contents of [`supabase-schema.sql`](./supabase-schema.sql). This will:
- Create `donations` and `custom_pages` tables.
- Enable **Realtime** for donations.
- Configure **RLS (Row Level Security)** to protect your data.

### 4. Installation
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🚀 Deployment

### Deploy to Vercel
1. Push your code to a GitHub repository.
2. Link your repository to a new project on [Vercel](https://vercel.com/).
3. Add the **Environment Variables** (from step 2) in the Vercel project settings.
4. Deploy! 🚀

## 📝 Project Structure
- `/src/app`: Routing and page components.
- `/src/app/admin`: Admin dashboard logic.
- `/src/app/[slug]`: Dynamic reward page rendering.
- `/src/components`: Reusable UI components.
- `/src/lib`: Supabase client configuration.
- `/src/middleware.ts`: Admin route protection.

---

Built with ❤️ by AntiGravity & KelasWFA.
