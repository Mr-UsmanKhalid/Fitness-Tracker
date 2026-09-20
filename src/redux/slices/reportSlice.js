import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";


// WORKOUT REPORT
export const fetchWorkoutReport = createAsyncThunk(
  "report/fetchWorkoutReport",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/reports/workouts", {
        params,
      });

      return response.data;
    } catch (error) {
      console.error(
        "FETCH WORKOUT REPORT ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch workout report"
      );
    }
  }
);


// NUTRITION REPORT
export const fetchNutritionReport = createAsyncThunk(
  "report/fetchNutritionReport",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/reports/nutrition", {
        params,
      });

      return response.data;
    } catch (error) {
      console.error(
        "FETCH NUTRITION REPORT ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch nutrition report"
      );
    }
  }
);


// PROGRESS REPORT
// Replaces the old goal report thunk that was never wired to an endpoint
// (this app has no Goals feature — Workouts, Nutrition, Progress are the
// three real pillars).
export const fetchProgressReport = createAsyncThunk(
  "report/fetchProgressReport",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/reports/progress", {
        params,
      });

      return response.data;
    } catch (error) {
      console.error(
        "FETCH PROGRESS REPORT ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch progress report"
      );
    }
  }
);


// COMPLETE REPORT
export const fetchCompleteReport = createAsyncThunk(
  "report/fetchCompleteReport",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/reports/complete", {
        params,
      });

      return response.data;
    } catch (error) {
      console.error(
        "FETCH COMPLETE REPORT ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch complete report"
      );
    }
  }
);


const initialState = {
  workoutReport: null,
  nutritionReport: null,
  progressReport: null,
  completeReport: null,

  loading: false,
  error: null,

  workoutLoading: false,
  nutritionLoading: false,
  progressLoading: false,
  completeLoading: false,
};


const reportSlice = createSlice({
  name: "report",

  initialState,

  reducers: {
    clearReportError: (state) => {
      state.error = null;
    },

    clearReports: (state) => {
      state.workoutReport = null;
      state.nutritionReport = null;
      state.progressReport = null;
      state.completeReport = null;
    },
  },

  extraReducers: (builder) => {

    // WORKOUT REPORT
    builder
      .addCase(fetchWorkoutReport.pending, (state) => {
        state.workoutLoading = true;
        state.error = null;
      })

      .addCase(fetchWorkoutReport.fulfilled, (state, action) => {
        state.workoutLoading = false;
        state.workoutReport =
          action.payload.report || null;
      })

      .addCase(fetchWorkoutReport.rejected, (state, action) => {
        state.workoutLoading = false;
        state.error = action.payload;
      });


    // NUTRITION REPORT
    builder
      .addCase(fetchNutritionReport.pending, (state) => {
        state.nutritionLoading = true;
        state.error = null;
      })

      .addCase(fetchNutritionReport.fulfilled, (state, action) => {
        state.nutritionLoading = false;
        state.nutritionReport =
          action.payload.report || null;
      })

      .addCase(fetchNutritionReport.rejected, (state, action) => {
        state.nutritionLoading = false;
        state.error = action.payload;
      });


    // PROGRESS REPORT
    builder
      .addCase(fetchProgressReport.pending, (state) => {
        state.progressLoading = true;
        state.error = null;
      })

      .addCase(fetchProgressReport.fulfilled, (state, action) => {
        state.progressLoading = false;
        state.progressReport =
          action.payload.report || null;
      })

      .addCase(fetchProgressReport.rejected, (state, action) => {
        state.progressLoading = false;
        state.error = action.payload;
      });


    // COMPLETE REPORT
    builder
      .addCase(fetchCompleteReport.pending, (state) => {
        state.completeLoading = true;
        state.error = null;
      })

      .addCase(fetchCompleteReport.fulfilled, (state, action) => {
        state.completeLoading = false;
        state.completeReport =
          action.payload.report || null;
      })

      .addCase(fetchCompleteReport.rejected, (state, action) => {
        state.completeLoading = false;
        state.error = action.payload;
      });
  },
});


export const {
  clearReportError,
  clearReports,
} = reportSlice.actions;

export default reportSlice.reducer;