import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2, FileBarChart } from 'lucide-react';
import {
  fetchWorkoutReport,
  fetchNutritionReport, 
  fetchCompleteReport,
} from '../redux/slices/reportSlice';
import ReportFilter from '../components/reports/ReportFilter';
import ReportCard from '../components/reports/ReportCard';
import ExportButtons from '../components/reports/ExportButtons';

const toISODate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const defaultRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 29);
  return { startDate: toISODate(start), endDate: toISODate(end) };
};

const REPORT_TITLES = {
  workout: 'Workout Report',
  nutrition: 'Nutrition Report', 
  complete: 'Overview Report',
};

/** Only render scalar top-level fields as cards; nested objects/arrays are skipped here. */
const scalarEntries = (obj) =>
  Object.entries(obj || {}).filter(
    ([, value]) => value === null || typeof value !== 'object'
  );

const Reports = () => {
  const dispatch = useDispatch();
  const [reportType, setReportType] = useState('complete');
  const [dateRange, setDateRange] = useState(defaultRange());

  const {
    workoutReport,
    nutritionReport, 
    completeReport,
    workoutLoading,
    nutritionLoading, 
    completeLoading,
    error,
  } = useSelector((state) => state.report);

  const reportMap = {
    workout: workoutReport,
    nutrition: nutritionReport, 
    complete: completeReport,
  };

  const loadingMap = {
    workout: workoutLoading,
    nutrition: nutritionLoading, 
    complete: completeLoading,
  };

  const activeReport = reportMap[reportType];
  const activeLoading = loadingMap[reportType];

  const handleGenerate = () => {
    const params =
      reportType === 'goal' ? {} : { startDate: dateRange.startDate, endDate: dateRange.endDate };

    if (reportType === 'workout') dispatch(fetchWorkoutReport(params));
    else if (reportType === 'nutrition') dispatch(fetchNutritionReport(params)); 
    else dispatch(fetchCompleteReport(params));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">Reports</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Generate and export a summary of your fitness data.
          </p>
        </div>
        <ExportButtons report={activeReport} title={REPORT_TITLES[reportType]} />
      </div>

      {/* Filters */}
      <ReportFilter
        reportType={reportType}
        onReportTypeChange={setReportType}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <div className="flex justify-end">
        <button
          onClick={handleGenerate}
          disabled={activeLoading}
          className="flex items-center gap-2 px-5 py-2.5 bg-lime-400 text-black font-semibold rounded-lg hover:bg-lime-300 disabled:opacity-60 transition-colors"
        >
          {activeLoading && <Loader2 size={16} className="animate-spin" />}
          Generate Report
        </button>
      </div>

      {/* Report output */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {!activeReport && !activeLoading && (
        <div className="flex flex-col items-center justify-center text-center py-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 border-dashed rounded-lg">
          <FileBarChart size={32} className="text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-700 dark:text-gray-200 font-medium">No report generated yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Choose a report type and date range, then click Generate.
          </p>
        </div>
      )}

      {activeReport && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {scalarEntries(activeReport).map(([key, value]) => (
            <ReportCard
              key={key}
              label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
              value={typeof value === 'number' ? value.toLocaleString() : String(value)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;