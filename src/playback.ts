import _debug from "debug";
const debug = _debug("shougun:playback");

import urllib from "url";

import { PlayerManager } from "chromecast-caf-receiver/cast.framework";
import {
    GenericMediaMetadata,
    LoadRequestData,
    MediaInformation,
    RequestData,
    SeekRequestData,
} from "chromecast-caf-receiver/cast.framework.messages";

/**
 * Remove eg `http:` from an URL so it will load with the correct
 * protocol depending on whether this page is served over HTTPS
 * or HTTP
 */
function stripUrlProtocol(url: string) {
    return url.replace(/^http[s]?:/, "");
}

export class PlaybackHandler {
    public static init(
        context: cast.framework.CastReceiverContext,
    ) {
        const playerManager = context.getPlayerManager();

        const handler = new PlaybackHandler(
            playerManager,
        );

        playerManager.addEventListener(
            cast.framework.events.category.CORE,
            event => {
                debug("EVENT", event);
            },
        );

        playerManager.setMessageInterceptor(
            "LOAD",
            handler.interceptLoadMessage.bind(handler),
        );
        playerManager.setMessageInterceptor(
            "SEEK",
            handler.interceptSeekMessage.bind(handler),
        );
        playerManager.setMessageInterceptor(
            "PLAY_AGAIN",
            handler.interceptPlayAgainMessage.bind(handler),
        );
    }

    constructor(
        private readonly playerManager: PlayerManager,
    ) { }

    public async interceptLoadMessage(message: RequestData) {
        const m = message as LoadRequestData;

        m.media.contentId = stripUrlProtocol(m.media.contentId);

        const meta = m.media.metadata;
        if (meta && (meta as GenericMediaMetadata).images) {
            const genericMeta = meta as GenericMediaMetadata;
            for (const image of genericMeta.images) {
                image.url = stripUrlProtocol(image.url);
            }
        }

        debug("LOAD REQUEST", m);
        return m;
    }

    public async interceptSeekMessage(message: SeekRequestData) {
        debug("SEEK REQUEST", message);
        const { playerManager } = this;
        const media = playerManager.getMediaInformation();
        const now = playerManager.getCurrentTimeSec();

        const customData = media.customData;
        const lastStartTime = customData ? customData.startTimeAbsolute : 0;
        const newStartTime = Math.max(0, lastStartTime + now + message.relativeTime);
        return this.triggerSeekTo(media, newStartTime);
    }

    public async interceptPlayAgainMessage(message: RequestData) {
        debug("PLAY AGAIN REQUEST", message);
        const { playerManager } = this;
        const media = playerManager.getMediaInformation();
        return this.triggerSeekTo(media, 0);
    }

    private async triggerSeekTo(
        media: MediaInformation,
        newStartTime: number,
    ) {

        // FIXME don't destroy other query params that may be there
        const oldUrl = urllib.parse(media.contentId);
        oldUrl.search = "?startTime=" + newStartTime;
        const newUrl = urllib.format(oldUrl);
        debug(oldUrl, " -> ", newUrl);

        const newRequest = {
            customData: Object.assign({}, media.customData, {
                startTimeAbsolute: newStartTime,
            }),
            media: {
                contentId: newUrl,
                contentType: media.contentType,
                streamType: media.streamType,
            },
        };
        this.playerManager.load(newRequest as any);
    }
}
