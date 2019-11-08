import { sub } from "the-mall";

import { shougunStore } from "./store";

export const isPlaying = sub(() => {
    const store = shougunStore.deref();
    return store.isPlaying;
});

const recommendationsRaw = sub(() => {
    const store = shougunStore.deref();
    return store.recommendations;
});

export const recommendations = sub(() => {
    const all = recommendationsRaw().deref();
    return all || [];
});

export const isLoadingRecommendations = sub(() => {
    const all = recommendationsRaw().deref();
    return !Array.isArray(all);
});
