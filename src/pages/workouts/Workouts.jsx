import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { fetchWorkouts, deleteWorkout } from '../../redux/slices/workoutSlice';
import WorkoutSearch from '../../components/workout/WorkoutSearch';
import WorkoutFilter from '../../components/workout/WorkoutFilter';
import WorkoutList from '../../components/workout/WorkoutList';

const Workouts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { workouts: rawWorkouts, loading, error } = useSelector((state) => state.workout);
  const workouts = rawWorkouts || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    dispatch(fetchWorkouts());
  }, [dispatch]);

  const allTags = useMemo(() => {
    const tagSet = new Set();
    workouts.forEach((w) => w.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [workouts]);

  const filteredWorkouts = useMemo(() => {
    return workouts.filter((workout) => {
      const matchesSearch = workout.name
        ?.toLowerCase()
        .includes(searchQuery.trim().toLowerCase());

      const matchesCategory =
        category === 'all' ||
        workout.category?.toLowerCase() === category.toLowerCase();

      const matchesTag = !selectedTag || workout.tags?.includes(selectedTag);

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [workouts, searchQuery, category, selectedTag]);

  const handleDelete = (id) => {
    dispatch(deleteWorkout(id));
  };

  const hasFilters = Boolean(searchQuery || category !== 'all' || selectedTag);

  const clearFilters = () => {
    setSearchQuery('');
    setCategory('all');
    setSelectedTag('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page header: stays on one row, even on phones, to save vertical space */}
      <div className="flex items-start justify-between gap-3 mb-5 sm:mb-6">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-black dark:text-white">Workouts</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {hasFilters
              ? `Showing ${filteredWorkouts.length} of ${workouts.length}`
              : `${workouts.length} workout${workouts.length === 1 ? '' : 's'} logged`}
          </p>
        </div>
        <button
          onClick={() => navigate('/workouts/create')}
          className="flex-shrink-0 flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2.5 bg-lime-400 text-black text-sm font-semibold rounded-lg hover:bg-lime-300 transition-colors"
        >
          <Plus size={18} />
          <span>
            New<span className="hidden sm:inline"> workout</span>
          </span>
        </button>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div className="sm:max-w-md">
          <WorkoutSearch value={searchQuery} onChange={setSearchQuery} />
        </div>
        <WorkoutFilter
          category={category}
          onCategoryChange={setCategory}
          tags={allTags}
          selectedTag={selectedTag}
          onTagChange={setSelectedTag}
        />
      </div>

      {/* List */}
      <WorkoutList
        workouts={filteredWorkouts}
        loading={loading}
        error={error}
        onDelete={handleDelete}
        hasFilters={hasFilters}
        onClearFilters={clearFilters}
      />
    </div>
  );
};

export default Workouts;