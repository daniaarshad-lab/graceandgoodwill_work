"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "./index";
import { loadPersistedAuth } from "./slices/authSlice";

if (typeof window !== "undefined") {
  store.dispatch(loadPersistedAuth());
}

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
