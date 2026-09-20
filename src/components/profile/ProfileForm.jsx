import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

const inputClass =
  'w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all';

const ProfileForm = ({ user, onSubmit, onCancel, loading = false, error = null }) => {
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });
  const [formError, setFormError] = useState(null);

  const handleField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);

    if (!form.name.trim()) {
      setFormError('Name is required.');
      return;
    }

    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      setFormError('Enter a valid email address.');
      return;
    }

    onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      bio: form.bio.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5 sm:p-6 space-y-4"
    >
      {(formError || error) && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm rounded-lg px-4 py-3">
          {formError || error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Full name
        </label>
        <input
          type="text"
          value={form.name}
          onChange={handleField('name')}
          className={inputClass}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email
        </label>
        <input
          type="email"
          value={form.email}
          onChange={handleField('email')}
          className={inputClass}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Bio
          <span className="text-gray-400 dark:text-gray-500 font-normal"> (optional)</span>
        </label>
        <textarea
          value={form.bio}
          onChange={handleField('bio')}
          placeholder="A short line about your fitness journey..."
          rows={3}
          className={inputClass}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2 bg-lime-400 text-black font-semibold rounded-lg hover:bg-lime-300 disabled:opacity-60 transition-colors"
        >
          {loading && <Loader2 size={15} className="animate-spin" />}
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;