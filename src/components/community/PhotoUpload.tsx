'use client'
import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Camera, Upload, X, CheckCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface UploadedPhoto {
  url: string
  alt: string
}

export default function PhotoUpload({ campgroundId }: { campgroundId: string }) {
  const [user, setUser] = useState<any>(null)
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: { data: any }) => setUser(data.user))
    fetchApprovedPhotos()
  }, [campgroundId])

  const fetchApprovedPhotos = async () => {
    const { data } = await supabase
      .from('user_images')
      .select('url, alt')
      .eq('campground_id', campgroundId)
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(12)
    if (data) setPhotos(data as UploadedPhoto[])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 5 * 1024 * 1024) {
      setError('Photo must be under 5MB')
      return
    }
    setFile(f)
    setError(null)
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(f)
  }

  const handleUpload = async () => {
    if (!file || !user) return
    setUploading(true)
    setError(null)

    try {
      const ext = file.name.split('.').pop()
      const path = `${campgroundId}/${user.id}-${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('campground-images')
        .upload(path, file, { upsert: false })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('campground-images')
        .getPublicUrl(path)

      await supabase.from('user_images').insert({
        campground_id: campgroundId,
        user_id: user.id,
        url: urlData.publicUrl,
        alt: caption || `Photo of ${campgroundId.replace(/-/g, ' ')}`,
        caption,
        approved: false,
      })

      setSuccess(true)
      setFile(null)
      setPreview(null)
      setCaption('')
      if (fileRef.current) fileRef.current.value = ''
      setTimeout(() => setSuccess(false), 4000)
    } catch (err: any) {
      setError(err.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const clearPreview = () => {
    setFile(null)
    setPreview(null)
    setCaption('')
    setError(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
          <Camera size={15} className="text-green-700" />
          Camper Photos {photos.length > 0 && <span className="text-gray-400 font-normal">({photos.length})</span>}
        </h3>
      </div>

      {/* Approved photos grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {photos.map((p, i) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
              <img src={p.url} alt={p.alt} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* Upload UI */}
      {!user ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-sm text-green-800 mb-2">Sign in to share your photos from this campground</p>
          <Link href="/auth/login" className="text-xs font-semibold text-green-700 underline">Sign in</Link>
        </div>
      ) : success ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-800">Photo submitted! It will appear here after review (usually within 24h).</p>
        </div>
      ) : (
        <div className="border border-dashed border-gray-200 rounded-xl p-4">
          {!preview ? (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full flex flex-col items-center gap-2 py-4 text-gray-400 hover:text-green-600 transition-colors"
            >
              <Upload size={24} />
              <span className="text-xs font-medium">Upload a photo from this campground</span>
              <span className="text-xs text-gray-300">JPG, PNG or WEBP · Max 5MB</span>
            </button>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                <button
                  onClick={clearPreview}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              <input
                type="text"
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Add a caption (optional)"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                {uploading ? 'Uploading...' : 'Submit Photo'}
              </button>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          {error && <p className="text-xs text-red-500 mt-2 text-center">{error}</p>}
        </div>
      )}
    </div>
  )
}
