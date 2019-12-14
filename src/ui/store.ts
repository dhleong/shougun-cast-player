import { createStore } from "the-mall";

export interface IRecommendation {
    cover?: string;
    id: string;
    title: string;
}

export interface IError {
    message: string;
    detail?: string;
    stack?: string[];
}

export interface IShougunState {
    isPlaying: boolean;

    error?: IError;
    recommendations?: IRecommendation[];
}

export const shougunStore = createStore<IShougunState>({
    isPlaying: false,
});
