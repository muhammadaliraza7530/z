import { createFileRoute } from '@tanstack/react-router'
import { AdminProjectsList } from '@/components/AdminProjectsList'
import { AdminLogin } from '@/components/AdminLogin'
import { useEffect, useState, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    setIsAuthenticated(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Zain Admin Panel</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 lg:px-8 py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <AdminProjectsList />
        </Suspense>
      </main>
    </div>
  )
}
