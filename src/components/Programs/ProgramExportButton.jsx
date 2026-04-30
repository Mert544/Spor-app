import useCustomProgramStore from '"'"'../../store/useCustomProgramStore'"'"';
import useAuthStore from '"'"'../../store/useAuthStore'"'"';
import { exportProgram } from '"'"'../../utils/programIO'"'"';
import useSettingsStore from '"'"'../../store/useSettingsStore'"'"';

export default function ProgramExportButton({ programId, className = '"'"''"'"' }) {
  const isPremium = useAuthStore((s) => s.isPremium?.());
  const hasFeature = useAuthStore((s) => s.hasFeature?.('"'"'customPrograms'"'"'));
  const canExport = isPremium?.() || hasFeature?.('"'"'customPrograms'"'"');

  const handleExport = () => {
    if (!canExport) {
      const { setActiveProgram } = useSettingsStore.getState();
      window.location.href = '"'"'/premium'"'"';
      return;
    }
    exportProgram(programId);
  };

  return (
    <button onClick={handleExport} className={className} title="Programı JSON olarak dışa aktar">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    </button>
  );
}
