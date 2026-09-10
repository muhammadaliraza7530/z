import { createFileRoute } from '@tanstack/react-router'
import { AdminProjectForm } from '@/components/AdminProjectForm'
import { useEffect, useState } from 'react'
import { AdminLogin } from '@/components/AdminLogin'
import { getProjectBySlug } from '@/lib/api.server'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/admin/projects/$id')({
  component: EditProjectPage,
})

function EditProjectPage() {
  const { id } = Route.useParams()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    setIsAuthenticated(!!token)
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return

    const loadProject = async () => {
      try {
        const data = await getProjectBySlug({ data: { slug: id } })
        if (!data) {
          setError('Project not found')
        } else {
          setProject(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project')
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [id, isAuthenticated])

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-5 lg:px-8">
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-5 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <AdminProjectForm project={project} />
      </div>
    </div>
  )
}
