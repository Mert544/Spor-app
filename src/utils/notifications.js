import useGamificationStore from '../store/useGamificationStore';
import useChallengeStore from '../store/useChallengeStore';

const NOTIFICATION_TEMPLATES = {
  morning: {
    title: '🔥 Zincirini kırma!',
    body: 'Bugün {streak} günlük serin var. Hadi devam!',
    icon: '/icons/icon-192.png',
  },
  evening: {
    title: '💪 Akşam antrenmanı için hazır mısın?',
    body: 'Bugünkü program seni bekliyor. Sadece 45 dk yeter!',
    icon: '/icons/icon-192.png',
  },
  streak_reminder: {
    title: '⚠️ Dikkat!',
    body: 'Serin tehlikede! Bugün antrenman yap, zinciri kırma.',
    icon: '/icons/icon-192.png',
  },
  streak_broken: {
    title: '💔 Zincir kırıldı...',
    body: 'Ama üzülme! Yarın yeni bir seri başlat. İlk adım en zoru!',
    icon: '/icons/icon-192.png',
  },
  workout_complete: {
    title: '🎉 Harika antrenman!',
    body: '{points} XP kazandın! Seri: {streak} gün',
    icon: '/icons/icon-192.png',
  },
  challenge_complete: {
    title: '🏆 Tebrikler!',
    body: 'Challenge tamamlandı! +{xp} XP',
    icon: '/icons/icon-192.png',
  },
  level_up: {
    title: '🎊 Seviye atladın!',
    body: 'Artık Lv.{level}! Harika ilerleme!',
    icon: '/icons/icon-192.png',
  },
  weekly_summary: {
    title: '📊 Haftalık Özet',
    body: 'Bu hafta {workouts} antrenman, {volume}kg hacim. Devam!',
    icon: '/icons/icon-192.png',
  },
  motivation: {
    title: '💪 Unutma!',
    body: 'Her gün küçük bir adım, büyük sonuçlar getirir.',
    icon: '/icons/icon-192.png',
  },
};

function formatNotification(template, data = {}) {
  let title = template.title;
  let body = template.body;

  Object.entries(data).forEach(([key, value]) => {
    title = title.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    body = body.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  });

  return { title, body };
}

export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('[notifications] Browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export async function showNotification(type, data = {}) {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return null;

  const template = NOTIFICATION_TEMPLATES[type];
  if (!template) {
    console.warn(`[notifications] Unknown notification type: ${type}`);
    return null;
  }

  const { title, body } = formatNotification(template, data);

  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title, {
        body,
        icon: template.icon,
        badge: template.icon,
        tag: `notification-${type}`,
        renotify: true,
        requireInteraction: false,
        silent: false,
      });
    });
  } else {
    new Notification(title, {
      body,
      icon: template.icon,
      tag: `notification-${type}`,
    });
  }
}

export function scheduleNotifications() {
  if (typeof window === 'undefined') return () => {};

  const gamification = useGamificationStore.getState();
  const challenge = useChallengeStore.getState();

  const checkAndNotify = () => {
    const now = new Date();
    const hour = now.getHours();
    const today = now.toISOString().split('T')[0];

    const streak = gamification.streak;
    const lastWorkout = gamification.lastWorkoutDate;

    if (hour === 8) {
      if (streak > 0) {
        showNotification('morning', { streak: streak.toString() });
      }
    }

    if (hour === 18) {
      if (streak >= 3 && lastWorkout !== today) {
        showNotification('streak_reminder', { streak: streak.toString() });
      } else if (lastWorkout !== today) {
        showNotification('evening');
      }
    }

    if (hour === 21) {
      if (streak >= 7) {
        showNotification('motivation');
      }
    }
  };

  const interval = setInterval(checkAndNotify, 60 * 60 * 1000);
  checkAndNotify();

  return () => clearInterval(interval);
}

export function onWorkoutComplete(points, streak) {
  showNotification('workout_complete', {
    points: points.toString(),
    streak: streak.toString(),
  });
}

export function onChallengeComplete(xp) {
  showNotification('challenge_complete', { xp: xp.toString() });
}

export function onLevelUp(level) {
  showNotification('level_up', { level: level.toString() });
}

export function sendWeeklySummary(workouts, volume) {
  showNotification('weekly_summary', {
    workouts: workouts.toString(),
    volume: Math.round(volume / 1000).toString(),
  });
}
