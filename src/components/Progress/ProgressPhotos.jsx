import { useRef, useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCamera, useHaptics } from '../../hooks/useNative';
import { SlideUp, FadeIn } from '../UI/AnimatedCard.jsx';

const usePhotoStore = create(
  persist(
    (set, get) => ({
      photos: [],
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

function resizeImage(dataUrl, maxPx = 400) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(maxPx / img.width, maxPx / img.height, 1);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.src = dataUrl;
  });
}

export default function ProgressPhotos() {
  const { photos, addPhoto, removePhoto, updateNote } = usePhotoStore();
  const { takePhoto, pickFromGallery, requestPermission, isNative, isLoading } = useCamera();
  const { impact, notification } = useHaptics();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoType, setPhotoType] = useState('front');
  const [photoDate, setPhotoDate] = useState(new Date().toISOString().split('T')[0]);
  const [editNote, setEditNote] = useState({ id: null, text: '' });

  const handleTakePhoto = async () => {
    await requestPermission();
    const dataUrl = await takePhoto();
    if (dataUrl) {
      const resized = await resizeImage(dataUrl);
      addPhoto({
        id: `photo_${Date.now()}`,
        date: photoDate,
        dataUrl: resized,
        type: photoType,
        note: '',
      });
      notification('success');
      setShowAddModal(false);
    }
  };

  const handlePickPhoto = async () => {
    const dataUrl = await pickFromGallery();
    if (dataUrl) {
      const resized = await resizeImage(dataUrl);
      addPhoto({
        id: `photo_${Date.now()}`,
        date: photoDate,
        dataUrl: resized,
        type: photoType,
        note: '',
      });
      notification('success');
      setShowAddModal(false);
    }
  };

  const sortedPhotos = [...photos].sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  );

  const groupedPhotos = sortedPhotos.reduce((acc, photo) => {
    const month = new Date(photo.date).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
    if (!acc[month]) acc[month] = [];
    acc[month].push(photo);
    return acc;
  }, {});

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getMonthDiff = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return Math.abs((d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth()));
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-20">
      <SlideUp>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">📸 İlerleme Fotoğrafları</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#14B8A6] text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 active:scale-95 transition-transform"
          >
            <span>+</span> Ekle
          </button>
        </div>
      </SlideUp>

      {/* Compare Feature */}
      {sortedPhotos.length >= 2 && (
        <SlideUp delay={0.05}>
          <div className="bg-bg-card border border-white/10 rounded-2xl p-4 mb-6">
            <h3 className="text-sm font-semibold text-white mb-3">🔍 Karşılaştır</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {sortedPhotos.slice(0, 5).map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedPhoto?.id === photo.id
                      ? 'border-[#14B8A6]'
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={photo.dataUrl}
                    alt={photo.date}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </SlideUp>
      )}

      {/* Before/After Comparison */}
      {sortedPhotos.length >= 2 && selectedPhoto && (
        <FadeIn>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white">Before / After</h3>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="text-xs text-white/50"
              >
                Kapat
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden">
              <div className="flex">
                <div className="w-1/2 relative">
                  <img
                    src={sortedPhotos[sortedPhotos.length - 1].dataUrl}
                    alt="Before"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-xs text-white/70">Before</p>
                    <p className="text-sm text-white font-medium">
                      {formatDate(sortedPhotos[sortedPhotos.length - 1].date)}
                    </p>
                  </div>
                </div>
                <div className="w-1/2 relative">
                  <img
                    src={sortedPhotos[0].dataUrl}
                    alt="After"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-xs text-[#10B981]">After</p>
                    <p className="text-sm text-white font-medium">
                      {formatDate(sortedPhotos[0].date)}
                    </p>
                  </div>
                </div>
              </div>

              {sortedPhotos.length >= 2 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-bg-card/90 backdrop-blur-sm rounded-full px-4 py-2">
                    <p className="text-sm font-medium text-white">
                      {getMonthDiff(sortedPhotos[sortedPhotos.length - 1].date, sortedPhotos[0].date)} ay fark
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      )}

      {/* Photo Timeline */}
      {sortedPhotos.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedPhotos).map(([month, monthPhotos]) => (
            <div key={month}>
              <SlideUp>
                <h3 className="text-sm font-semibold text-white/50 mb-3">{month}</h3>
              </SlideUp>
              <div className="grid grid-cols-2 gap-3">
                {monthPhotos.map((photo, index) => (
                  <FadeIn key={photo.id} delay={index * 0.05}>
                    <div
                      className="relative rounded-2xl overflow-hidden bg-bg-card border border-white/10"
                      onClick={() => {
                        impact('light');
                        setSelectedPhoto(photo);
                      }}
                    >
                      <img
                        src={photo.dataUrl}
                        alt={photo.date}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <p className="text-xs text-white/70">{formatDate(photo.date)}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          impact('medium');
                          removePhoto(photo.id);
                        }}
                        className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white/70 hover:text-white active:scale-90 transition-transform"
                      >
                        ×
                      </button>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <FadeIn>
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📷</div>
            <h3 className="text-lg font-semibold text-white mb-2">Henüz fotoğraf yok</h3>
            <p className="text-sm text-white/50 mb-4">
              İlerlemeni fotoğraflayarak kaydet
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#14B8A6] text-white px-6 py-3 rounded-xl font-medium active:scale-95 transition-transform"
            >
              İlk fotoğrafı ekle
            </button>
          </div>
        </FadeIn>
      )}

      {/* Full Screen Preview */}
      {selectedPhoto && !showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white text-xl"
            onClick={() => setSelectedPhoto(null)}
          >
            ×
          </button>
          <img
            src={selectedPhoto.dataUrl}
            alt={selectedPhoto.date}
            className="max-w-full max-h-full rounded-xl"
          />
          <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-xl p-3">
            <p className="text-sm text-white">{formatDate(selectedPhoto.date)}</p>
          </div>
        </div>
      )}

      {/* Add Photo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative bg-bg-card border border-white/10 rounded-t-3xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-white mb-4">📸 Fotoğraf Ekle</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/50 mb-1 block">Tarih</label>
                <input
                  type="date"
                  value={photoDate}
                  onChange={(e) => setPhotoDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-white/50 mb-1 block">Açı</label>
                <div className="grid grid-cols-3 gap-2">
                  {['front', 'side', 'back'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setPhotoType(type)}
                      className={`py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                        photoType === type
                          ? 'bg-[#14B8A6] text-white'
                          : 'bg-white/5 text-white/50'
                      }`}
                    >
                      {type === 'front' ? 'Ön' : type === 'side' ? 'Yan' : 'Arka'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleTakePhoto}
                disabled={isLoading}
                className="w-full py-3 bg-[#14B8A6] rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                📷 Kamera ile Çek
              </button>

              <button
                onClick={handlePickPhoto}
                disabled={isLoading}
                className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white/70 flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                🖼️ Galeriden Seç
              </button>

              <button
                onClick={() => setShowAddModal(false)}
                className="w-full py-2 text-sm text-white/50"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
