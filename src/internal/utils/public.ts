import { asyncSymbol, transformerMapSymbol } from "../symbols";

import * as types from "../../types";

export interface TransformInput<S, A extends types.Action> {
    action: A;
    transformerMap: types.TransformerMap<S, A>;
}

export function transform<S, A extends types.Action>({
    action,
    transformerMap,
}: TransformInput<S, A>): A {
    const transformation = {
        [asyncSymbol]: true,
        [transformerMapSymbol]: transformerMap,
    };
    return Object.assign({}, action, transformation);
}

export interface ValidateSyncInput<S, A extends types.Action> {
    action: A;
    transformerMap: types.SyncTransformerMap<S, A>;
}

export function transformSync<S, A extends types.Action>({
    action,
    transformerMap,
}: ValidateSyncInput<S, A>): A {
    const validation = {
        [asyncSymbol]: false,
        [transformerMapSymbol]: transformerMap,
    };
    return Object.assign({}, action, validation);
}
