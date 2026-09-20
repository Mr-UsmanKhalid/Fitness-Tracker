import React, { useState } from 'react';
import { LifeBuoy, Mail, Send, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../config/api';
import { toast } from '../utils/toast';

const CATEGORIES = ['Bug report', 'Feature request', 'Billing', 'Account', 'Other'];
const SUPPORT_EMAIL = 'support@fittrack.app'; // TODO: replace with your real support inbox

const inputClass =
  'w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all';

const Support = () => {
  const [form, setForm] = useState({ category: 'Bug report', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const mailtoHref = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    `[${form.category}] ${form.subject || 'Support request'}`
  )}&body=${encodeURIComponent(form.message)}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.subject.trim() || !form.message.trim()) {
      setError('Please fill in a subject and message.');
      return;
    }

    setLoading(true);
    try {
      // Assumed endpoint - if your backend doesn't have this yet, this call
      // will 404/500 and the form falls back to the "Email us directly" link below.
      await api.post('/support', form);
      setSent(true);
      toast.success('Your message has been sent!');
    } catch (err) {
      setError(
        "We couldn't submit this automatically. Please use the email link below instead."
      );
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-8 text-center">
          <CheckCircle2 size={40} className="text-lime-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-black dark:text-white">Message sent</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Thanks for reaching out — we'll get back to you soon.
          </p>
          <button
            onClick={() => {
              setSent(false);
              setForm({ category: 'Bug report', subject: '', message: '' });
            }}
            className="mt-5 text-sm font-medium text-lime-600 hover:text-lime-500 dark:text-lime-400 dark:hover:text-lime-300 transition-colors"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <LifeBuoy size={22} className="text-black dark:text-white" />
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">Support</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Get help, report a bug, or share feedback.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5 sm:p-6 space-y-4"
      >
        {error && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
          <select value={form.category} onChange={handleField('category')} className={inputClass}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
          <input
            type="text"
            value={form.subject}
            onChange={handleField('subject')}
            placeholder="Briefly describe the issue"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
          <textarea
            value={form.message}
            onChange={handleField('message')}
            placeholder="Tell us more..."
            rows={5}
            className={inputClass}
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          <a
            href={mailtoHref}
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <Mail size={14} />
            Or email us directly
          </a>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-lime-400 text-black font-semibold rounded-lg hover:bg-lime-300 disabled:opacity-60 transition-colors"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
};

export default Support;