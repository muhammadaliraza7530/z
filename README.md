# Aspiring

Hi

This project was built with [Lovable](https://lovable.dev).

## 📱 Zain Real Estate Website with Admin Panel

A modern real estate website for Zain Real Estate in Sukkur with a complete admin panel for managing property listings.

### Features:
- 🏡 Property showcase with beautiful UI
- 📱 Responsive design for all devices
- 🌍 Bilingual support (English & Urdu)
- 👨‍💼 Admin panel for managing projects
- 🔐 Secure authentication
- 💾 Supabase database integration
- 🎨 Modern Tailwind UI components

### Quick Links:
- 🌐 **Website**: `http://localhost:5173`
- 👨‍💼 **Admin Panel**: `http://localhost:5173/admin`
- 📋 **Admin Setup**: Read `ADMIN_COMPLETE.md`
- 🚀 **Quick Start**: Read `ADMIN_QUICK_START.md`

---

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a4700879-b028-43fa-a729-a4c5fe966e84).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## 👨‍💼 Admin Panel Setup

The admin panel allows you to manage all property listings directly from the web interface.

### 5-Minute Setup:

1. **Create Supabase Account** (free at https://supabase.com)
2. **Get Credentials** from Settings > API
3. **Create `.env.local`**:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-key
   VITE_ADMIN_PASSWORD=admin123
   ```
4. **Create Database** (Run SQL in Supabase):
   See `ADMIN_QUICK_START.md` for the SQL query
5. **Start Server**: `npm run dev`
6. **Access Admin**: `http://localhost:5173/admin`

### Admin Features:
- ✅ Create projects (post properties)
- ✅ Edit existing projects
- ✅ Delete projects
- ✅ Bilingual content (English & Urdu)
- ✅ Image gallery management
- ✅ Live website updates

### Documentation:
- 📖 `ADMIN_QUICK_START.md` - Quick 5-minute setup
- 📖 `ADMIN_SETUP.md` - Detailed Supabase configuration
- 📖 `ADMIN_PANEL.md` - Complete feature documentation
- 📖 `ADMIN_INTEGRATION.md` - Advanced integration guide
- 📖 `ADMIN_COMPLETE.md` - Full implementation summary

---
