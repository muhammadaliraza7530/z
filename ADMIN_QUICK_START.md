# Admin Panel - Quick Start Guide

## 5 Minutes Setup

### 1. Create Supabase Account (2 minutes)
- Go to https://supabase.com
- Click "Sign Up"
- Create new project
- Wait for project to be ready

### 2. Get Credentials (1 minute)
- In Supabase: Settings > API
- Copy **Project URL** 
- Copy **anon public key**

### 3. Create `.env.local` File
Create a file named `.env.local` in the project root:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-key-here
VITE_ADMIN_PASSWORD=your-password
```

### 4. Create Database Table (1 minute)
- In Supabase: SQL Editor
- Copy-paste this SQL:

```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  purpose TEXT NOT NULL,
  location TEXT NOT NULL,
  area TEXT NOT NULL,
  price TEXT NOT NULL,
  image TEXT NOT NULL,
  gallery TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  features_urdu TEXT[] DEFAULT '{}',
  description TEXT NOT NULL,
  description_urdu TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON projects FOR ALL USING (true) WITH CHECK (true);
```

- Click **Run**

### 5. Start the App
```bash
npm run dev
```

### 6. Access Admin Panel
- Go to: `http://localhost:5173/admin`
- Enter your password
- Click **New Project** and start adding properties!

---

## That's It! 🎉

You now have a fully functional admin panel for managing projects.

### Next Steps:
1. Create a few test projects
2. See them appear on the main site
3. Update/delete them as needed
4. Read `ADMIN_PANEL.md` for full documentation

### Need Help?
See `ADMIN_SETUP.md` for detailed setup instructions and troubleshooting.
