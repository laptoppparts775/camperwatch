'use client'
import { Share2, Twitter, Facebook, Link2, Check } from 'lucide-react'
import { useState } from 'react'

export default function ShareButtons({ title, url, description }: { title: string; url: string; description: string }) {
  const [copied, setCopied] = useState(false)
  const encoded = encodeURIComponent(url)
  const text = encodeURIComponent(`${title} — ${description}`)

  const copyLink = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const nativeShare = async () => {
    if (navigator.share) {
      await navigator.share({ title, text: description, url })
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-gray-500 font-medium">Share:</span>

      {/* Native share (mobile) */}
      <button onClick={nativeShare} className="md:hidden flex items-center gap-1.5 bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
        <Share2 size={12} /> Share
      </button>

      {/* Twitter/X */}
      <a href={`https://twitter.com/intent/tweet?text=${text}&url=${encoded}`} target="_blank" rel="noopener noreferrer"
        className="hidden md:flex items-center gap-1.5 bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors">
        <Twitter size={12} /> X
      </a>

      {/* Facebook */}
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`} target="_blank" rel="noopener noreferrer"
        className="hidden md:flex items-center gap-1.5 bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
        <Facebook size={12} /> Facebook
      </a>

      {/* Copy link */}
      <button onClick={copyLink}
        className="flex items-center gap-1.5 border border-gray-200 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
        {copied ? <><Check size={12} className="text-green-600" /> Copied!</> : <><Link2 size={12} /> Copy link</>}
      </button>
    </div>
  )
}
