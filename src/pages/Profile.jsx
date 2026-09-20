import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, clearProfileError } from '../redux/slices/userSlice';
import ProfileCard from '../components/profile/ProfileCard';
import ProfileForm from '../components/profile/ProfileForm';
import ChangePassword from '../components/profile/ChangePassword';
import { toast } from '../utils/toast';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { updateLoading, error } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = async (profileData) => {
    dispatch(clearProfileError());
    const result = await dispatch(updateProfile(profileData));
    if (updateProfile.fulfilled.match(result)) {
      toast.success('Profile updated successfully.');
      setIsEditing(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black dark:text-white">Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your personal information and account security.
        </p>
      </div>

      {isEditing ? (
        <>
          <ProfileForm
            user={user}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            loading={updateLoading}
            error={error}
          />
        </>
      ) : (
        <ProfileCard user={user} onEdit={() => setIsEditing(true)} />
      )}

      <ChangePassword />
    </div>
  );
};

export default Profile;