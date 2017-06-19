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

export type SyncTransformer<S, A extends Redux.Action, K extends keyof A, B> = (
    input: TransformerInput<S, A, K>
) => B;

export type AsyncTransformer<S, A extends Redux.Action, K extends keyof A, B> = (
    input: TransformerInput<S, A, K>
) => Promise<B>;


export type Transformer<S, A extends Redux.Action, K extends keyof A, B> =
    SyncTransformer<S, A, K, B> | AsyncTransformer<S, A, K, B>;

export type SyncTransformerMap<S, A extends Redux.Action> = {
    [K in keyof A]?: Array<SyncTransformer<S, A, K, any>>;
};

export type TransformerMap<S, A extends Redux.Action> = {
    [K in keyof A]?: Array<Transformer<S, A, K, any>>;
};

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

export type ProcessOutput<A extends Redux.Action> = A | Error;
