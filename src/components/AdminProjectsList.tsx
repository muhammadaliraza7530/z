import { useSuspenseQuery } from '@tanstack/react-query'
import { fetchProjects, deleteProject } from '@/lib/api.server'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Trash2, Edit2, Plus, AlertTriangle } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useState } from 'react'
import { isSupabaseConfigured } from '@/lib/supabase'

export function AdminProjectsList() {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [actionError, setActionError] = useState('')
  const isConfigured = isSupabaseConfigured()

  const { data: projectsData, refetch, isError, error } = useSuspenseQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        console.log('[AdminProjectsList] invoking fetchProjects() directly')
        const result = await fetchProjects()
        console.log('DEBUG: fetchProjects returned:', result, 'type:', Array.isArray(result) ? 'array' : typeof result)
        return Array.isArray(result) ? result : []
      } catch (err) {
        console.error('ERROR calling fetchProjects:', err)
        throw err
      }
    },
  })

  const projects = Array.isArray(projectsData) ? projectsData.filter((project) => project.id) : []
  
  if (isError) {
    console.error('Query error:', error)
  }

  const handleDelete = async (id: string) => {
    setActionError('')
    try {
      await deleteProject({ data: { id } })
      setDeleteId(null)
      refetch()
    } catch (error) {
      console.error('Failed to delete project:', error)
      setActionError(error instanceof Error ? error.message : 'Failed to delete project')
    }
  }

  return (
    <>
      {!isConfigured && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Supabase is not configured. You're viewing default projects. Set up Supabase to make changes. See ADMIN_SETUP.md for instructions.
          </AlertDescription>
        </Alert>
      )}
      {actionError && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{actionError}</AlertDescription>
        </Alert>
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Link to="/admin/projects/new">
          <Button disabled={!isConfigured}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/30 px-6 py-14 text-center">
          <p className="text-lg font-semibold">No database projects yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Your hardcoded properties are still visible on the public Properties page. Add a project here to manage it from this panel.
          </p>
          <Link to="/admin/projects/new">
            <Button className="mt-6" disabled={!isConfigured}>Create First Project</Button>
          </Link>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>{project.type}</TableCell>
                  <TableCell>{project.purpose}</TableCell>
                  <TableCell>{project.location}</TableCell>
                  <TableCell>{project.price}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Link to={`/admin/projects/${project.id}`}>
                        <Button variant="outline" size="sm" disabled={!isConfigured}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={!isConfigured}
                        onClick={() => setDeleteId(project.id!)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
