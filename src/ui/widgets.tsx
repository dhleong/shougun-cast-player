import React from "react";

export const Spinner = (opts?: { sizePx?: number }) => {
  const config = {
    sizePx: 32,

    ...opts,
  };
  const size = `${config.sizePx}px`;

  return (
    <svg className="spinner" width={size} height={size} viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
      <circle className="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
    </svg>
  );
};
