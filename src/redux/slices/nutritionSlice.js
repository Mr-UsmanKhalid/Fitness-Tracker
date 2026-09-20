import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";

// ==========================================
// GET ALL NUTRITION ENTRIES
// ==========================================

export const fetchNutrition = createAsyncThunk(
  "nutrition/fetchNutrition",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/nutrition", {
        params,
      });

      return response.data;
    } catch (error) {
      console.error(
        "FETCH NUTRITION ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch nutrition entries"
      );
    }
  }
);


// ==========================================
// GET SINGLE NUTRITION ENTRY
// ==========================================

export const fetchNutritionEntry = createAsyncThunk(
  "nutrition/fetchNutritionEntry",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/nutrition/${id}`);

      return response.data;
    } catch (error) {
      console.error(
        "FETCH NUTRITION ENTRY ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch nutrition entry"
      );
    }
  }
);


// ==========================================
// GET DAILY SUMMARY
// ==========================================

export const fetchDailySummary = createAsyncThunk(
  "nutrition/fetchDailySummary",
  async (date, { rejectWithValue }) => {
    try {
      const response = await api.get(
        "/nutrition/summary/daily",
        {
          params: date ? { date } : {},
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "FETCH DAILY SUMMARY ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch daily nutrition summary"
      );
    }
  }
);


// ==========================================
// CREATE NUTRITION ENTRY
// ==========================================

export const createNutrition = createAsyncThunk(
  "nutrition/createNutrition",
  async (nutritionData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/nutrition",
        nutritionData
      );

      return response.data;
    } catch (error) {
      console.error(
        "CREATE NUTRITION ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create nutrition entry"
      );
    }
  }
);


// ==========================================
// UPDATE NUTRITION ENTRY
// ==========================================

export const updateNutrition = createAsyncThunk(
  "nutrition/updateNutrition",
  async ({ id, nutritionData }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/nutrition/${id}`,
        nutritionData
      );

      return response.data;
    } catch (error) {
      console.error(
        "UPDATE NUTRITION ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update nutrition entry"
      );
    }
  }
);


// ==========================================
// DELETE NUTRITION ENTRY
// ==========================================

export const deleteNutrition = createAsyncThunk(
  "nutrition/deleteNutrition",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/nutrition/${id}`
      );

      return {
        id,
        ...response.data,
      };
    } catch (error) {
      console.error(
        "DELETE NUTRITION ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete nutrition entry"
      );
    }
  }
);


// ==========================================
// INITIAL STATE
// ==========================================

const initialState = {
  meals: [],
  currentMeal: null,

  summary: {
    date: null,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    meals: 0,
  },

  loading: false,
  error: null,

  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  summaryLoading: false,
};


// ==========================================
// SLICE
// ==========================================

const nutritionSlice = createSlice({
  name: "nutrition",

  initialState,

  reducers: {
    clearNutritionError: (state) => {
      state.error = null;
    },

    clearCurrentMeal: (state) => {
      state.currentMeal = null;
    },

    clearNutritionSummary: (state) => {
      state.summary = {
        date: null,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        meals: 0,
      };
    },
  },

  extraReducers: (builder) => {

    // ==========================================
    // FETCH NUTRITION
    // ==========================================

    builder
      .addCase(fetchNutrition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchNutrition.fulfilled, (state, action) => {
        state.loading = false;

        state.meals = action.payload.nutrition || [];

        state.error = null;
      })

      .addCase(fetchNutrition.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
      });


    // ==========================================
    // FETCH SINGLE ENTRY
    // ==========================================

    builder
      .addCase(fetchNutritionEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchNutritionEntry.fulfilled, (state, action) => {
        state.loading = false;

        state.currentMeal =
          action.payload.nutrition || null;

        state.error = null;
      })

      .addCase(fetchNutritionEntry.rejected, (state, action) => {
        state.loading = false;

        state.currentMeal = null;

        state.error = action.payload;
      });


    // ==========================================
    // DAILY SUMMARY
    // ==========================================

    builder
      .addCase(fetchDailySummary.pending, (state) => {
        state.summaryLoading = true;
        state.error = null;
      })

      .addCase(fetchDailySummary.fulfilled, (state, action) => {
        state.summaryLoading = false;

        state.summary =
          action.payload.summary || state.summary;

        state.error = null;
      })

      .addCase(fetchDailySummary.rejected, (state, action) => {
        state.summaryLoading = false;

        state.error = action.payload;
      });


    // ==========================================
    // CREATE
    // ==========================================

    builder
      .addCase(createNutrition.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })

      .addCase(createNutrition.fulfilled, (state, action) => {
        state.createLoading = false;

        const newMeal = action.payload.nutrition;

        if (newMeal) {
          state.meals.unshift(newMeal);
        }

        state.currentMeal = newMeal || null;

        state.error = null;
      })

      .addCase(createNutrition.rejected, (state, action) => {
        state.createLoading = false;

        state.error = action.payload;
      });


    // ==========================================
    // UPDATE
    // ==========================================

    builder
      .addCase(updateNutrition.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })

      .addCase(updateNutrition.fulfilled, (state, action) => {
        state.updateLoading = false;

        const updatedMeal =
          action.payload.nutrition;

        if (updatedMeal) {
          const index = state.meals.findIndex(
            (meal) => meal._id === updatedMeal._id
          );

          if (index !== -1) {
            state.meals[index] = updatedMeal;
          }

          state.currentMeal = updatedMeal;
        }

        state.error = null;
      })

      .addCase(updateNutrition.rejected, (state, action) => {
        state.updateLoading = false;

        state.error = action.payload;
      });


    // ==========================================
    // DELETE
    // ==========================================

    builder
      .addCase(deleteNutrition.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })

      .addCase(deleteNutrition.fulfilled, (state, action) => {
        state.deleteLoading = false;

        const deletedId = action.payload.id;

        state.meals = state.meals.filter(
          (meal) => meal._id !== deletedId
        );

        if (state.currentMeal?._id === deletedId) {
          state.currentMeal = null;
        }

        state.error = null;
      })

      .addCase(deleteNutrition.rejected, (state, action) => {
        state.deleteLoading = false;

        state.error = action.payload;
      });
  },
});


// ==========================================
// ACTIONS
// ==========================================

export const {
  clearNutritionError,
  clearCurrentMeal,
  clearNutritionSummary,
} = nutritionSlice.actions;


// ==========================================
// REDUCER
// ==========================================

export default nutritionSlice.reducer;