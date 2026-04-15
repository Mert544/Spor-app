// Social sharing utility for V-Taper Coach

const APP_URL = import.meta.env.VITE_APP_URL || 'https://vtaper-coach.vercel.app';

export const shareProgress = async (progress) => {
  const { workoutCount, prCount, streak } = progress;

  const text = `🔥 V-Taper Coach ile antrenman yapıyorum!\n\n📊 ${workoutCount || 0} antrenman\n🏆 ${prCount || 0} yeni PR\n🔥 ${streak || 0} gün seri\n\n#VTaperCoach #Fitness`;

  const url = `${APP_URL}/ilerleme`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'V-Taper Coach İlerlemesi',
        text,
        url,
      });
      return true;
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('[share] Share failed:', err);
      }
    }
  }

  copyToClipboard(`${text}\n\n${url}`);
  return true;
};

export const shareAchievement = async (achievement) => {
  const { title, description, icon } = achievement;

  const text = `🏆 ${icon || '🎉'} ${title}\n\n${description}\n\nV-Taper Coach ile ben de hedeflerime ulaşıyorum!\n\n#VTaperCoach #Fitness #Achievement`;

  const url = APP_URL;

  if (navigator.share) {
    try {
      await navigator.share({
        title: `V-Taper Coach - ${title}`,
        text,
        url,
      });
      return true;
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('[share] Share failed:', err);
      }
    }
  }

  copyToClipboard(`${text}\n\n${url}`);
  return true;
};

export const shareWorkout = async (workout) => {
  const { name, exercises, volume } = workout;

  const text = `💪 ${name || 'Antrenman'} tamamlandı!\n\n${exercises?.length || 0} egzersiz\n📦 ${volume || 0}kg toplam hacim\n\n#VTaperCoach #Workout`;

  const url = APP_URL;

  if (navigator.share) {
    try {
      await navigator.share({
        title: `V-Taper Coach - ${name || 'Antrenman'}`,
        text,
        url,
      });
      return true;
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('[share] Share failed:', err);
      }
    }
  }

  copyToClipboard(`${text}\n\n${url}`);
  return true;
};

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    console.log('[share] Copied to clipboard');
  }).catch(() => {
    console.warn('[share] Failed to copy');
  });
}

export const generateShareImage = (progress) => {
  const { workoutCount, streak, totalVolume } = progress;

  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#14B8A6';
  ctx.font = 'bold 48px DM Sans, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('V-Taper Coach', 600, 80);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 120px DM Sans, sans-serif';
  ctx.fillText(`${workoutCount || 0}`, 300, 280);
  ctx.font = '32px DM Sans, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText('Antrenman', 300, 340);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 120px DM Sans, sans-serif';
  ctx.fillText(`${streak || 0}`, 600, 280);
  ctx.font = '32px DM Sans, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText('Gün Serisi', 600, 340);

  ctx.fillStyle = '#E94560';
  ctx.font = 'bold 120px DM Sans, sans-serif';
  ctx.fillText(`${totalVolume || 0}kg`, 900, 280);
  ctx.font = '32px DM Sans, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText('Toplam Hacim', 900, 340);

  return canvas.toDataURL('image/png');
};
