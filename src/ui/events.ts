import { events } from "the-mall";

import { IRecommendation, IShougunState } from "./store";

export const addRecommendations = events.store((
    db: IShougunState,
    recommendations: IRecommendation[],
) => {
    const updated = { ...db };

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
