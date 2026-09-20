import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";

// ==========================================
// GET ALL WORKOUTS
// GET /api/workouts
// ==========================================
export const fetchWorkouts = createAsyncThunk(
  "workout/fetchWorkouts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/workouts");

      return response.data;
    } catch (error) {
      console.error(
        "FETCH WORKOUTS ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch workouts"
      );
    }
  }
);


// ==========================================
// GET SINGLE WORKOUT
// GET /api/workouts/:id
// ==========================================
export const fetchWorkout = createAsyncThunk(
  "workout/fetchWorkout",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/workouts/${id}`);

      return response.data;
    } catch (error) {
      console.error(
        "FETCH WORKOUT ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch workout"
      );
    }
  }
);


// ==========================================
// CREATE WORKOUT
// POST /api/workouts
// ==========================================
export const createWorkout = createAsyncThunk(
  "workout/createWorkout",
  async (workoutData, { rejectWithValue }) => {
    try {
      const response = await api.post("/workouts", workoutData);

      return response.data;
    } catch (error) {
      console.error(
        "CREATE WORKOUT ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message || "Failed to create workout"
      );
    }
  }
);


// ==========================================
// UPDATE WORKOUT
// PUT /api/workouts/:id
// ==========================================
export const updateWorkout = createAsyncThunk(
  "workout/updateWorkout",
  async ({ id, workoutData }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/workouts/${id}`,
        workoutData
      );

      return response.data;
    } catch (error) {
      console.error(
        "UPDATE WORKOUT ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message || "Failed to update workout"
      );
    }
  }
);


// ==========================================
// DELETE WORKOUT
// DELETE /api/workouts/:id
// ==========================================
export const deleteWorkout = createAsyncThunk(
  "workout/deleteWorkout",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/workouts/${id}`);

      return {
        id,
        ...response.data,
      };
    } catch (error) {
      console.error(
        "DELETE WORKOUT ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message || "Failed to delete workout"
      );
    }
  }
);


// ==========================================
// INITIAL STATE
// ==========================================
const initialState = {
  workouts: [],
  currentWorkout: null,

  loading: false,
  error: null,

  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
};


// ==========================================
// WORKOUT SLICE
// ==========================================
const workoutSlice = createSlice({
  name: "workout",

  initialState,

  reducers: {
    // Clear errors
    clearWorkoutError: (state) => {
      state.error = null;
    },

    // Clear currently selected workout
    clearCurrentWorkout: (state) => {
      state.currentWorkout = null;
    },
  },

  extraReducers: (builder) => {

    // ==========================================
    // FETCH ALL WORKOUTS
    // ==========================================

    builder
      .addCase(fetchWorkouts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchWorkouts.fulfilled, (state, action) => {
        state.loading = false;

        state.workouts = action.payload.workouts || [];

        state.error = null;
      })

      .addCase(fetchWorkouts.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
      });


    // ==========================================
    // FETCH SINGLE WORKOUT
    // ==========================================

    builder
      .addCase(fetchWorkout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchWorkout.fulfilled, (state, action) => {
        state.loading = false;

        state.currentWorkout = action.payload.workout;

        state.error = null;
      })

      .addCase(fetchWorkout.rejected, (state, action) => {
        state.loading = false;

        state.currentWorkout = null;

        state.error = action.payload;
      });


    // ==========================================
    // CREATE WORKOUT
    // ==========================================

    builder
      .addCase(createWorkout.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })

      .addCase(createWorkout.fulfilled, (state, action) => {
        state.createLoading = false;

        const newWorkout = action.payload.workout;

        if (newWorkout) {
          state.workouts.unshift(newWorkout);
        }

        state.currentWorkout = newWorkout || null;

        state.error = null;
      })

      .addCase(createWorkout.rejected, (state, action) => {
        state.createLoading = false;

        state.error = action.payload;
      });


    // ==========================================
    // UPDATE WORKOUT
    // ==========================================

    builder
      .addCase(updateWorkout.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })

      .addCase(updateWorkout.fulfilled, (state, action) => {
        state.updateLoading = false;

        const updatedWorkout = action.payload.workout;

        if (updatedWorkout) {
          // Update workout in list
          const index = state.workouts.findIndex(
            (workout) => workout._id === updatedWorkout._id
          );

          if (index !== -1) {
            state.workouts[index] = updatedWorkout;
          }

          // Update currently selected workout
          state.currentWorkout = updatedWorkout;
        }

        state.error = null;
      })

      .addCase(updateWorkout.rejected, (state, action) => {
        state.updateLoading = false;

        state.error = action.payload;
      });


    // ==========================================
    // DELETE WORKOUT
    // ==========================================

    builder
      .addCase(deleteWorkout.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })

      .addCase(deleteWorkout.fulfilled, (state, action) => {
        state.deleteLoading = false;

        const deletedId = action.payload.id;

        // Remove from workout list
        state.workouts = state.workouts.filter(
          (workout) => workout._id !== deletedId
        );

        // Clear current workout if it was deleted
        if (state.currentWorkout?._id === deletedId) {
          state.currentWorkout = null;
        }

        state.error = null;
      })

      .addCase(deleteWorkout.rejected, (state, action) => {
        state.deleteLoading = false;

        state.error = action.payload;
      });
  },
});


// ==========================================
// EXPORT ACTIONS
// ==========================================

export const {
  clearWorkoutError,
  clearCurrentWorkout,
} = workoutSlice.actions;


// ==========================================
// EXPORT REDUCER
// ==========================================

export default workoutSlice.reducer;