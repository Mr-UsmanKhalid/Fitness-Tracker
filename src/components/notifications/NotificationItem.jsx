import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Target, Apple, Bell, Trophy, Trash2 } from 'lucide-react';

const TYPE_ICONS = {
  workout: Dumbbell,
  goal: Target,
  nutrition: Apple,
  achievement: Trophy,
  reminder: Bell,
};

/* Light: soft pastel chip. Dark: translucent tint so it doesn't glow on gray-900 */
const TYPE_COLORS = {
  workout: 'bg-lime-100 text-lime-700 dark:bg-lime-400/15 dark:text-lime-300',
  goal: 'bg-purple-100 text-purple-700 dark:bg-purple-400/15 dark:text-purple-300',
  nutrition: 'bg-orange-100 text-orange-700 dark:bg-orange-400/15 dark:text-orange-300',
  achievement: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-400/15 dark:text-yellow-300',
  reminder: 'bg-blue-100 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300',
};

const formatRelativeTime = (date) => {
  if (!date) return '';
  const diffMs = Date.now() - new Date(date).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
};

/**
 * notification: { _id, type, title, message, isRead, createdAt, link }
 */
const NotificationItem = ({ notification, onMarkRead, onDelete, compact = false }) => {
  const navigate = useNavigate();

  const type = notification.type || 'reminder';
  const Icon = TYPE_ICONS[type] || Bell;
  const colorClass = TYPE_COLORS[type] || TYPE_COLORS.reminder;

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkRead(notification._id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60 ${
        !notification.isRead ? 'bg-lime-50/50 dark:bg-lime-400/5' : ''
      }`}
    >
      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
        <Icon size={16} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-sm ${
              !notification.isRead
                ? 'font-semibold text-black dark:text-white'
                : 'font-medium text-gray-700 dark:text-gray-300'
            }`}
          >
            {notification.title}
          </p>
          {!notification.isRead && (
            <span className="w-2 h-2 rounded-full bg-lime-500 shrink-0 mt-1.5" />
          )}
        </div>
        {notification.message && (
          <p className={`text-xs text-gray-500 dark:text-gray-400 mt-0.5 ${compact ? 'line-clamp-2' : ''}`}>
            {notification.message}
          </p>
        )}
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>

      {onDelete && !compact && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification._id);
          }}
          className="shrink-0 p-1.5 rounded-md text-gray-400 dark:text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-colors"
          title="Delete notification"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
};

export default NotificationItem;