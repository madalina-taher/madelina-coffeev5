import React, { useState, useRef, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────
//  ImageUploader — Optimized upload pipeline
//
//  Flow:
//    1. User selects photo (any format: JPEG, PNG, HEIC…)
//    2. Canvas compresses to WebP @ 1200px / 85% quality
//    3. Compressed blob → ImgBB API (base64)
//    4. Returns hosted URL, ready for <img> or Next.js <Image>
//
//  Typical result: 4MB iPhone photo → ~150-250KB WebP on ImgBB
// ─────────────────────────────────────────────────────────────

const IMGBB_API_KEY = '4c61de43c0b8a428d9d5c42e9006c051';

interface ImageUploaderProps {
  /** Called with the final hosted URL after successful upload */
  onUpload: (url: string) => void;
  /** Optional: called if upload fails */
  onError?: (error: string) => void;
  /** Max width in pixels (default 1200) */
  maxWidth?: number;
  /** WebP quality 0–1 (default 0.85) */
  quality?: number;
  /** Current image URL (for edit mode) */
  currentImage?: string;
}

interface UploadState {
  status: 'idle' | 'compressing' | 'uploading' | 'success' | 'error';
  preview: string | null;
  message: string;
  originalSize: number;
  compressedSize: number;
}

// ─── Step 2: Client-Side Canvas Compression ──────────────────
function compressToWebP(
  file: File,
  maxWidth: number,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      // Resize while maintaining aspect ratio
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (w > maxWidth) {
        h = Math.round(h * (maxWidth / w));
        w = maxWidth;
      }

      // Draw onto canvas at target dimensions
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context unavailable'));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);

      // Export as WebP blob
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('WebP conversion failed'));
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to read image file'));
    img.src = URL.createObjectURL(file);
  });
}

// ─── Step 3: Upload compressed blob to ImgBB ─────────────────
async function uploadToImgBB(blob: Blob): Promise<string> {
  // Convert blob to base64 (ImgBB accepts base64 in the 'image' field)
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // strip data:image/webp;base64, prefix
    };
    reader.onerror = () => reject(new Error('Failed to read blob'));
    reader.readAsDataURL(blob);
  });

  const formData = new FormData();
  formData.append('image', base64);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    { method: 'POST', body: formData }
  );

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.error?.message || 'ImgBB upload failed');
  }

  // Step 4: Return the hosted URL
  return data.data.url;
}

// ─── Component ───────────────────────────────────────────────
export function ImageUploader({
  onUpload,
  onError,
  maxWidth = 1200,
  quality = 0.85,
  currentImage,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<UploadState>({
    status: 'idle',
    preview: currentImage || null,
    message: '',
    originalSize: 0,
    compressedSize: 0,
  });

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const originalSize = file.size;

      try {
        // ── Step 2: Compress ──
        setState((s) => ({
          ...s,
          status: 'compressing',
          message: 'Compressing image…',
          originalSize,
          compressedSize: 0,
        }));

        const webpBlob = await compressToWebP(file, maxWidth, quality);
        const compressedSize = webpBlob.size;

        // Show local preview instantly (from the compressed blob)
        const previewUrl = URL.createObjectURL(webpBlob);

        setState((s) => ({
          ...s,
          status: 'uploading',
          preview: previewUrl,
          message: `Uploading… (${fmt(originalSize)} → ${fmt(compressedSize)})`,
          compressedSize,
        }));

        // ── Step 3: Upload ──
        const hostedUrl = await uploadToImgBB(webpBlob);

        // Revoke the temporary preview blob
        URL.revokeObjectURL(previewUrl);

        const saved = Math.round((1 - compressedSize / originalSize) * 100);

        setState({
          status: 'success',
          preview: hostedUrl,
          message: `Done! ${fmt(originalSize)} → ${fmt(compressedSize)} (−${saved}%)`,
          originalSize,
          compressedSize,
        });

        // ── Step 4: Return URL to parent ──
        onUpload(hostedUrl);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Upload failed';
        setState((s) => ({
          ...s,
          status: 'error',
          message: msg,
        }));
        onError?.(msg);
      }

      // Reset file input so the same file can be re-selected
      if (inputRef.current) inputRef.current.value = '';
    },
    [maxWidth, quality, onUpload, onError]
  );

  const isWorking = state.status === 'compressing' || state.status === 'uploading';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* File picker + button */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <label
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            border: '1.5px solid #e8e2da',
            cursor: isWorking ? 'wait' : 'pointer',
            fontSize: 13,
            fontWeight: 600,
            opacity: isWorking ? 0.5 : 1,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          📁 {isWorking ? 'En cours…' : 'Choisir une image'}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isWorking}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {/* Status message */}
      {state.message && (
        <div
          style={{
            fontSize: 12,
            color:
              state.status === 'error'
                ? '#e05252'
                : state.status === 'success'
                  ? '#52a060'
                  : '#8a7f74',
          }}
        >
          {state.status === 'compressing' && '⏳ '}
          {state.status === 'uploading' && '⏳ '}
          {state.status === 'success' && '✅ '}
          {state.status === 'error' && '❌ '}
          {state.message}
        </div>
      )}

      {/* Image preview */}
      {state.preview && (
        <img
          src={state.preview}
          alt="Preview"
          style={{
            width: '100%',
            maxHeight: 200,
            objectFit: 'cover',
            borderRadius: 10,
            border: '1px solid #e8e2da',
            opacity: state.status === 'uploading' ? 0.6 : 1,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────
function fmt(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─────────────────────────────────────────────────────────────
//  USAGE EXAMPLE (in any form/page):
//
//  import { ImageUploader } from './ImageUploader';
//
//  function MyForm() {
//    const [imageUrl, setImageUrl] = useState('');
//
//    return (
//      <form>
//        <ImageUploader
//          onUpload={(url) => setImageUrl(url)}
//          onError={(err) => console.error(err)}
//          maxWidth={1200}    // optional, default 1200
//          quality={0.85}     // optional, default 0.85
//          currentImage={existingUrl} // optional, for edit mode
//        />
//
//        {/* The URL is ready for any <img> tag or Next.js <Image>:
//            <Image src={imageUrl} width={800} height={600} alt="..." />
//            OR plain:
//            <img src={imageUrl} loading="lazy" decoding="async" />
//        */}
//      </form>
//    );
//  }
// ─────────────────────────────────────────────────────────────
