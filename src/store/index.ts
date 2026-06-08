import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import carerReducer from "./slices/carerSlice";
import clientReducer from "./slices/clientSlice";
import adminReducer from "./slices/adminSlice";
import notificationReducer from "./slices/notificationSlice";
import { toastMiddleware } from "./toastMiddleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    carer: carerReducer,
    client: clientReducer,
    admin: adminReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(toastMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
