import { NOTIFICATION_TYPES } from './constants';

// Human-readable label + Tailwind color per notification type,
// kept in one place so NotificationItem, NotificationDropdown,
// and any future notification UI stay consistent.
export const NOTIFICATION_META = {
  [NOTIFICATION_TYPES.WORKOUT_REMINDER]: {
    label: 'Workout Reminder',
    colorClass: 'text-lime-600',
    bgClass: 'bg-lime-50',
  },
  [NOTIFICATION_TYPES.MEAL_REMINDER]: {
    label: 'Meal Reminder',
    colorClass: 'text-green-600',
    bgClass: 'bg-green-50',
  },
  [NOTIFICATION_TYPES.GOAL_ALERT]: {
    label: 'Goal Alert',
    colorClass: 'text-purple-600',
    bgClass: 'bg-purple-50',
  },
  [NOTIFICATION_TYPES.SYSTEM]: {
    label: 'System',
    colorClass: 'text-gray-600',
    bgClass: 'bg-gray-50',
  },
};

export const getNotificationMeta = (type) =>
  NOTIFICATION_META[type] || NOTIFICATION_META[NOTIFICATION_TYPES.SYSTEM];

// Groups a flat notifications array into { Today, Yesterday, Earlier }
// buckets for display in NotificationList / dropdown.
export const groupNotificationsByDate = (notifications = []) => {
  const groups = { Today: [], Yesterday: [], Earlier: [] };
  const todayStr = new Date().toDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  notifications.forEach((n) => {
    if (!n.createdAt) {
      groups.Earlier.push(n);
      return;
    }
    const d = new Date(n.createdAt);
    if (Number.isNaN(d.getTime())) {
      groups.Earlier.push(n);
      return;
    }
    const dStr = d.toDateString();
    if (dStr === todayStr) groups.Today.push(n);
    else if (dStr === yesterdayStr) groups.Yesterday.push(n);
    else groups.Earlier.push(n);
  });

  return groups;
};

export const countUnread = (notifications = []) =>
  notifications.filter((n) => !n.read).length;