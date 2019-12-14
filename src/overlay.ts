import _debug from "debug";
const debug = _debug("shougun:overlay");

const NS = "urn:x-cast:com.github.dhleong.shougun";

import { setError, setPlaying, setRecommendations } from "./ui/events";
import { IError, IRecommendation, shougunStore } from "./ui/store";

type IShougunEvent = IShougunErrorEvent | IShougunRecommendEvent;

interface IShougunRecommendEvent {
    type: "RECOMMEND";
    recommendations: IRecommendation[];
}

interface IShougunErrorEvent {
    type: "ERROR";
    error: IError;
}

export class OverlayManager {
    public static init(context: cast.framework.CastReceiverContext) {
        const manager = new OverlayManager();
        context.addCustomMessageListener(NS, msg =>
            manager.onMessage(msg),
        );

        context.getPlayerManager().addEventListener([
            "PLAYING",
            "LOAD_START",
        ] as any, () => {
            shougunStore.dispatch(setPlaying(true));
        });
        context.getPlayerManager().addEventListener([
            "MEDIA_FINISHED",
            "REQUEST_STOP",
        ] as any, msg => {
            debug("playback stopped", msg);
            shougunStore.dispatch(setPlaying(false));
        });

        if (_debug.enabled("shougun-debug:data")) {
            const { debugData } = require("./ui/debug");
            manager.showOverlay(debugData);
        } else if (_debug.enabled("shougun-debug:error")) {
            const { debugError } = require("./ui/debug");
            shougunStore.dispatch(setError(debugError));
        }
    }

    public onMessage(event: cast.framework.events.Event) {
        debug("onMessage:", event);
        const msg = (event as any).data as IShougunEvent;
        if (!msg) return;

        switch (msg.type) {
        case "ERROR":
            shougunStore.dispatch(setError(msg.error));
            break;

        case "RECOMMEND":
            this.showOverlay(msg.recommendations);
            break;
        }
    }

    public showOverlay(
        recommendations: IRecommendation[],
    ) {
        shougunStore.dispatch(setRecommendations(recommendations));
    }
}
