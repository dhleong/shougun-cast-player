import { createStore } from "the-mall";

export interface IRecommendation {
    cover?: string;
    id: string;
    title: string;
}
export interface IShougunState {
    isPlaying: boolean;

    recommendations?: IRecommendation[];
}

export const shougunStore = createStore<IShougunState>({
    isPlaying: false,
});
