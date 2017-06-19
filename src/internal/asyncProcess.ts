import * as types from "../types";

export interface FieldResult {
    fieldKey: string;
    val: any;
}

export default function asyncProcess<S, A extends types.Action>({
    state,
    action,
    transformerMap,
}: types.AsyncProcessInput<S, A>): Promise<types.ProcessOutput<A>> {

    function getFieldResult<K extends keyof A>(
        fieldKey: K,
    ): Promise<FieldResult> {
        const transformers = transformerMap[fieldKey]!;
        const baseTransformerInput = { action, fieldKey, state };
        return transformers.reduce((result, transformer) => {
            return result.then((val: any) =>
                transformer({ ...baseTransformerInput, field: val })
            );
        }, Promise.resolve(action[fieldKey]))
        .then((val) => ({
            fieldKey,
            val
        }));
    }

    function getTransformedFields(): Promise<FieldResult>[] {
        const transformedFields = [];
        for (const fieldKey of Object.keys(transformerMap)) {
            transformedFields.push(getFieldResult(fieldKey));
        }
        return transformedFields;
    }

    return Promise.all(getTransformedFields())
        .then((transformedFields) => {
            const output = action;
            for (const { fieldKey, val } of transformedFields) {
                output[fieldKey] = val;
            }
            return output;
        })
        .catch((error) => {
            return error;
        });
    }
