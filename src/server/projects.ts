import { createServerFn } from '@tanstack/react-start'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Listing } from '@/lib/supabase'
import { listings as fallbackListings } from '@/lib/site-data'

// Fetch all projects
export const fetchProjects = createServerFn(
  'GET',
  async (): Promise<Listing[]> => {
    try {
      console.log('[SERVER] fetchProjects called')
      console.log('[SERVER] isSupabaseConfigured:', isSupabaseConfigured())
      
      // If Supabase is not configured, return fallback data
      if (!isSupabaseConfigured()) {
        console.log('[SERVER] Returning fallback listings')
        return fallbackListings as Listing[]
      }

      console.log('[SERVER] Querying Supabase...')
      const { data, error } = await supabase!
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('[SERVER] Supabase error:', error.message)
        // Fallback to hardcoded data if there's an error
        return fallbackListings as Listing[]
      }

      console.log('[SERVER] Got data from Supabase:', data)
      return data || []
    } catch (err) {
      console.error('[SERVER] Exception in fetchProjects:', err)
      return fallbackListings as Listing[]
    }
  }
)

// Create new project
export const createProject = createServerFn(
  'POST',
  async (project: Omit<Listing, 'id' | 'created_at' | 'updated_at'>) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set environment variables.')
    }

    const { data, error } = await supabase!
      .from('projects')
      .insert([project])
      .select()

    if (error) {
      throw new Error(`Failed to create project: ${error.message}`)
    }

    return data?.[0] || null
  }
)

// Update project
export const updateProject = createServerFn(
  'PUT',
  async (
    id: string,
    project: Partial<Listing>
  ) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set environment variables.')
    }

    const { data, error } = await supabase!
      .from('projects')
      .update({
        ...project,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()

    if (error) {
      throw new Error(`Failed to update project: ${error.message}`)
    }

    return data?.[0] || null
  }
)

// Delete project
export const deleteProject = createServerFn(
  'DELETE',
  async (id: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set environment variables.')
    }

    const { error } = await supabase!
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete project: ${error.message}`)
    }

    return true
  }
)

// Get single project by slug
export const getProjectBySlug = createServerFn(
  'GET',
  async (slug: string): Promise<Listing | null> => {
    // If Supabase is not configured, search in fallback data
    if (!isSupabaseConfigured()) {
      return fallbackListings.find((l) => l.slug === slug) as Listing || null
    }

    const { data, error } = await supabase!
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "no rows found" - that's okay
      console.error('Supabase error:', error.message)
      // Fallback to hardcoded data
      return fallbackListings.find((l) => l.slug === slug) as Listing || null
    }

    return data || null
  }
)
