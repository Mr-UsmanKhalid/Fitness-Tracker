import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, Loader2, KeyRound } from 'lucide-react';
import { changePassword, clearPasswordError } from '../../redux/slices/userSlice';
import { toast } from '../../utils/toast';

const inputClass =
  'w-full px-3 py-2 pr-10 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all';

const PasswordField = ({ label, value, onChange, show, onToggleShow, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClass}
        required
      />
      <button
        type="button"
        onClick={onToggleShow}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  </div>
);

const ChangePassword = () => {
  const dispatch = useDispatch();
  const { passwordLoading, passwordError } = useSelector((state) => state.user);

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [visibility, setVisibility] = useState({ current: false, next: false, confirm: false });
  const [formError, setFormError] = useState(null);

  const handleField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    dispatch(clearPasswordError());

    if (form.newPassword.length < 8) {
      setFormError('New password must be at least 8 characters.');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setFormError('New passwords do not match.');
      return;
    }

    const result = await dispatch(
      changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      })
    );

    if (changePassword.fulfilled.match(result)) {
      toast.success('Password updated successfully.');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5 sm:p-6 space-y-4"
    >
      <div className="flex items-center gap-2 mb-1">
        <KeyRound size={16} className="text-gray-400 dark:text-gray-500" />
        <h3 className="text-sm font-semibold text-black dark:text-white">Change Password</h3>
      </div>

      {(formError || passwordError) && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm rounded-lg px-4 py-3">
          {formError || passwordError}
        </div>
      )}

      <PasswordField
        label="Current password"
        value={form.currentPassword}
        onChange={handleField('currentPassword')}
        show={visibility.current}
        onToggleShow={() => toggleVisibility('current')}
      />
      <PasswordField
        label="New password"
        value={form.newPassword}
        onChange={handleField('newPassword')}
        show={visibility.next}
        onToggleShow={() => toggleVisibility('next')}
        placeholder="At least 8 characters"
      />
      <PasswordField
        label="Confirm new password"
        value={form.confirmPassword}
        onChange={handleField('confirmPassword')}
        show={visibility.confirm}
        onToggleShow={() => toggleVisibility('confirm')}
      />

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={passwordLoading}
          className="flex items-center gap-2 px-5 py-2 bg-lime-400 text-black font-semibold rounded-lg hover:bg-lime-300 disabled:opacity-60 transition-colors"
        >
          {passwordLoading && <Loader2 size={15} className="animate-spin" />}
          Update Password
        </button>
      </div>
    </form>
  );
};

export default ChangePassword;