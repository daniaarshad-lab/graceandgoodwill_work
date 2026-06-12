import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import carerReducer from "./slices/carerSlice";
import clientReducer from "./slices/clientSlice";
import adminReducer from "./slices/adminSlice";
import notificationReducer from "./slices/notificationSlice";
import { toastMiddleware } from "./toastMiddleware";

import { combineReducers } from "@reduxjs/toolkit";

const appReducer = combineReducers({
  auth: authReducer,
  carer: carerReducer,
  client: clientReducer,
  admin: adminReducer,
  notification: notificationReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "auth/logout/fulfilled") {
    // Reset state to initial state on logout
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(toastMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
