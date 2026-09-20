import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../slices/authSlice";
import userReducer from "../slices/userSlice";
import workoutSlice from "../slices/workoutSlice";
import nutritionSlice from "../slices/nutritionSlice";
import progressSlice from "../slices/progressSlice";
import notificationSlice from "../slices/notificationSlice";
import reportReducer from "../slices/reportSlice";
import searchReducer from "../slices/searchSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    workout: workoutSlice,
    nutrition: nutritionSlice,
    progress: progressSlice,
    notification: notificationSlice, 
    report: reportReducer,
    search: searchReducer,
  },
});

export default store;