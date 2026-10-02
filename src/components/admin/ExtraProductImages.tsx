'use client';

import { UploadCloud, X } from 'lucide-react';
import StoreImage from '@/components/ui/StoreImage';

const SLOT_COUNT = 3;

async function fileToDataUrl(file: File): Promise<string> {
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
      // fall through
    }
  }

  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

export function emptyExtraImages(): string[] {
  return Array.from({ length: SLOT_COUNT }, () => '');
}

export function padExtraImages(images?: string[] | null): string[] {
  const slots = emptyExtraImages();
  (images ?? []).slice(0, SLOT_COUNT).forEach((src, index) => {
    slots[index] = String(src ?? '');
  });
  return slots;
}

export default function ExtraProductImages({
  values,
  onChange,
}: {
  values: string[];
  onChange: (next: string[]) => void;
}) {
  const slots = padExtraImages(values);

  const setSlot = (index: number, src: string) => {
    const next = [...slots];
    next[index] = src;
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <div>
        <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider">Additional photos</label>
        <p className="text-[12px] text-[#AFAFAF] mt-1">Optional. Up to 3 more views. Clicking one on the product page shows it as the large photo.</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {slots.map((src, index) => (
          <div key={index} className="space-y-1.5">
            <div
              className="relative aspect-square border-2 border-dashed border-[#EADFD8] bg-[#F8F5F2] rounded-xl flex items-center justify-center text-center cursor-pointer hover:bg-[#EADFD8]/30 transition-colors overflow-hidden"
              onClick={() => document.getElementById(`extra-image-${index}`)?.click()}
            >
              {src ? (
                <>
                  <StoreImage src={src} alt="" fill />
                  <button
                    type="button"
                    aria-label={`Remove extra photo ${index + 1}`}
                    className="absolute top-1.5 right-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-[#7A7A7A] shadow-sm hover:text-[#2B2B2B]"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSlot(index, '');
                    }}
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <div className="px-2">
                  <UploadCloud size={18} className="mx-auto text-[#AFAFAF] mb-1" />
                  <p className="text-[11px] text-[#AFAFAF]">Photo {index + 1}</p>
                </div>
              )}
              <input
                id={`extra-image-${index}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = '';
                  if (!file) return;
                  void fileToDataUrl(file).then((url) => setSlot(index, url)).catch(() => undefined);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
