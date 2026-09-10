import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createProject, updateProject } from '@/lib/api.server'
import type { Listing } from '@/lib/supabase'
import { X, Plus, AlertTriangle } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { isSupabaseConfigured, uploadProjectImage, uploadProjectImages } from '@/lib/supabase'

interface AdminProjectFormProps {
  project?: Listing
}

export function AdminProjectForm({ project }: AdminProjectFormProps) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [type, setType] = useState<'Plot' | 'House' | 'Shop' | 'Commercial'>(project?.type || 'House')
  const [purpose, setPurpose] = useState<'Sale' | 'Rent' | 'Booking'>(project?.purpose || 'Sale')
  const [features, setFeatures] = useState<string[]>(project?.features || [])
  const [featuresUrdu, setFeaturesUrdu] = useState<string[]>(project?.featuresUrdu || [])
  const [gallery, setGallery] = useState<string[]>(project?.gallery || [])
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [featureInput, setFeatureInput] = useState('')
  const [featureUrduInput, setFeatureUrduInput] = useState('')
  const [galleryInput, setGalleryInput] = useState('')
  const isConfigured = isSupabaseConfigured()

  const { register, handleSubmit, formState: { errors } } = useForm<Listing>({
    defaultValues: project || {
      title: '',
      location: '',
      area: '',
      price: '',
      image: '',
      description: '',
      slug: '',
    },
  })

  const onSubmit = async (data: Listing) => {
    setIsLoading(true)
    setError('')

    console.log('[AdminProjectForm] onSubmit started', {
      mode: project?.id ? 'update' : 'create',
      slug: data.slug,
      title: data.title,
      type,
      purpose,
      featureCount: features.length,
      galleryCount: gallery.length,
      isConfigured,
    })

    try {
      let finalImage = data.image || ''
      let finalGallery = [...gallery]

      if (mainImageFile) {
        console.log('[AdminProjectForm] uploading main image from local file:', mainImageFile.name)
        finalImage = await uploadProjectImage(mainImageFile)
      }

      if (galleryFiles.length > 0) {
        console.log('[AdminProjectForm] uploading gallery images from local files:', galleryFiles.length)
        const uploadedGalleryUrls = await uploadProjectImages(galleryFiles)
        finalGallery = [...finalGallery, ...uploadedGalleryUrls]
      }

      const projectData = {
        ...data,
        image: finalImage,
        gallery: finalGallery,
        type,
        purpose,
        features,
        featuresUrdu,
      }

      console.log('[AdminProjectForm] payload ready for server function:', projectData)

      if (project?.id) {
        console.log('[AdminProjectForm] calling updateProject()', { id: project.id })
        const result = await updateProject({ data: { id: project.id, project: projectData } })
        console.log('[AdminProjectForm] updateProject() resolved:', result)
      } else {
        console.log('[AdminProjectForm] calling createProject() async server function with data envelope')
        const result = await createProject({ data: projectData })
        console.log('[AdminProjectForm] createProject() resolved:', result)
      }

      navigate({ to: '/admin' })
    } catch (err) {
      console.error('[AdminProjectForm] submit/create update failed:', err)
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const addFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()])
      setFeatureInput('')
    }
  }

  const addFeatureUrdu = () => {
    if (featureUrduInput.trim()) {
      setFeaturesUrdu([...featuresUrdu, featureUrduInput.trim()])
      setFeatureUrduInput('')
    }
  }

  const addGallery = () => {
    if (galleryInput.trim()) {
      setGallery([...gallery, galleryInput.trim()])
      setGalleryInput('')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{project ? 'Edit Project' : 'Create New Project'}</CardTitle>
          <CardDescription>
            {project ? 'Update project details' : 'Add a new property listing'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isConfigured && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Supabase is not configured. Set up Supabase to save projects. See ADMIN_SETUP.md for instructions.
              </AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4 border-b pb-6">
              <h3 className="font-semibold">Basic Information</h3>

              <div className="grid gap-4">
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    placeholder="e.g., bungalow-mehran-society"
                    {...register('slug', { required: 'Slug is required' })}
                  />
                  {errors.slug && <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>}
                </div>

                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Bungalow For Sale — Mehran Society"
                    {...register('title', { required: 'Title is required' })}
                  />
                  {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={type} onValueChange={(value) => setType(value as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Plot">Plot</SelectItem>
                        <SelectItem value="House">House</SelectItem>
                        <SelectItem value="Shop">Shop</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="purpose">Purpose</Label>
                    <Select value={purpose} onValueChange={(value) => setPurpose(value as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sale">Sale</SelectItem>
                        <SelectItem value="Rent">Rent</SelectItem>
                        <SelectItem value="Booking">Booking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="area">Area</Label>
                    <Input
                      id="area"
                      placeholder="e.g., 400 sq yd"
                      {...register('area', { required: 'Area is required' })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Mehran Society, Sukkur"
                      {...register('location', { required: 'Location is required' })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      placeholder="e.g., Demand: 7 Crore"
                      {...register('price', { required: 'Price is required' })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4 border-b pb-6">
              <h3 className="font-semibold">Images</h3>

              <div className="space-y-2">
                <Label htmlFor="image">Main Image URL</Label>
                <Input
                  id="image"
                  placeholder="https://example.com/image.jpg"
                  {...register('image', { required: 'Main image is required' })}
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setMainImageFile(e.target.files?.[0] ?? null)}
                />
              </div>

              <div>
                <Label>Gallery Images</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter image URL"
                      value={galleryInput}
                      onChange={(e) => setGalleryInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGallery())}
                    />
                    <Button type="button" onClick={addGallery} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setGalleryFiles(Array.from(e.target.files ?? []))}
                    />
                  </div>

                  {gallery.length > 0 && (
                    <div className="space-y-2">
                      {gallery.map((img, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-secondary rounded">
                          <span className="text-sm truncate flex-1">{img}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setGallery(gallery.filter((_, i) => i !== idx))}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-4 border-b pb-6">
              <h3 className="font-semibold">Descriptions</h3>

              <div>
                <Label htmlFor="description">Description (English)</Label>
                <Textarea
                  id="description"
                  placeholder="Enter project description in English"
                  rows={4}
                  {...register('description', { required: 'Description is required' })}
                />
              </div>

              <div>
                <Label htmlFor="descriptionUrdu">Description (Urdu)</Label>
                <Textarea
                  id="descriptionUrdu"
                  placeholder="Enter project description in Urdu"
                  rows={4}
                  {...register('descriptionUrdu')}
                />
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4 border-b pb-6">
              <h3 className="font-semibold">Features</h3>

              <div>
                <Label>Features (English)</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter a feature"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {features.length > 0 && (
                    <div className="space-y-2">
                      {features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-secondary rounded">
                          <span className="text-sm flex-1">{feature}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setFeatures(features.filter((_, i) => i !== idx))}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label>Features (Urdu)</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="اردو میں خصوصیات درج کریں"
                      value={featureUrduInput}
                      onChange={(e) => setFeatureUrduInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeatureUrdu())}
                    />
                    <Button type="button" onClick={addFeatureUrdu} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {featuresUrdu.length > 0 && (
                    <div className="space-y-2">
                      {featuresUrdu.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-secondary rounded">
                          <span className="text-sm flex-1">{feature}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setFeaturesUrdu(featuresUrdu.filter((_, i) => i !== idx))}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading || !isConfigured}>
                {!isConfigured ? 'Configure Supabase First' : isLoading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/admin' })}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
