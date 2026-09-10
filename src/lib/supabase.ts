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

export const PROJECT_IMAGE_BUCKET = 'project-images'

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file as data URL'))
    reader.readAsDataURL(file)
  })
}

export async function uploadProjectImage(file: File): Promise<string> {
  if (!supabase) {
    return readFileAsDataUrl(file)
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase()
  const uploadPath = `uploads/${Date.now()}-${Math.round(Math.random() * 100000)}-${safeName}`

  try {
    const { error } = await supabase.storage
      .from(PROJECT_IMAGE_BUCKET)
      .upload(uploadPath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'application/octet-stream',
      })

    if (error) {
      console.warn('[Supabase] Storage upload failed, falling back to data URL:', error.message)
      return readFileAsDataUrl(file)
    }

    const { data: publicUrlData } = supabase.storage
      .from(PROJECT_IMAGE_BUCKET)
      .getPublicUrl(uploadPath)

    return publicUrlData.publicUrl
  } catch (err) {
    console.warn('[Supabase] Storage upload exception, falling back to data URL:', err)
    return readFileAsDataUrl(file)
  }
}

export async function uploadProjectImages(files: File[]): Promise<string[]> {
  return Promise.all(files.map((file) => uploadProjectImage(file)))
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
