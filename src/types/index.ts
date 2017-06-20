import * as Redux from "redux";

export interface Action {
    type: any;
    [fieldKey: string]: any;
}

export interface TransformerInput<S, A extends Redux.Action, K extends keyof A> {
    fieldKey: K;
    field: A[K];
    action: A;
    state: S;
}

export type SyncTransformer<S, A extends Redux.Action, K extends keyof A> = (
    input: TransformerInput<S, A, K>
) => A[K];

export type AsyncTransformer<S, A extends Redux.Action, K extends keyof A> = (
    input: TransformerInput<S, A, K>
) => Promise<A[K]>;


export type Transformer<S, A extends Redux.Action, K extends keyof A> =
    SyncTransformer<S, A, K> | AsyncTransformer<S, A, K>;

export type SyncTransformerMap<S, A extends Redux.Action> = {
    [K in keyof A]?: Array<SyncTransformer<S, A, K>>;
};

export type TransformerMap<S, A extends Redux.Action> = {
    [K in keyof A]?: Array<Transformer<S, A, K>>;
};

export type TransformedFields<A extends Redux.Action> = {
    [K in keyof A]?: A[K];
}

export interface BaseProcessInput<S, A extends Redux.Action> {
    action: A;
    state: S;
}

export interface SyncProcessInput<S, A extends Redux.Action> extends BaseProcessInput<S, A> {
    transformerMap: SyncTransformerMap<S, A>;
}

export interface AsyncProcessInput<S, A extends Redux.Action> extends BaseProcessInput<S, A> {
    transformerMap: TransformerMap<S, A>;
}

export interface ErrorActionHelp<A extends Redux.Action, T extends keyof A> {
    __reduxTransformError__: boolean;
    type: A[T];
    error: Error;
}

export type ErrorAction<A extends Redux.Action> = ErrorActionHelp<A, "type">;

export type TransformAction<A extends Redux.Action> = A | ErrorAction<A>;

// export type ProcessOutput<A extends Redux.Action> = TransformAction;
