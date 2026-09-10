# Supabase Setup Guide - Zain Real Estate Admin Panel

## Step 1: Create Supabase Account
1. Go to https://supabase.com
2. Sign up for a free account
3. Create a new project

## Step 2: Get Your Credentials
1. Go to **Settings > API** in your Supabase project
2. Copy your **Project URL** and paste it into `.env.local` as `VITE_SUPABASE_URL`
3. Copy your **anon public key** and paste it into `.env.local` as `VITE_SUPABASE_ANON_KEY`

Your `.env.local` should look like:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_ADMIN_PASSWORD=your-secure-password
```

## Step 3: Create Database Table

Go to **SQL Editor** in your Supabase dashboard and run this query:

```sql
-- Create projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Plot', 'House', 'Shop', 'Commercial')),
  purpose TEXT NOT NULL CHECK (purpose IN ('Sale', 'Rent', 'Booking')),
  location TEXT NOT NULL,
  area TEXT NOT NULL,
  price TEXT NOT NULL,
  image TEXT NOT NULL,
  gallery TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  features_urdu TEXT[] DEFAULT '{}',
  description TEXT NOT NULL,
  description_urdu TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX projects_slug_idx ON projects(slug);

-- Enable RLS (Row Level Security) - for now, allow all authenticated users
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- For development, allow all reads
CREATE POLICY "Allow all reads on projects" ON projects
  FOR SELECT USING (true);

-- Allow all writes (in production, restrict this to authenticated admin users)
CREATE POLICY "Allow all writes on projects" ON projects
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all updates on projects" ON projects
  FOR UPDATE USING (true);

CREATE POLICY "Allow all deletes on projects" ON projects
  FOR DELETE USING (true);
```

## Step 4: Test the Connection

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:5173/admin`
3. Enter the admin password from your `.env.local`
4. Create your first project!

## Optional: Migrate Existing Projects

If you want to migrate the existing projects from `site-data.ts`, copy them to the database:

1. Go to **SQL Editor** in Supabase
2. You can insert the existing listings using an INSERT statement

Example:
```sql
INSERT INTO projects (slug, title, type, purpose, location, area, price, image, gallery, features, description)
VALUES 
  ('bungalow-mehran-society', 'Bungalow For Sale — Mehran Society', 'House', 'Sale', 'Mehran Society, Sukkur', '400 sq yd', 'Demand: 7 Crore', '/homes/home-1.jpg', ARRAY['/homes/home-1.jpg', '/homes/hero-courtyard.jpg'], ARRAY['Plot size 400 sq yd', '9 bedrooms', '2 kitchens'], 'A beautiful bungalow...'),
  -- Add more rows for other projects
;
```

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure your `.env.local` file has the correct Supabase credentials
- Restart your dev server after adding environment variables

### "Admin password not configured"
- Add `VITE_ADMIN_PASSWORD` to your `.env.local`

### Database errors
- Check that the table was created successfully in Supabase SQL Editor
- Verify that RLS policies are enabled correctly

## Next Steps

1. **Update Projects Page**: Modify `/src/routes/projects.index.tsx` to fetch from Supabase instead of `site-data.ts`
2. **Update Project Detail Page**: Modify `/src/routes/projects.$slug.tsx` to use the database
3. **Add Image Upload**: Integrate Supabase Storage for uploading images instead of just URLs
4. **Add Authentication**: Implement proper Supabase Auth instead of simple password login
