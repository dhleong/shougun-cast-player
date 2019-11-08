import _debug from "debug";
const debug = _debug("shougun:overlay");

const NS = "urn:x-cast:com.github.dhleong.shougun";

import { addRecommendations } from "./ui/events";
import { IRecommendation, shougunStore } from "./ui/store";

type IShougunEvent = IShougunRecommendEvent;

interface IShougunRecommendEvent {
    type: "RECOMMEND";
    recommendations: IRecommendation[];
}

export class OverlayManager {
    public static init(context: cast.framework.CastReceiverContext) {
        const manager = new OverlayManager();
        context.addCustomMessageListener(NS, msg =>
            manager.onMessage(msg),
        );

        if (_debug.enabled("shougun-debug:data")) {
            const { debugData } = require("./ui/debug");
            manager.showOverlay(debugData);
        }
    }

    public onMessage(event: cast.framework.events.Event) {
        debug("onMessage:", event);
        const msg = (event as any).data as IShougunEvent;
        if (!msg) return;

        switch (msg.type) {
        case "RECOMMEND":
            this.showOverlay(msg.recommendations);
            break;
        }
    }

    public showOverlay(
        recommendations: IRecommendation[],
    ) {
        shougunStore.dispatch(addRecommendations(recommendations));
    }
}
