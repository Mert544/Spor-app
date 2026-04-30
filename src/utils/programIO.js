import useCustomProgramStore from '"'"'../store/useCustomProgramStore'"'"';
import { toast } from '"'"'../components/UI/Toast'"'"';

const CURRENT_VERSION = '"'"'1.0'"'"';

function validateProgram(data) {
  if (!data || typeof data !== '"'"'object'"'"') return false;
  if (!data.id || typeof data.id !== '"'"'string'"'"') return false;
  if (!data.name || typeof data.name !== '"'"'string'"'"') return false;
  if (!Array.isArray(data.days)) return false;
  return true;
}

export function exportProgram(programId) {
  const store = useCustomProgramStore.getState();
  const program = store.programs[programId];
  if (!program) {
    toast.error('"'"'Program bulunamadı'"'"');
    return;
  }

  const exportData = {
    version: CURRENT_VERSION,
    exportedAt: new Date().toISOString(),
    program: {
      id: program.id,
      name: program.name,
      description: program.description || '"'"''"'"',
      days: program.days || [],
      mesocycle: program.mesocycle || null,
      volumeLandmarks: program.volumeLandmarks || {},
    },
  };

  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: '"'"'application/json'"'"' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('"'"'a'"'"');
  a.href = url;
  a.download = `${program.name.replace(/[^a-zA-Z0-9\u00C0-\u024F\s]/g, '"'"''"'"').replace(/\s+/g, '"'"'-'"'"')}_v${CURRENT_VERSION}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast.success('"'"'Program dışa aktarıldı'"'"');
}

export function importProgram(jsonString) {
  let data;
  try {
    data = JSON.parse(jsonString);
  } catch {
    toast.error('"'"'Geçersiz JSON formatı'"'"');
    return null;
  }

  if (data.version && validateProgram(data.program)) {
    const imported = {
      ...data.program,
      id: data.program.id,
      importedFrom: {
        originalId: data.program.id,
        exportedAt: data.exportedAt,
        version: data.version,
      },
    };
    useCustomProgramStore.getState().addProgram(imported);
    toast.success('"'"'Program içe aktarıldı'"'"');
    return imported;
  }

  const legacyData = data;
  if (legacyData.id && Array.isArray(legacyData.days)) {
    const imported = {
      ...legacyData,
      id: `custom_${Date.now()}`,
      importedFrom: {
        originalId: legacyData.id,
        exportedAt: new Date().toISOString(),
        version: '"'"'legacy'"'"',
      },
    };
    useCustomProgramStore.getState().addProgram(imported);
    toast.success('"'"'Program içe aktarıldı'"'"');
    return imported;
  }

  toast.error('"'"'Program formatı tanınamadı'"'"');
  return null;
}

export function importProgramFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = importProgram(e.target.result);
      resolve(result);
    };
    reader.onerror = () => {
      toast.error('"'"'Dosya okunamadı'"'"');
      reject(new Error('"'"'File read error'"'"'));
    };
    reader.readAsText(file);
  });
}
