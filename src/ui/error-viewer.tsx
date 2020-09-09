import React from "react";

import { IError } from "./store";

const StackTrace = ({ stack }: {
  stack: string[],
}) => {
  return (
    <pre className="stacktrace">{stack.join("\n")}</pre>
  );
};

export interface IErrorViewerProps {
  e: IError;
}

export const ErrorViewer = ({ e }: IErrorViewerProps) => {
  const detail = !e.details ? null : (
    <div className="detail">{e.details}</div>
  );

  const stack = !(e.stack && e.stack.length) ? null : (
    <StackTrace stack={e.stack} />
  );

  return (
    <div className="error-viewer">
      <div className="message">{e.message}</div>
      {detail}
      {stack}
    </div>
  );
};
