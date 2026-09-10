# Zain Real Estate Admin Panel

Complete admin panel for managing property listings (projects) with full CRUD capabilities.

## Features

✅ **Create Projects** - Add new property listings with all details
✅ **Edit Projects** - Update existing projects
✅ **Delete Projects** - Remove projects from the database
✅ **Admin Authentication** - Simple password-based login
✅ **Bilingual Support** - English and Urdu descriptions and features
✅ **Gallery Management** - Multiple images per property
✅ **Type Management** - Support for Plot, House, Shop, Commercial
✅ **Purpose Management** - Sale, Rent, Booking

## Admin Panel Structure

```
/admin
├── index.tsx          # Dashboard & Projects List
└── projects/
    ├── new.tsx        # Create New Project
    └── $id.tsx        # Edit Project
```

## Components

### AdminLogin
- Simple password-based authentication
- Stores auth token in localStorage
- Component: `src/components/AdminLogin.tsx`

### AdminProjectsList
- Display all projects in a table
- Edit and delete buttons
- Quick add new project link
- Component: `src/components/AdminProjectsList.tsx`

### AdminProjectForm
- Comprehensive form for creating/editing projects
- Fields for English and Urdu content
- Dynamic arrays for features and gallery images
- Component: `src/components/AdminProjectForm.tsx`

## Server Functions

All database operations in `src/server/projects.ts`:

```typescript
// Fetch all projects
await fetchProjects()

// Create new project
await createProject(projectData)

// Update existing project
await updateProject(projectId, updatedData)

// Delete project
await deleteProject(projectId)

// Get single project by slug
await getProjectBySlug(slug)
```

## Usage Guide

### 1. Access Admin Panel
```
http://localhost:5173/admin
```

### 2. Login
- Enter the admin password from `.env.local`
- Password is stored in localStorage for the session

### 3. Create Project
- Click "New Project" button
- Fill in all required fields:
  - **Slug**: Unique URL-friendly identifier
  - **Title**: Project name
  - **Type**: Plot / House / Shop / Commercial
  - **Purpose**: Sale / Rent / Booking
  - **Location**: Project location
  - **Area**: Property size (e.g., "400 sq yd")
  - **Price**: Price or demand (e.g., "Demand: 7 Crore")
  - **Main Image**: Primary image URL
  - **Gallery**: Additional images (add multiple)
  - **Features (English)**: List of features
  - **Features (Urdu)**: اردو میں خصوصیات
  - **Description (English)**: Full description
  - **Description (Urdu)**: اردو میں تفصیل

### 4. Edit Project
- Click the edit icon next to a project
- Modify any details
- Click "Update Project"

### 5. Delete Project
- Click the trash icon next to a project
- Confirm deletion

### 6. Logout
- Click "Logout" button in header
- Clears authentication token

## Field Reference

### Type
- **Plot**: Land/plot for sale
- **House**: Residential house
- **Shop**: Commercial shop
- **Commercial**: Commercial building/office

### Purpose
- **Sale**: Property for sale
- **Rent**: Property for rent
- **Booking**: New project booking/pre-launch

## Data Structure

Each project is stored with this structure:

```typescript
type Listing = {
  id?: string                    // UUID (auto-generated)
  slug: string                   // Unique identifier
  title: string                  // Project name
  type: 'Plot' | 'House' | 'Shop' | 'Commercial'
  purpose: 'Sale' | 'Rent' | 'Booking'
  location: string               // Location
  area: string                   // Size (e.g., "400 sq yd")
  price: string                  // Price or demand
  image: string                  // Main image URL
  gallery: string[]              // Additional images
  features: string[]             // English features
  featuresUrdu?: string[]        // Urdu features
  description: string            // English description
  descriptionUrdu?: string       // Urdu description
  created_at?: string            // Creation timestamp
  updated_at?: string            // Update timestamp
}
```

## Integration with Frontend

The projects are currently fetched from hardcoded data in `src/lib/site-data.ts`.

To use the admin panel with the frontend:

1. **Update Projects Index Page** (`src/routes/projects.index.tsx`):
```typescript
import { fetchProjects } from '@/server/projects'

const { data: listings } = useQuery({
  queryKey: ['projects'],
  queryFn: () => fetchProjects()
})
```

2. **Update Project Detail Page** (`src/routes/projects.$slug.tsx`):
```typescript
import { getProjectBySlug } from '@/server/projects'

const project = await getProjectBySlug(slug)
```

## Environment Variables

```env
# .env.local

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Admin Authentication
VITE_ADMIN_PASSWORD=your-secure-password
```

## Security Notes

⚠️ **Development Only**: The current password-based authentication is simple and suitable for development.

**For Production**, consider:
- Using Supabase Auth with OAuth (Google, GitHub, etc.)
- Implementing proper user management
- Using Row Level Security (RLS) policies
- Adding role-based access control
- Using environment variables for sensitive data

## Common Tasks

### Add Image Upload Support
Integrate Supabase Storage:
```typescript
const { data, error } = await supabase.storage
  .from('projects')
  .upload(`${Date.now()}-image.jpg`, file)
```

### Filter Projects by Type/Purpose
Update server functions to add filtering:
```typescript
export const fetchProjectsByType = createServerFn(
  'GET',
  async (type: string) => {
    return await supabase
      .from('projects')
      .select('*')
      .eq('type', type)
  }
)
```

### Add Project Statistics
Create a statistics dashboard:
```typescript
const stats = {
  total: projects.length,
  forSale: projects.filter(p => p.purpose === 'Sale').length,
  forRent: projects.filter(p => p.purpose === 'Rent').length,
  byType: groupBy(projects, 'type')
}
```

## Troubleshooting

**Q: Projects not showing in admin panel?**
A: Make sure Supabase is configured correctly and the table exists.

**Q: Can't create projects?**
A: Check that RLS policies allow writes and Supabase credentials are correct.

**Q: Images not loading?**
A: Use absolute URLs (starting with http/https) for image fields.

**Q: Urdu text not displaying?**
A: Ensure your font supports Urdu characters. Add to CSS:
```css
body {
  font-family: 'Segoe UI', Tahoma, Geneva, sans-serif;
}
```

## Support

For issues or questions:
1. Check ADMIN_SETUP.md for Supabase configuration
2. Review error messages in browser console
3. Verify environment variables are loaded
4. Check Supabase dashboard for table/policy issues
