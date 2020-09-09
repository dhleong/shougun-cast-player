import React from "react";

import { IUiState } from "./store";
import { Spinner } from "./widgets";

export interface IUiStateProps {
  ui: IUiState;
}

export const UiStateViewer = ({ ui }: IUiStateProps) => {
  const detail = !ui.body ? null : (
    <div className="detail">{ui.body}</div>
  );

  const spinner = !ui.isLoading ? null : (
    <div className="status">
      <Spinner />
    </div>
  );

  return (
    <div className="error-viewer">
      <div className="message">{ui.title || "Shougun"}</div>
      {detail}
      {spinner}
    </div>
  );
};
