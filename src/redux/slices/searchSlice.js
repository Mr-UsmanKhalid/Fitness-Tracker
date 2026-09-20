import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";


// SEARCH
export const searchAll = createAsyncThunk(
  "search/searchAll",

  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/search", {
        params,
      });

      return response.data;
    } catch (error) {
      console.error(
        "SEARCH ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Search failed"
      );
    }
  }
);


const initialState = {
  query: "",

  results: {
    workouts: [],
    nutrition: [],
    users: [],
  },

  filters: {
    type: "all",
    category: "",
    mealType: "",
  },

  total: 0,

  loading: false,
  error: null,
};


const searchSlice = createSlice({
  name: "search",

  initialState,

  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload;
    },

    setSearchFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },

    clearSearch: (state) => {
      state.query = "";

      state.results = {
        workouts: [],
        nutrition: [],
        users: [],
      };

      state.total = 0;
      state.error = null;
    },

    clearSearchError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(searchAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(searchAll.fulfilled, (state, action) => {
        state.loading = false;

        state.query =
          action.payload.query || "";

        state.results =
          action.payload.results || {
            workouts: [],
            nutrition: [],
            users: [],
          };

        state.filters = {
          ...state.filters,
          ...(action.payload.filters || {}),
        };

        state.total =
          action.payload.total || 0;

        state.error = null;
      })

      .addCase(searchAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export const {
  setSearchQuery,
  setSearchFilters,
  clearSearch,
  clearSearchError,
} = searchSlice.actions;


export default searchSlice.reducer;