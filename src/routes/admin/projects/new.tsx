import { createFileRoute } from '@tanstack/react-router'
import { AdminProjectForm } from '@/components/AdminProjectForm'
import { useEffect, useState } from 'react'
import { AdminLogin } from '@/components/AdminLogin'

export const Route = createFileRoute('/admin/projects/new')({
  component: NewProjectPage,
})

function NewProjectPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    const hasToken = !!token
    console.log('[NewProjectPage] auth token check:', hasToken)
    setIsAuthenticated(hasToken)
  }, [])

  console.log('[NewProjectPage] render:', { isAuthenticated })

  if (!isAuthenticated) {
    console.log('[NewProjectPage] showing AdminLogin gate')
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <AdminProjectForm />
      </div>
    </div>
  )
}
