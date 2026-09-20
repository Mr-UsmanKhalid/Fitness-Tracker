import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '../../redux/slices/notificationSlice';
import NotificationList from './NotificationList';

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { notifications, unreadCount, loading, error } = useSelector(
    (state) => state.notification
  );

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  const handleDelete = (id) => {
    dispatch(deleteNotification(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const recent = (notifications || []).slice(0, 6);

  return (
    <div className="relative" ref={containerRef}>
      {/* The bell sits on the black header bar in both themes, so it uses the
          same white / lime-on-hover style as the other header buttons in Layout */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-lg text-white hover:text-lime-400 hover:bg-gray-900 transition-colors group"
        title="Notifications"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white dark:bg-gray-900 rounded-lg shadow-lg border-2 border-lime-400 dark:border-lime-500 z-40 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-black">
            <h3 className="text-sm font-bold text-lime-400">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-xs font-medium text-lime-400 hover:text-lime-300 transition-colors"
              >
                <CheckCheck size={13} />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            <NotificationList
              notifications={recent}
              loading={loading}
              error={error}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
              compact
            />
          </div>

          {/* Footer */}
          <button
            onClick={() => {
              setOpen(false);
              navigate('/notifications');
            }}
            className="w-full text-center text-sm font-semibold text-lime-600 hover:text-lime-500 dark:text-lime-400 dark:hover:text-lime-300 transition-colors py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;