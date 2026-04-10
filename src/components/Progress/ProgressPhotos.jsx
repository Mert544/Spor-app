import { useRef, useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Mini store for photos (base64 thumbnails)
const usePhotoStore = create(
  persist(
    (set, get) => ({
      photos: [], // [{id, date, dataUrl, note}]

      addPhoto: (photo) =>
        set(s => ({ photos: [photo, ...s.photos] })),

      removePhoto: (id) =>
        set(s => ({ photos: s.photos.filter(p => p.id !== id) })),

      updateNote: (id, note) =>
        set(s => ({ photos: s.photos.map(p => p.id === id ? { ...p, note } : p) })),
    }),
    { name: 'vtaper-photos' }
  )
);

// Resize image to max 400px and compress as JPEG
function resizeImage(file, maxPx = 400) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(maxPx / img.width, maxPx / img.height, 1);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.65));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function ProgressPhotos() {
  const { photos, addPhoto, removePhoto, updateNote } = usePhotoStore();
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [editNote, setEditNote] = useState({ id: null, text: '' });

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await resizeImage(file);
    addPhoto({
      id: `photo_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      dataUrl,
      note: '',
    });
    e.target.value = '';
  }

  return (
    <div className="space-y-3">
      {/* Add button */}
      <button
        onClick={() => inputRef.current?.click()}
        className="w-full py-4 rounded-2xl border-2 border-dashed border-white/15 text-white/40 text-sm font-medium flex items-center justify-center gap-2 active:border-accent-teal/50 transition-colors"
      >
        <span className="text-xl">📸</span>
        <span>İlerleme Fotoğrafı Ekle</span>
      </button>
      <input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />

      {photos.length === 0 && (
        <p className="text-center text-white/20 text-xs py-4">
          Henüz fotoğraf yok. Haftalık fotoğraf çekerek görsel ilerlemenizi takip edin.
        </p>
      )}

      {/* Full-screen preview */}
      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setPreview(null)}
        >
          <img src={preview} alt="preview" className="max-w-full max-h-full rounded-xl" />
        </div>
      )}

      {/* Photo grid */}
      <div className="grid grid-cols-2 gap-2">
        {photos.map(p => (
          <div key={p.id} className="bg-bg-card rounded-2xl overflow-hidden">
            <img
              src={p.dataUrl}
              alt={p.date}
              className="w-full aspect-square object-cover cursor-pointer"
              onClick={() => setPreview(p.dataUrl)}
            />
            <div className="p-2">
              <p className="text-xs text-white/40 mb-1">{p.date}</p>
              {editNote.id === p.id ? (
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={editNote.text}
                    onChange={e => setEditNote(n => ({ ...n, text: e.target.value }))}
                    onKeyDown={e => {
                      if (e.key === 'Enter') { updateNote(p.id, editNote.text); setEditNote({ id: null, text: '' }); }
                    }}
                    placeholder="Not ekle..."
                    className="flex-1 bg-bg-dark border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => { updateNote(p.id, editNote.text); setEditNote({ id: null, text: '' }); }}
                    className="text-xs text-accent-teal px-1"
                  >✓</button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setEditNote({ id: p.id, text: p.note || '' })}
                    className="text-xs text-white/40 truncate flex-1 text-left"
                  >
                    {p.note || '+ Not ekle'}
                  </button>
                  <button
                    onClick={() => { if (confirm('Fotoğrafı sil?')) removePhoto(p.id); }}
                    className="text-xs text-white/20 ml-2 flex-shrink-0"
                  >✕</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
