import { createServerFn } from '@tanstack/react-start'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Listing } from '@/lib/supabase'
import { listings as fallbackListings } from '@/lib/site-data'

const staticListings = fallbackListings as Listing[]

function mergeListings(databaseListings: Listing[]): Listing[] {
  const databaseSlugs = new Set(databaseListings.map((listing) => listing.slug))
  return [...databaseListings, ...staticListings.filter((listing) => !databaseSlugs.has(listing.slug))]
}

function fromDatabaseListing(row: Record<string, unknown>): Listing {
  const { features_urdu, description_urdu, ...listing } = row
  return {
    ...listing,
    ...(features_urdu !== undefined ? { featuresUrdu: features_urdu } : {}),
    ...(description_urdu !== undefined ? { descriptionUrdu: description_urdu } : {}),
  } as Listing
}

function toDatabaseListing(project: Partial<Listing>) {
  const {
    id,
    created_at,
    updated_at,
    featuresUrdu: _featuresUrdu,
    descriptionUrdu: _descriptionUrdu,
    ...listing
  } = project
  return listing
}

export const fetchProjects = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Listing[]> => {
    try {
      if (!isSupabaseConfigured()) {
        return staticListings
      }

      const { data, error } = await supabase!
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('[SERVER] Supabase error:', error.message)
        return fallbackListings as Listing[]
      }

      return Array.isArray(data) ? mergeListings(data.map((row) => fromDatabaseListing(row))) : staticListings
    } catch (err) {
      console.error('[SERVER] Exception in fetchProjects:', err)
      return staticListings
    }
  }
)

export const createProject = createServerFn({ method: 'POST' }).handler(
  async ({ data }: { data: Omit<Listing, 'id' | 'created_at' | 'updated_at'> }) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set environment variables.')
    }

    const project = toDatabaseListing(data)
    const { data: created, error } = await supabase!
      .from('projects')
      .insert([project])
      .select()

    if (error) {
      throw new Error(`Failed to create project: ${error.message}`)
    }

    return created?.[0] ? fromDatabaseListing(created[0]) : null
  }
)

export const updateProject = createServerFn({ method: 'POST' }).handler(
  async ({ data }: { data: { id: string; project: Partial<Listing> } }) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set environment variables.')
    }

    const { id, project } = data
    const { data: updated, error } = await supabase!
      .from('projects')
      .update({
        ...toDatabaseListing(project),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()

    if (error) {
      throw new Error(`Failed to update project: ${error.message}`)
    }

    if (!updated?.[0]) {
      throw new Error('Failed to update project: no matching database project was found.')
    }

    return fromDatabaseListing(updated[0])
  }
)

export const deleteProject = createServerFn({ method: 'POST' }).handler(
  async ({ data }: { data: { id: string } }) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set environment variables.')
    }

    const { id } = data
    const { data: deleted, error } = await supabase!
      .from('projects')
      .delete()
      .eq('id', id)
      .select('id')

    if (error) {
      throw new Error(`Failed to delete project: ${error.message}`)
    }

    if (!deleted?.length) {
      throw new Error('Failed to delete project: no matching database project was found.')
    }

    return true
  }
)

export const getProjectBySlug = createServerFn({ method: 'GET' }).handler(
  async ({ data }: { data: { slug: string } }): Promise<Listing | null> => {
    const { slug } = data

    if (!isSupabaseConfigured()) {
      return staticListings.find((l) => l.slug === slug) || null
    }

    const { data: row, error } = await supabase!
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Supabase error:', error.message)
      return staticListings.find((l) => l.slug === slug) || null
    }

    return row ? fromDatabaseListing(row) : staticListings.find((l) => l.slug === slug) || null
  }
)

export const getProjectById = createServerFn({ method: 'GET' }).handler(
  async ({ data }: { data: { id: string } }): Promise<Listing | null> => {
    if (!isSupabaseConfigured()) {
      return null
    }

    const { data: row, error } = await supabase!
      .from('projects')
      .select('*')
      .eq('id', data.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to load project: ${error.message}`)
    }

    return row ? fromDatabaseListing(row) : null
  }
)
