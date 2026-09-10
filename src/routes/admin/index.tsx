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
      <header className="border-b bg-card/40">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Zain Real Estate</p>
            <h1 className="mt-1 text-xl font-bold sm:text-2xl">Admin Panel</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-5 py-8 lg:px-8">
        <Suspense fallback={<div>Loading...</div>}>
          <AdminProjectsList />
        </Suspense>
      </main>
    </div>
  )
}
