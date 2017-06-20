import { generateErrorAction } from "./utils/error";

import * as types from "../types";

export interface FieldResult<A extends types.Action, K extends keyof A> {
    fieldKey: K;
    value: A[K];
}

export default function asyncProcess<S, A extends types.Action>({
    state,
    action,
    transformerMap,
}: types.AsyncProcessInput<S, A>): Promise<types.TransformAction<A>> {

    function transformField<A extends types.Action, K extends keyof A>(
        fieldKey: K
    ): Promise<FieldResult<A,K>> {
        const transformers = transformerMap[fieldKey]!;
        const baseTransformerInput = { action, fieldKey, state };
        const result = transformers.reduce((result, transformer) => {
            return result.then((value) => {
                return transformer({ ...baseTransformerInput, field: value });
            })
        }, Promise.resolve(action[fieldKey]));
        return result.then((value) => ({ fieldKey, value }));
    }

    function getFieldResults<A extends types.Action, K extends keyof A>(): Array<Promise<FieldResult<A, K>>> {
        const transformedFields: Array<Promise<FieldResult<A, K>>> = [];
        for (const fieldKey of Object.keys(transformerMap)) {
            transformedFields.push(transformField(fieldKey as K));
        }
        return transformedFields;
    }

    function getTransformedFields<A extends types.Action, K extends keyof A>(
        fieldResults: Array<FieldResult<A, K>>
    ): types.TransformedFields<A> {
        const transformedFields: types.TransformedFields<A> = {};
        for (const { fieldKey, value } of fieldResults) {
            transformedFields[fieldKey] = value;
        }
        return transformedFields;
    }

    return Promise.all(getFieldResults())
        .then(getTransformedFields)
        .catch(generateErrorAction)
    }
