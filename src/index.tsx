import debug from "debug";

import React from "react";
import ReactDOM from "react-dom";

if (process.env.NODE_ENV !== "production") {
    debug.enable("shougun:*");
}

import { OverlayManager } from "./overlay";
import { PlaybackHandler } from "./playback";
import { ShougunQueue } from "./queue";

import { App } from "./ui/app";

const context = cast.framework.CastReceiverContext.getInstance();
const playbackConfig = new cast.framework.PlaybackConfig();

const queue = ShougunQueue.create(context);

PlaybackHandler.init(context/* , queue */);
OverlayManager.init(context);

// tslint:disable no-bitwise
context.start({
    playbackConfig,
    queue,
    supportedCommands:
        cast.framework.messages.Command.ALL_BASIC_MEDIA
        | cast.framework.messages.Command.QUEUE_NEXT,
});

const overlay = document.getElementById("shougun-overlay");
ReactDOM.render(
  <App />
, overlay);
