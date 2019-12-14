import React from "react";

import { connect, StoreProvider } from "the-mall";

import { Browser } from "./browser";
import { ErrorViewer } from "./error-viewer";

import { shougunStore } from "./store";
import { error, isPlaying } from "./subs";

const Router = connect(() => {
  if (isPlaying().deref()) {
    // don't render while playing!
    return null;
  }

  const e = error().deref();
  console.log("route!", e);
  if (e) {
    return (
      <ErrorViewer />
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
