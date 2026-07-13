'use client';

import { useAdminStore } from '@/lib/adminStore';
import { modal, toast } from '@/lib/uiStore';
import { UploadCloud, Trash2, Image as ImageIcon, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { pickLocalized } from '@/lib/localizedText';

const FALLBACK_GALLERY_IMAGE = '/images/gallery-light-1.png';

function resolveGalleryImageSrc(src?: string): string {
  const val = String(src ?? '').trim();
  if (!val || val.startsWith('blob:')) return FALLBACK_GALLERY_IMAGE;
  if (val.startsWith('data:image/')) {
    if (val.length < 1200) return FALLBACK_GALLERY_IMAGE;
    return val;
  }
  if (val.startsWith('/uploads/')) return val;
  if (/^https?:\/\//i.test(val)) return val;
  if (val.startsWith('/')) return val;
  return `/${val.replace(/^\/+/, '')}`;
}

async function fileToDataUrl(file: File): Promise<string> {
  // Compress large photos so the JSON upload stays reliable.
  if (file.size > 1.5 * 1024 * 1024 && file.type.startsWith('image/')) {
    try {
      const bitmap = await createImageBitmap(file);
      const maxSide = 1800;
      const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
      const width = Math.max(1, Math.round(bitmap.width * scale));
      const height = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas unavailable');
      ctx.drawImage(bitmap, 0, 0, width, height);
      bitmap.close();
      return canvas.toDataURL('image/jpeg', 0.82);
    } catch {
      // fall through to raw FileReader
    }
  }

  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

export default function AdminGalleryPage() {
  const { gallery, addGalleryImage, deleteGalleryImage, reorderGallery } = useAdminStore();
  const [cols, setCols] = useState<1 | 2>(1);
  const [brokenImageIds, setBrokenImageIds] = useState<Record<string, true>>({});
  const [uploading, setUploading] = useState(false);
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void (async () => {
        try {
          setUploading(true);
          const dataUrl = await fileToDataUrl(file);
          await addGalleryImage({
            id: 'gal-' + Math.random().toString(36).substring(2, 9),
            src: dataUrl,
            alt: { hy: 'Պատկերասրահ', en: 'Gallery' },
            cols,
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Upload failed';
          if (message.includes('Invalid or expired token') || message.includes('Missing admin token')) {
            toast.error('Session expired — please log in again');
          } else {
            toast.error(message);
          }
        } finally {
          setUploading(false);
          e.target.value = '';
        }
      })();
    }
  };

  const handleDelete = async (id: string) => {
    if (await modal.confirm('Remove this image from the gallery?', 'Confirm Deletion')) {
      deleteGalleryImage(id);
    }
  };

  const moveImage = async (id: string, direction: -1 | 1) => {
    const index = gallery.findIndex((item) => item.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= gallery.length) return;

    const orderedIds = gallery.map((item) => item.id);
    [orderedIds[index], orderedIds[target]] = [orderedIds[target], orderedIds[index]];

    try {
      setReorderingId(id);
      await reorderGallery(orderedIds);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not reorder images');
    } finally {
      setReorderingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2B2B2B]">Gallery</h1>
          <p className="text-[14px] text-[#7A7A7A] mt-1">Manage inspirational photos and lifestyle imagery shown on the website.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Upload Container */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-[#EADFD8] shadow-sm sticky top-6">
            <h3 className="text-[15px] font-bold text-[#2B2B2B] mb-4 flex items-center gap-2 border-b border-[#EADFD8] pb-4">
              <UploadCloud size={18} className="text-[#E6C97A]" /> Add New Image
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider">Image Layout Span</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCols(1)}
                    className={`flex-1 py-2 text-[12px] font-bold rounded-lg border transition-colors ${cols === 1 ? 'border-[#E6C97A] bg-[#F8F5F2] text-[#2B2B2B]' : 'border-[#EADFD8] text-[#AFAFAF] hover:border-[#D6C3B3]'}`}
                  >
                    1 Column
                  </button>
                  <button 
                    onClick={() => setCols(2)}
                    className={`flex-1 py-2 text-[12px] font-bold rounded-lg border transition-colors ${cols === 2 ? 'border-[#E6C97A] bg-[#F8F5F2] text-[#2B2B2B]' : 'border-[#EADFD8] text-[#AFAFAF] hover:border-[#D6C3B3]'}`}
                  >
                    2 Columns
                  </button>
                </div>
              </div>

              <div 
                className={`border-2 border-dashed border-[#EADFD8] bg-[#F8F5F2] rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group mt-4 h-48 relative ${uploading ? 'pointer-events-none opacity-70' : 'hover:bg-[#EADFD8]/30'}`}
                onClick={() => !uploading && document.getElementById('gallery-upload')?.click()}
              >
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-xl">
                    <Loader2 size={28} className="animate-spin text-[#E6C97A]" />
                  </div>
                )}
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <ImageIcon size={20} className="text-[#AFAFAF] group-hover:text-[#E6C97A] transition-colors" />
                </div>
                <p className="text-[13px] font-medium text-[#2B2B2B]">Click to browse files</p>
                <p className="text-[11px] text-[#AFAFAF] mt-1">Recommended: JPG, WPBP</p>
                <input 
                  id="gallery-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Grid Preview */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-[#EADFD8] shadow-sm min-h-[500px]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EADFD8]">
            <div>
              <h3 className="text-[15px] font-bold text-[#2B2B2B]">Public Grid Preview</h3>
              <p className="text-[12px] text-[#AFAFAF] mt-1">Use the arrows on each image to change order.</p>
            </div>
            <span className="text-[12px] text-[#AFAFAF] bg-[#F8F5F2] px-3 py-1 rounded-full">{gallery.length} Images</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[160px]">
            {gallery.map((img, index) => (
              <div 
                key={img.id} 
                className={`relative rounded-xl overflow-hidden group shadow-sm border border-[#EADFD8] ${img.cols === 2 ? 'col-span-2 row-span-2' : ''}`}
              >
                <Image
                  src={brokenImageIds[img.id] ? FALLBACK_GALLERY_IMAGE : resolveGalleryImageSrc(img.src)}
                  alt={pickLocalized(img.alt, 'hy') || 'Gallery'}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={() => setBrokenImageIds((prev) => ({ ...prev, [img.id]: true }))}
                />
                <div className="absolute inset-0 bg-[#2B2B2B]/0 group-hover:bg-[#2B2B2B]/40 transition-colors duration-300" />

                <div className="absolute top-2 left-2 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    disabled={index === 0 || reorderingId === img.id}
                    onClick={() => void moveImage(img.id, -1)}
                    className="w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-[#2B2B2B] hover:bg-[#E6C97A] disabled:opacity-40 disabled:hover:bg-white/90 backdrop-blur-sm"
                    aria-label="Move left"
                  >
                    {reorderingId === img.id ? <Loader2 size={14} className="animate-spin" /> : <ChevronLeft size={16} />}
                  </button>
                  <button
                    type="button"
                    disabled={index === gallery.length - 1 || reorderingId === img.id}
                    onClick={() => void moveImage(img.id, 1)}
                    className="w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-[#2B2B2B] hover:bg-[#E6C97A] disabled:opacity-40 disabled:hover:bg-white/90 backdrop-blur-sm"
                    aria-label="Move right"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                  <button 
                    onClick={() => handleDelete(img.id)}
                    className="w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors backdrop-blur-sm"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300 delay-75">
                   <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm">
                     <p className="text-[10px] font-bold text-[#2B2B2B] uppercase tracking-wider">
                       #{index + 1} · {img.cols === 2 ? 'Large Tile' : 'Standard Tile'}
                     </p>
                   </div>
                </div>
              </div>
            ))}
            
            {gallery.length === 0 && (
              <div className="col-span-full h-40 border-2 border-dashed border-[#EADFD8] rounded-xl flex items-center justify-center flex-col gap-2 bg-[#F8F5F2] text-[#AFAFAF]">
                <ImageIcon size={32} />
                <p className="text-[13px]">Your gallery is currently empty.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
