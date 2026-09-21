import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Dumbbell, Apple, User, X } from 'lucide-react';
import {
  searchAll,
  setSearchQuery,
  setSearchFilters,
  clearSearch,
} from '../redux/slices/searchSlice';

const TYPE_TABS = [
  { key: 'all', label: 'All' },
  { key: 'workouts', label: 'Workouts', icon: Dumbbell },
  { key: 'nutrition', label: 'Nutrition', icon: Apple },
  { key: 'users', label: 'Users', icon: User },
];

const CATEGORIES = ['', 'strength', 'cardio', 'hypertrophy', 'powerlifting', 'calisthenics', 'mobility', 'flexibility', 'other'];
const MEAL_TYPES = ['', 'breakfast', 'lunch', 'dinner', 'snack'];

const inputClass =
  'px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all';

/* Shared look for result rows */
const resultCard =
  'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3';

/* User avatar – same logic as Layout.jsx: profile picture, falls back to initial */
const UserAvatar = ({ user, size = 'w-8 h-8', textSize = 'text-sm' }) => {
  const [imageError, setImageError] = useState(false);

  const profilePicture = user?.profilePicture;
  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  // Reset the error flag when the picture URL changes
  useEffect(() => {
    setImageError(false);
  }, [profilePicture]);

  const showImage = profilePicture && !imageError;

  return (
    <div
      className={`${size} ${textSize} rounded-full bg-lime-400 flex items-center justify-center text-black font-bold flex-shrink-0 overflow-hidden`}
    >
      {showImage ? (
        <img
          src={profilePicture}
          alt={`${user?.name || 'User'} profile`}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        initial
      )}
    </div>
  );
};

const Search = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { query, results, filters, total, loading, error } = useSelector(
    (state) => state.search
  );

  const [inputValue, setInputValue] = useState(searchParams.get('q') || '');

  const runSearch = (q, currentFilters) => {
    if (!q.trim()) return;
    dispatch(setSearchQuery(q));
    dispatch(
      searchAll({
        q,
        type: currentFilters.type !== 'all' ? currentFilters.type : undefined,
        category: currentFilters.category || undefined,
        mealType: currentFilters.mealType || undefined,
      })
    );
  };

  // Run search on mount / whenever the URL's ?q= changes (e.g. from the navbar search)
  useEffect(() => {
    const q = searchParams.get('q') || '';
    setInputValue(q);
    if (q.trim()) {
      runSearch(q, filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setSearchParams({ q: inputValue });
  };

  const handleFilterChange = (patch) => {
    const nextFilters = { ...filters, ...patch };
    dispatch(setSearchFilters(patch));
    if (query) runSearch(query, nextFilters);
  };

  const handleClear = () => {
    setInputValue('');
    dispatch(clearSearch());
    setSearchParams({});
  };

  const hasResults =
    (results?.workouts?.length || 0) +
      (results?.nutrition?.length || 0) +
      (results?.users?.length || 0) >
    0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black dark:text-white">Search</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Find workouts, nutrition entries, or other users.
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSubmit} className="relative">
        <SearchIcon
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
        />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search workouts, meals, people..."
          className="w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <X size={16} />
          </button>
        )}
      </form>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 overflow-x-auto -mx-1 px-1">
          {TYPE_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = (filters.type || 'all') === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleFilterChange({ type: tab.key })}
                className={`shrink-0 flex items-center gap-1.5 text-sm font-medium px-3.5 py-1.5 rounded-full border transition-colors ${
                  active
                    ? 'bg-black text-white border-black dark:bg-lime-400 dark:text-black dark:border-lime-400'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-black hover:text-black dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:border-lime-400 dark:hover:text-lime-400'
                }`}
              >
                {Icon && <Icon size={14} />}
                {tab.label}
              </button>
            );
          })}
        </div>

        {(filters.type === 'workouts' || filters.type === 'all') && (
          <select
            value={filters.category || ''}
            onChange={(e) => handleFilterChange({ category: e.target.value })}
            className={`${inputClass} capitalize`}
          >
            <option value="">All categories</option>
            {CATEGORIES.filter(Boolean).map((c) => (
              <option key={c} value={c} className="capitalize">
                {c}
              </option>
            ))}
          </select>
        )}

        {(filters.type === 'nutrition' || filters.type === 'all') && (
          <select
            value={filters.mealType || ''}
            onChange={(e) => handleFilterChange({ mealType: e.target.value })}
            className={`${inputClass} capitalize`}
          >
            <option value="">All meal types</option>
            {MEAL_TYPES.filter(Boolean).map((m) => (
              <option key={m} value={m} className="capitalize">
                {m}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Results */}
      {!query.trim() && (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <SearchIcon size={32} className="mx-auto mb-3" />
          <p className="text-sm">Start typing to search your data.</p>
        </div>
      )}

      {query.trim() && loading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      )}

      {query.trim() && !loading && error && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {query.trim() && !loading && !error && (
        <>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {total} result{total === 1 ? '' : 's'} for "{query}"
          </p>

          {!hasResults ? (
            <div className="text-center py-16 text-gray-400 dark:text-gray-500">
              <p className="text-sm">No results found. Try a different search.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {results.workouts?.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-black dark:text-white mb-2 flex items-center gap-1.5">
                    <Dumbbell size={15} className="text-gray-400 dark:text-gray-500" />
                    Workouts
                  </h2>
                  <div className="space-y-2">
                    {results.workouts.map((w) => (
                      <button
                        key={w._id}
                        onClick={() => navigate(`/workouts/${w._id}`)}
                        className={`w-full text-left ${resultCard} hover:border-lime-400 dark:hover:border-lime-400 transition-colors`}
                      >
                        <p className="text-sm font-medium text-black dark:text-white">{w.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{w.category}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.nutrition?.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-black dark:text-white mb-2 flex items-center gap-1.5">
                    <Apple size={15} className="text-gray-400 dark:text-gray-500" />
                    Nutrition
                  </h2>
                  <div className="space-y-2">
                    {results.nutrition.map((n) => (
                      <button
                        key={n._id}
                        onClick={() => navigate(`/nutrition/${n._id}`)}
                        className={`w-full text-left ${resultCard} hover:border-lime-400 dark:hover:border-lime-400 transition-colors`}
                      >
                        <p className="text-sm font-medium text-black dark:text-white capitalize">
                          {n.mealType}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {n.foods?.map((f) => f.name).join(', ')}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.users?.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-black dark:text-white mb-2 flex items-center gap-1.5">
                    <User size={15} className="text-gray-400 dark:text-gray-500" />
                    Users
                  </h2>
                  <div className="space-y-2">
                    {results.users.map((u) => (
                      <div key={u._id} className={`flex items-center gap-3 ${resultCard}`}>
                        <UserAvatar user={u} size="w-10 h-10" textSize="text-sm" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-black dark:text-white truncate">{u.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{u.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Search;