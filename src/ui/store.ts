import { createStore } from "the-mall";

export interface IRecommendation {
    cover?: string;
    id: string;
    title: string;
}

export interface IError {
    message: string;
    details?: string;
    stack?: string[];
}

export interface IUiState {
    title?: string;
    body: string;
    isLoading?: boolean;
}

export interface IShougunState {
    isPlaying: boolean;

    error?: IError;
    recommendations?: IRecommendation[];
    ui?: IUiState;
}

export const shougunStore = createStore<IShougunState>({
    isPlaying: false,
});
