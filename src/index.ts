import debug from "debug";

if (process.env.NODE_ENV !== "production") {
    debug.enable("shougun:*");
}

import { PlaybackHandler } from "./playback";
// import { ShougunQueue } from "./queue";

const context = cast.framework.CastReceiverContext.getInstance();
const playbackConfig = new cast.framework.PlaybackConfig();

// const queue = ShougunQueue.create(context);

PlaybackHandler.init(context/* , queue */);

// tslint:disable no-bitwise
context.start({
    playbackConfig,
    // queue,
    supportedCommands:
        cast.framework.messages.Command.ALL_BASIC_MEDIA
        | cast.framework.messages.Command.QUEUE_NEXT,
});
