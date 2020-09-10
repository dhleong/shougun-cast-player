import React from "react";

import { connect } from "the-mall";

import { error } from "./subs";

const StackTrace = ({ stack }: {
  stack: string[],
}) => {
  return (
    <pre className="stacktrace">{stack.join("\n")}</pre>
  );
};

export const ErrorViewer = connect(() => {
  const e = error().deref();
  if (!e) throw new Error("No error for ErrorViewer");

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
});
