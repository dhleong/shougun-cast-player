import _debug from "debug";
const debug = _debug("shougun:events");

import { events } from "the-mall";

import { IRecommendation, IShougunState } from "./store";

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
    const updated = {
        ...db,
    };
    updated.recommendations = recommendations;
    debug("set recommendations:", recommendations);

    return updated;
});

export const setPlaying = events.store((
    db: IShougunState,
    isPlaying: boolean,
) => {
    return {
        ...db,
        isPlaying,
    };
});
