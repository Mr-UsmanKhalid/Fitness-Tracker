import React from 'react';
import { Mail, Calendar, Edit2 } from 'lucide-react';
import ProfilePicture from './ProfilePicture';

const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });
};

const ProfileCard = ({ user, onEdit }) => {
  const memberSince = formatDate(user?.createdAt);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      {/* Cover */}
      <div className="h-24 sm:h-32 bg-gradient-to-r from-black via-black to-lime-500" />

      <div className="px-4 sm:px-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 sm:-mt-14">
          <ProfilePicture size={96} />

          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white text-sm font-medium rounded-lg hover:border-lime-400 dark:hover:border-lime-400 transition-colors self-start sm:self-auto sm:mb-1"
          >
            <Edit2 size={15} />
            Edit Profile
          </button>
        </div>

        <div className="mt-4">
          <h1 className="text-xl sm:text-2xl font-bold text-black dark:text-white">
            {user?.name || 'User'}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <Mail size={14} />
              <span>{user?.email}</span>
            </div>
            {memberSince && (
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                <span>Member since {memberSince}</span>
              </div>
            )}
          </div>

          {user?.bio && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">{user.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;