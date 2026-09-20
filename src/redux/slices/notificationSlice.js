import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";

// GET ALL NOTIFICATIONS
export const fetchNotifications = createAsyncThunk(
  "notification/fetchNotifications",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/notifications", {
        params,
      });

      return response.data;
    } catch (error) {
      console.error(
        "FETCH NOTIFICATIONS ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch notifications"
      );
    }
  }
);


// GET SINGLE NOTIFICATION
export const fetchNotification = createAsyncThunk(
  "notification/fetchNotification",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/notifications/${id}`);

      return response.data;
    } catch (error) {
      console.error(
        "FETCH NOTIFICATION ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch notification"
      );
    }
  }
);


// CREATE NOTIFICATION
export const createNotification = createAsyncThunk(
  "notification/createNotification",
  async (notificationData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/notifications",
        notificationData
      );

      return response.data;
    } catch (error) {
      console.error(
        "CREATE NOTIFICATION ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create notification"
      );
    }
  }
);


// MARK ONE AS READ
export const markNotificationAsRead = createAsyncThunk(
  "notification/markNotificationAsRead",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/notifications/${id}/read`
      );

      return response.data;
    } catch (error) {
      console.error(
        "MARK NOTIFICATION READ ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to mark notification as read"
      );
    }
  }
);


// MARK ALL AS READ
export const markAllNotificationsAsRead = createAsyncThunk(
  "notification/markAllNotificationsAsRead",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.put(
        "/notifications/read-all"
      );

      return response.data;
    } catch (error) {
      console.error(
        "MARK ALL NOTIFICATIONS READ ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to mark all notifications as read"
      );
    }
  }
);


// DELETE NOTIFICATION
export const deleteNotification = createAsyncThunk(
  "notification/deleteNotification",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/notifications/${id}`
      );

      return {
        id,
        ...response.data,
      };
    } catch (error) {
      console.error(
        "DELETE NOTIFICATION ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete notification"
      );
    }
  }
);


const initialState = {
  notifications: [],
  currentNotification: null,
  unreadCount: 0,

  loading: false,
  error: null,

  createLoading: false,
  readLoading: false,
  deleteLoading: false,
};


const notificationSlice = createSlice({
  name: "notification",
  initialState,

  reducers: {
    clearNotificationError: (state) => {
      state.error = null;
    },

    clearCurrentNotification: (state) => {
      state.currentNotification = null;
    },
  },

  extraReducers: (builder) => {

    // FETCH ALL
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;

        state.notifications =
          action.payload.notifications || [];

        state.unreadCount =
          action.payload.unreadCount || 0;

        state.error = null;
      })

      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });


    // FETCH SINGLE
    builder
      .addCase(fetchNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchNotification.fulfilled, (state, action) => {
        state.loading = false;

        state.currentNotification =
          action.payload.notification || null;

        state.error = null;
      })

      .addCase(fetchNotification.rejected, (state, action) => {
        state.loading = false;
        state.currentNotification = null;
        state.error = action.payload;
      });


    // CREATE
    builder
      .addCase(createNotification.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })

      .addCase(createNotification.fulfilled, (state, action) => {
        state.createLoading = false;

        const notification =
          action.payload.notification;

        if (notification) {
          state.notifications.unshift(notification);

          if (!notification.isRead) {
            state.unreadCount += 1;
          }
        }

        state.error = null;
      })

      .addCase(createNotification.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      });


    // MARK ONE READ
    builder
      .addCase(markNotificationAsRead.pending, (state) => {
        state.readLoading = true;
        state.error = null;
      })

      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.readLoading = false;

        const notification =
          action.payload.notification;

        if (notification) {
          const index = state.notifications.findIndex(
            (item) => item._id === notification._id
          );

          if (index !== -1) {
            const wasUnread =
              !state.notifications[index].isRead;

            state.notifications[index] = notification;

            if (wasUnread && notification.isRead) {
              state.unreadCount = Math.max(
                0,
                state.unreadCount - 1
              );
            }
          }

          if (
            state.currentNotification?._id ===
            notification._id
          ) {
            state.currentNotification = notification;
          }
        }

        state.error = null;
      })

      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.readLoading = false;
        state.error = action.payload;
      });


    // MARK ALL READ
    builder
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach((notification) => {
          notification.isRead = true;
        });

        state.unreadCount = 0;
      })

      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.error = action.payload;
      });


    // DELETE
    builder
      .addCase(deleteNotification.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })

      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.deleteLoading = false;

        const deletedId = action.payload.id;

        const deletedNotification =
          state.notifications.find(
            (notification) =>
              notification._id === deletedId
          );

        if (
          deletedNotification &&
          !deletedNotification.isRead
        ) {
          state.unreadCount = Math.max(
            0,
            state.unreadCount - 1
          );
        }

        state.notifications =
          state.notifications.filter(
            (notification) =>
              notification._id !== deletedId
          );

        if (
          state.currentNotification?._id === deletedId
        ) {
          state.currentNotification = null;
        }

        state.error = null;
      })

      .addCase(deleteNotification.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});


export const {
  clearNotificationError,
  clearCurrentNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;