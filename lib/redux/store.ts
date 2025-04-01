import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    // Add other reducers here as needed
  },
  // Optional: Add middleware or devTools configuration
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
