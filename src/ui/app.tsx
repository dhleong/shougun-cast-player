import React from "react";

import { connect, StoreProvider } from "the-mall";

import { Browser } from "./browser";
import { shougunStore } from "./store";
import { isPlaying } from "./subs";

const Router = connect(() => {
  if (isPlaying().deref()) {
    // don't render while playing!
    return null;
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
