import * as types from "../types";

export default function syncProcess<S, A extends types.AnyAction>({
    state,
    action,
    transformerMap,
}: types.SyncProcessInput<S, A>): types.ProcessOutput<A> {

    function transformField<A extends types.AnyAction, K extends keyof A>(fieldKey: K): A[K] {
        const transformers = transformerMap[fieldKey]!;
        const baseTransformerInput = { action, fieldKey, state };
        return transformers.reduce((value, transformer) => {
            return transformer({ ...baseTransformerInput, field: value });
        }, action[fieldKey]);
    }

    function getTransformedFields<A extends types.AnyAction>(): types.TransformedFields<A> {
        const transformedFields: types.TransformedFields<A> = {};
        for (const fieldKey of Object.keys(transformerMap)) {
            transformedFields[fieldKey] = transformField(fieldKey);
        }
        return transformedFields;
    }

    try {
        const transformedFields = getTransformedFields();
        return Object.assign({}, action, transformedFields);
    } catch (e) {
        return e;
    }
}
