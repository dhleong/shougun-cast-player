import React from "react";

import { connect, StoreProvider } from "the-mall/macro";

import { Browser } from "./browser";
import { ErrorViewer } from "./error-viewer";
import { UiStateViewer } from "./ui-state-viewer";

import { shougunStore } from "./store";
import { error, isPlaying, uiState } from "./subs";

const Router = connect(() => {
  if (isPlaying().deref()) {
    // don't render while playing!
    return null;
  }

  const e = error().deref();
  if (e) {
    return (
      <ErrorViewer e={e} />
    );
  }

  const state = uiState().deref();
  if (state) {
    return (
      <UiStateViewer ui={state} />
    );
  }

  return (
    <Browser />
  );
});

export function App() {
  return (
    <StoreProvider value={shougunStore}>
      <Router />
    </StoreProvider>
  );
}
