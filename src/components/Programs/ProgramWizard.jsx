// Compact wrapper — redirects to the full editor
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function ProgramWizard() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/programlar/olustur', { replace: true });
  }, [navigate]);
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#14B8A6]/30 border-t-[#14B8A6] animate-spin" />
    </div>
  );
}
