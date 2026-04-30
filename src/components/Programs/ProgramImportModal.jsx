import { useRef } from '"'"'react'"'"';
import { importProgramFromFile } from '"'"'../../utils/programIO'"'"';
import useCustomProgramStore from '"'"'../../store/useCustomProgramStore'"'"';
import useAuthStore from '"'"'../../store/useAuthStore'"'"';

export default function ProgramImportModal({ onClose }) {
  const fileInputRef = useRef(null);
  const hasFeature = useAuthStore((s) => s.hasFeature?.('"'"'customPrograms'"'"'));

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await importProgramFromFile(file);
    if (result) onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-4">
      <div className="glass rounded-2xl p-6 max-w-sm w-full space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">Program İçe Aktar</h3>
          <button onClick={onClose} className="text-white/40 text-lg">✕</button>
        </div>

        <p className="text-sm text-white/60">Daha önce dışa aktardığınız bir program JSON dosyasını yükleyin.</p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-3 rounded-xl bg-[#14B8A6]/20 text-[#14B8A6] font-semibold border border-[#14B8A6]/30 hover:bg-[#14B8A6]/30 transition-colors"
        >
          Dosya Seç ve İçe Aktar
        </button>

        <p className="text-xs text-white/30 text-center">Sadece .json dosyaları kabul edilir</p>
      </div>
    </div>
  );
}
