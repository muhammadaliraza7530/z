// This is a .server.ts file - it's only imported in server contexts
// The "-" prefix excludes it from the route tree
import { fetchProjects, getProjectBySlug } from '@/lib/api.server'

// Re-export for use in loaders
export { fetchProjects }
export { getProjectBySlug as getProjectBySlugFn }
