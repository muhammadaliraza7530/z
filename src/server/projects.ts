import { createServerFn } from '@tanstack/react-start'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Listing } from '@/lib/supabase'
import { listings as fallbackListings } from '@/lib/site-data'

// Fetch all projects
export const fetchProjects = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Listing[]> => {
    try {
      console.log('[SERVER] fetchProjects called')
      console.log('[SERVER] isSupabaseConfigured:', isSupabaseConfigured())

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
        return fallbackListings as Listing[]
      }

      console.log('[SERVER] Got data from Supabase:', data)
      return Array.isArray(data) ? data : []
    } catch (err) {
      console.error('[SERVER] Exception in fetchProjects:', err)
      return fallbackListings as Listing[]
    }
  }
)

// Create new project
export const createProject = createServerFn({ method: 'POST' }).handler(
  async ({ data }: { data: Omit<Listing, 'id' | 'created_at' | 'updated_at'> }) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set environment variables.')
    }

    const project = data
    const { data: created, error } = await supabase!
      .from('projects')
      .insert([project])
      .select()

    if (error) {
      throw new Error(`Failed to create project: ${error.message}`)
    }

    return created?.[0] || null
  }
)

// Update project
export const updateProject = createServerFn({ method: 'PUT' }).handler(
  async ({ data }: { data: { id: string; project: Partial<Listing> } }) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set environment variables.')
    }

    const { id, project } = data
    const { data: updated, error } = await supabase!
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

    return updated?.[0] || null
  }
)

// Delete project
export const deleteProject = createServerFn({ method: 'DELETE' }).handler(
  async ({ data }: { data: { id: string } }) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set environment variables.')
    }

    const { id } = data
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
export const getProjectBySlug = createServerFn({ method: 'GET' }).handler(
  async ({ data }: { data: { slug: string } }): Promise<Listing | null> => {
    const { slug } = data

    if (!isSupabaseConfigured()) {
      return (fallbackListings.find((l) => l.slug === slug) as Listing) || null
    }

    const { data: row, error } = await supabase!
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Supabase error:', error.message)
      return (fallbackListings.find((l) => l.slug === slug) as Listing) || null
    }

    return row || null
  }
)
