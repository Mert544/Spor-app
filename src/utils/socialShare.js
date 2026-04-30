export const shareProgress = (stats) => {
  const text = `V-Taper Coach ile ${stats.workoutCount} antrenman, ${stats.prCount} PR kırdım! 💪`;
  const url = window.location.href;

  if (navigator.share) {
    return navigator.share({
      title: '"'"'V-Taper Coach İlerlemesi'"'"',
      text,
      url,
    }).catch(() => {});
  }

  const encoded = encodeURIComponent(text + '" '" + url);
  window.open(`https://twitter.com/intent/tweet?text=${encoded}`, '"'"'_blank'"'"');
};

export const shareWorkout = (programName, dayName) => {
  const text = `Bugün ${programName} - ${dayName} antrenmanını tamamladım! 💪 V-Taper Coach`;
  const encoded = encodeURIComponent(text);
  window.open(`https://twitter.com/intent/tweet?text=${encoded}`, '"'"'_blank'"'"');
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const el = document.createElement('"'"'textarea'"'"');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('"'"'copy'"'"');
    document.body.removeChild(el);
    return true;
  }
};
