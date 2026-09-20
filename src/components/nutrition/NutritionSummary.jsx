import React from 'react';
import { Flame, Beef, Wheat, Droplet } from 'lucide-react';

const ProgressBar = ({ value, goal, colorClass }) => {
  const pct = goal ? Math.min(100, Math.round((value / goal) * 100)) : 0;
  return (
    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mt-2">
      <div
        className={`h-full ${colorClass} transition-all duration-300`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

const StatBlock = ({ icon: Icon, label, value, unit, goal, colorClass, iconClass }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
      <Icon size={16} className={iconClass} />
      <span className="text-xs font-medium uppercase tracking-wide">
        {label}
      </span>
    </div>
    <p className="text-2xl font-bold text-black dark:text-white mt-2">
      {value}
      <span className="text-sm font-normal text-gray-400 dark:text-gray-500 ml-1">{unit}</span>
    </p>
    {goal ? (
      <>
        <ProgressBar value={value} goal={goal} colorClass={colorClass} />
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">of {goal}{unit} goal</p>
      </>
    ) : null}
  </div>
);

const NutritionSummary = ({ summary, goals, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 h-28 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const data = summary || { calories: 0, protein: 0, carbs: 0, fat: 0, meals: 0 };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatBlock
        icon={Flame}
        label="Calories"
        value={data.calories || 0}
        unit="kcal"
        goal={goals?.calories}
        colorClass="bg-lime-400"
        iconClass="text-orange-400"
      />
      <StatBlock
        icon={Beef}
        label="Protein"
        value={data.protein || 0}
        unit="g"
        goal={goals?.protein}
        colorClass="bg-blue-400"
        iconClass="text-blue-400"
      />
      <StatBlock
        icon={Wheat}
        label="Carbs"
        value={data.carbs || 0}
        unit="g"
        goal={goals?.carbs}
        colorClass="bg-orange-400"
        iconClass="text-orange-400"
      />
      <StatBlock
        icon={Droplet}
        label="Fat"
        value={data.fat || 0}
        unit="g"
        goal={goals?.fat}
        colorClass="bg-purple-400"
        iconClass="text-purple-400"
      />
    </div>
  );
};

export default NutritionSummary;