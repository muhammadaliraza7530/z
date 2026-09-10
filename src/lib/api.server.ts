// This file bridges client code to server functions
// It's not in /server/ so it can be safely imported by client components
import { fetchProjects, createProject, updateProject, deleteProject, getProjectBySlug } from '../server/projects'

// Re-export the server functions
// These are createServerFn RPC functions that can be called from client code
export { fetchProjects, createProject, updateProject, deleteProject, getProjectBySlug }
