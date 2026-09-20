import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../config/api";

// Fetch all progress
export const fetchProgress = createAsyncThunk(
  "progress/fetchProgress",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/progress", {
        params,
      });

      return response.data.progress;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch progress"
      );
    }
  }
);

// Fetch single progress entry
export const fetchProgressEntry = createAsyncThunk(
  "progress/fetchProgressEntry",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/progress/${id}`);

      return response.data.progress;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch progress entry"
      );
    }
  }
);

// Create progress
export const createProgress = createAsyncThunk(
  "progress/createProgress",
  async (progressData, { rejectWithValue }) => {
    try {
      const response = await api.post("/progress", progressData);

      return response.data.progress;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create progress"
      );
    }
  }
);

// Update progress
export const updateProgress = createAsyncThunk(
  "progress/updateProgress",
  async ({ id, progressData }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/progress/${id}`,
        progressData
      );

      return response.data.progress;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update progress"
      );
    }
  }
);

// Delete progress
export const deleteProgress = createAsyncThunk(
  "progress/deleteProgress",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/progress/${id}`);

      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete progress"
      );
    }
  }
);

// Fetch weight goal (goal is null when none is set)
export const fetchGoal = createAsyncThunk(
  "progress/fetchGoal",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/progress/goal");

      return response.data.goal;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch goal"
      );
    }
  }
);

// Create or update weight goal: { goalWeight, weightUnit }
export const saveGoal = createAsyncThunk(
  "progress/saveGoal",
  async (goalData, { rejectWithValue }) => {
    try {
      const response = await api.put("/progress/goal", goalData);

      return response.data.goal;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to save goal"
      );
    }
  }
);

// Remove weight goal
export const removeGoal = createAsyncThunk(
  "progress/removeGoal",
  async (_, { rejectWithValue }) => {
    try {
      await api.delete("/progress/goal");

      return null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove goal"
      );
    }
  }
);

const initialState = {
  progressEntries: [],
  currentProgress: null,

  loading: false,
  error: null,

  createLoading: false,
  updateLoading: false,
  deleteLoading: false,

  // weight goal: { goalWeight, weightUnit } or null
  goal: null,
  goalLoaded: false, // true once the first fetch finished, so the UI can tell "not set" from "not loaded yet"
  goalSaving: false,
};

const progressSlice = createSlice({
  name: "progress",
  initialState,

  reducers: {
    clearProgressError: (state) => {
      state.error = null;
    },

    clearCurrentProgress: (state) => {
      state.currentProgress = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =========================
      // FETCH ALL PROGRESS
      // =========================
      .addCase(fetchProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.progressEntries = action.payload;
      })

      .addCase(fetchProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // =========================
      // FETCH SINGLE PROGRESS
      // =========================
      .addCase(fetchProgressEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProgressEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProgress = action.payload;
      })

      .addCase(fetchProgressEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // =========================
      // CREATE PROGRESS
      // =========================
      .addCase(createProgress.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })

      .addCase(createProgress.fulfilled, (state, action) => {
        state.createLoading = false;

        state.progressEntries.push(action.payload);

        state.progressEntries.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
      })

      .addCase(createProgress.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })

      // =========================
      // UPDATE PROGRESS
      // =========================
      .addCase(updateProgress.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })

      .addCase(updateProgress.fulfilled, (state, action) => {
        state.updateLoading = false;

        const index = state.progressEntries.findIndex(
          (item) => item._id === action.payload._id
        );

        if (index !== -1) {
          state.progressEntries[index] = action.payload;
        }

        state.currentProgress = action.payload;

        state.progressEntries.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
      })

      .addCase(updateProgress.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      // =========================
      // DELETE PROGRESS
      // =========================
      .addCase(deleteProgress.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })

      .addCase(deleteProgress.fulfilled, (state, action) => {
        state.deleteLoading = false;

        state.progressEntries =
          state.progressEntries.filter(
            (item) => item._id !== action.payload
          );

        if (
          state.currentProgress?._id === action.payload
        ) {
          state.currentProgress = null;
        }
      })

      .addCase(deleteProgress.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      })

      // =========================
      // WEIGHT GOAL
      // =========================
      .addCase(fetchGoal.fulfilled, (state, action) => {
        state.goal = action.payload;
        state.goalLoaded = true;
      })

      .addCase(fetchGoal.rejected, (state) => {
        state.goalLoaded = true;
      })

      .addCase(saveGoal.pending, (state) => {
        state.goalSaving = true;
      })

      .addCase(saveGoal.fulfilled, (state, action) => {
        state.goalSaving = false;
        state.goal = action.payload;
        state.goalLoaded = true;
      })

      .addCase(saveGoal.rejected, (state) => {
        state.goalSaving = false;
      })

      .addCase(removeGoal.pending, (state) => {
        state.goalSaving = true;
      })

      .addCase(removeGoal.fulfilled, (state) => {
        state.goalSaving = false;
        state.goal = null;
      })

      .addCase(removeGoal.rejected, (state) => {
        state.goalSaving = false;
      });
  },
});

export const {
  clearProgressError,
  clearCurrentProgress,
} = progressSlice.actions;

export default progressSlice.reducer;