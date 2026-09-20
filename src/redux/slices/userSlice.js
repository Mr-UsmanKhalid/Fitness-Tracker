import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";

// ==========================================
// UPDATE PROFILE
// PUT /api/users/profile
// Assumed endpoint - adjust the URL/body to match your real controller.
// ==========================================
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put("/users/profile", profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

// ==========================================
// UPLOAD PROFILE PICTURE
// POST /api/users/profile-picture (multipart/form-data)
// Assumed endpoint - adjust to match your real controller/upload middleware.
// ==========================================
export const uploadProfilePicture = createAsyncThunk(
  "user/uploadProfilePicture",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("profilePicture", file); 

      const response = await api.post(
  "/users/profile-picture",
  formData
);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload profile picture"
      );
    }
  }
);

// ==========================================
// CHANGE PASSWORD
// PUT /api/users/change-password
// Assumed endpoint - adjust to match your real controller.
// ==========================================
export const changePassword = createAsyncThunk(
  "user/changePassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await api.put("/users/change-password", {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to change password"
      );
    }
  }
);

const initialState = {
  updateLoading: false,
  error: null,

  uploadLoading: false,

  passwordLoading: false,
  passwordError: null,
};

const userSlice = createSlice({
  name: "user",

  initialState,

  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },

    clearPasswordError: (state) => {
      state.passwordError = null;
    },
  },

  extraReducers: (builder) => {
    // =========================
    // UPDATE PROFILE
    // =========================
    builder
      .addCase(updateProfile.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })

      .addCase(updateProfile.fulfilled, (state) => {
        state.updateLoading = false;
      })

      .addCase(updateProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      });

    // =========================
    // UPLOAD PROFILE PICTURE
    // =========================
    builder
      .addCase(uploadProfilePicture.pending, (state) => {
        state.uploadLoading = true;
        state.error = null;
      })

      .addCase(uploadProfilePicture.fulfilled, (state) => {
        state.uploadLoading = false;
      })

      .addCase(uploadProfilePicture.rejected, (state, action) => {
        state.uploadLoading = false;
        state.error = action.payload;
      });

    // =========================
    // CHANGE PASSWORD
    // =========================
    builder
      .addCase(changePassword.pending, (state) => {
        state.passwordLoading = true;
        state.passwordError = null;
      })

      .addCase(changePassword.fulfilled, (state) => {
        state.passwordLoading = false;
        state.passwordError = null;
      })

      .addCase(changePassword.rejected, (state, action) => {
        state.passwordLoading = false;
        state.passwordError = action.payload;
      });
  },
});

export const { clearProfileError, clearPasswordError } = userSlice.actions;

export default userSlice.reducer;