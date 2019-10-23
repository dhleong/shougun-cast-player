import _debug from "debug";
const debug = _debug("shougun:playback");

import urllib from "url";

import { PlayerManager } from "chromecast-caf-receiver/cast.framework";
import {
    GenericMediaMetadata,
    LoadRequestData,
    RequestData,
    SeekRequestData,
} from "chromecast-caf-receiver/cast.framework.messages";

import { ICustomCastData } from "./model";

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

        // monkey patch to show the *actual* current time:
        const originalTimeSec = playerManager.getCurrentTimeSec.bind(playerManager);
        playerManager.getCurrentTimeSec = () => {
            return originalTimeSec() + handler.getStartTimeForCurrentMedia();
        };
        const originalDurationSec = playerManager.getDurationSec.bind(playerManager);
        playerManager.getDurationSec = () => {
            const data = handler.getCustomDataForCurrentMedia();
            if (data && data.durationSeconds) {
                return data.durationSeconds;
            }
            return originalDurationSec();
        };

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
        playerManager.setMessageInterceptor(
            "MEDIA_STATUS",
            handler.interceptMediaStatusMessage.bind(handler),
        );
    }

    private readonly customDataMap: {[contentId: string]: ICustomCastData} = {};

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

        this.customDataMap[m.media.contentId] = m.customData;

        if (m.customData && (m.customData as ICustomCastData).durationSeconds) {
            debug("duration <- ", m.customData.durationSeconds);

            // NOTE: the original media.duration property seems to
            // get overriden at some point, so... we override it right back
            // m.media.duration = ;
        }

        debug("LOAD REQUEST", m);
        return m;
    }

    public async interceptSeekMessage(message: SeekRequestData) {
        debug("SEEK REQUEST", message);
        const { playerManager } = this;

        // NOTE: getCurrentTimeSec has been monkey-patched to be the
        // correct absolute time here:
        const now = playerManager.getCurrentTimeSec();
        if (message.relativeTime) {
            const newStartTime = Math.max(0, now + message.relativeTime);
            return this.triggerSeekTo(newStartTime);
        } else if (message.currentTime) {
            return this.triggerSeekTo(message.currentTime);
        } else {
            debug("impossible seek request?");
        }
    }

    public async interceptPlayAgainMessage(message: RequestData) {
        debug("PLAY AGAIN REQUEST", message);
        return this.triggerSeekTo(0);
    }

    public async interceptMediaStatusMessage(message: RequestData) {
        const m = message as unknown as cast.framework.messages.MediaStatus;

        m.currentTime += this.getStartTimeForCurrentMedia();

        // NOTE: this may be unnecessary, but let's make sure that
        // we're using the monkey-patched duration
        m.media.duration = this.playerManager.getDurationSec();

        return m;
    }

    private async triggerSeekTo(newStartTime: number) {
        const media = this.playerManager.getMediaInformation();

        // FIXME don't destroy other query params that may be there
        const oldUrl = urllib.parse(media.contentId);
        oldUrl.search = "?startTime=" + newStartTime;
        const newUrl = urllib.format(oldUrl);
        debug(oldUrl, " -> ", newUrl);

        const customData = this.getCustomDataForCurrentMedia();

        const newRequest = {
            customData: Object.assign({}, customData, {
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

    private getStartTimeForCurrentMedia() {
        const customData = this.getCustomDataForCurrentMedia();
        if (customData) {
            return customData.startTimeAbsolute || 0;
        }
        return 0;
    }

    private getCustomDataForCurrentMedia() {
        // NOTE: for some reason, customData from the LOAD request isn't necessarily here?
        const media = this.playerManager.getMediaInformation();
        if (!media) return;

        return media.customData as ICustomCastData || this.customDataMap[media.contentId];
    }
}
