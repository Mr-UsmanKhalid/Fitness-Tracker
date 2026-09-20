import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Camera, Loader2 } from 'lucide-react';
import { uploadProfilePicture } from '../../redux/slices/userSlice';
import { toast } from '../../utils/toast';

const MAX_SIZE_MB = 5;

const ProfilePicture = ({ size = 96 }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const { uploadLoading } = useSelector((state) => state.user);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file.');
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Image must be under ${MAX_SIZE_MB}MB.`);
      return;
    }

    setPreview(URL.createObjectURL(file));

    const result = await dispatch(uploadProfilePicture(file));
    if (uploadProfilePicture.fulfilled.match(result)) {
      toast.success('Profile picture updated!');
    } else {
      toast.error(result.payload || 'Failed to upload picture.');
      setPreview(null);
    }

    e.target.value = '';
  };

  const displayImage = preview || user?.profilePicture;
  const initial = user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="relative inline-block">
      {/* Border matches the card background so the avatar "cuts out" of the cover in both themes */}
      <div
        style={{ width: size, height: size }}
        className="rounded-full bg-lime-400 flex items-center justify-center text-black font-bold overflow-hidden border-4 border-white dark:border-gray-900 shadow-md"
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <span style={{ fontSize: size / 2.5 }}>{initial}</span>
        )}
      </div>

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploadLoading}
        className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-black text-lime-400 flex items-center justify-center border-2 border-white dark:border-gray-900 hover:bg-gray-900 dark:hover:bg-gray-800 transition-colors disabled:opacity-60"
        title="Change profile picture"
      >
        {uploadLoading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Camera size={14} />
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ProfilePicture;