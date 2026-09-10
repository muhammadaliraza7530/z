import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Helper to check if URL looks valid (not placeholder/example)
const isValidSupabaseUrl = (url?: string) => {
  if (!url) return false
  // Check if it's a real Supabase URL (has actual project subdomain)
  return url.includes('supabase.co') && !url.includes('your-project')
}

// Create Supabase client only if credentials are valid
// Otherwise, return null for graceful fallback
export const supabase = (isValidSupabaseUrl(supabaseUrl) && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const isSupabaseConfigured = () => {
  return supabase !== null
}

export type Listing = {
  id?: string
  slug: string
  title: string
  type: 'Plot' | 'House' | 'Shop' | 'Commercial'
  purpose: 'Sale' | 'Rent' | 'Booking'
  location: string
  area: string
  price: string
  image: string
  gallery: string[]
  features: string[]
  featuresUrdu?: string[]
  descriptionUrdu?: string
  description: string
  created_at?: string
  updated_at?: string
}
