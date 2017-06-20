import * as Redux from "redux";

import * as types from "../types";

export default function syncProcess<S, A extends types.Action>({
    state,
    action,
    transformerMap,
}: types.SyncProcessInput<S,A>): types.TransformAction<A> {

    function transformField<A extends types.Action, K extends keyof A>(fieldKey: K): A[K] {
        const transformers = transformerMap[fieldKey]!;
        const baseTransformerInput = { action, fieldKey, state };
        return transformers.reduce((value, transformer) => {
            return transformer({ ...baseTransformerInput, field: value });
        }, action[fieldKey]);
    }

    function getTransformedFields<A extends Redux.Action>(action: A): types.TransformedFields<A> {
        const transformedFields: types.TransformedFields<A> = {};
        for (const fieldKey of Object.keys(transformerMap)) {
            transformedFields[fieldKey] = transformField(fieldKey);
        }
        return transformedFields;
    }

    const transformedFields = getTransformedFields(action);

    return Object.assign({}, action, transformedFields);
}
