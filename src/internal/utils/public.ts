import { asyncSymbol, transformerMapSymbol } from "../symbols";

import * as types from "../../types";

export interface TransformInput<S, A extends types.AnyAction> {
    action: A;
    transformerMap: types.TransformerMap<S, A>;
}

export function transform<S, A extends types.AnyAction>({
    action,
    transformerMap,
}: TransformInput<S, A>): A {
    const transformation = {
        [asyncSymbol]: true,
        [transformerMapSymbol]: transformerMap,
    };
    return Object.assign({}, action, transformation);
}

export interface TransformSyncInput<S, A extends types.AnyAction> {
    action: A;
    transformerMap: types.SyncTransformerMap<S, A>;
}

export function transformSync<S, A extends types.AnyAction>({
    action,
    transformerMap,
}: TransformSyncInput<S, A>): A {
    const validation = {
        [asyncSymbol]: false,
        [transformerMapSymbol]: transformerMap,
    };
    return Object.assign({}, action, validation);
}
