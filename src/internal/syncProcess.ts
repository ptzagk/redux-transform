import * as types from "../types";

export default function syncProcess<S, A extends types.Action>({
    state,
    action,
    transformerMap,
}: types.SyncProcessInput<S,A>): types.ProcessOutput<A> {
    const output = Object.assign({}, action);

    function processFieldTransformations(fieldKey: string): any {
        const transformers = transformerMap[fieldKey]!;
        const baseTransformerInput = { action, fieldKey, state };
        return transformers.reduce((val, transformer) => {
            return transformer({ ...baseTransformerInput, field: val });
        }, action[fieldKey]);
    }

    for (const fieldKey of Object.keys(transformerMap)) {
        output[fieldKey] = processFieldTransformations(fieldKey);
    }

    return output;
}
