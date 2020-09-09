import _debug from "debug";
const debug = _debug("shougun:events");

import { events } from "the-mall/macro";

import { IError, IRecommendation, IShougunState, IUiState } from "./store";

export const addRecommendations = events.store((
    db: IShougunState,
    recommendations: IRecommendation[],
) => {
    const updated = { ...db };

    debug("add recommendations:", recommendations);
    if (!updated.recommendations) {
        // initial results
        updated.recommendations = recommendations;
    } else {
        // concat
        updated.recommendations = [
            ... updated.recommendations,
            ...recommendations,
        ];
    }

    return updated;
});

export const setRecommendations = events.store((
    db: IShougunState,
    recommendations: IRecommendation[],
) => {
    const updated: IShougunState = {
        ...db,
        error: undefined, // clear error, ui state
        ui: undefined,

        recommendations,
    };

    debug("set recommendations:", recommendations);
    return updated;
});

export const setError = events.store((
    db: IShougunState,
    error: IError | undefined,
) => ({
    ...db,
    error,
} as IShougunState));

export const setUiState = events.store((
    db: IShougunState,
    ui: IUiState | undefined,
) => ({
    ...db,
    ui,

    // also clear any error state
    error: undefined,
} as IShougunState));

export const setPlaying = events.store((
    db: IShougunState,
    isPlaying: boolean,
) => ({
    ...db,
    isPlaying,

    // clear any error when we start playing
    error: isPlaying ? undefined : db.error,
} as IShougunState));
