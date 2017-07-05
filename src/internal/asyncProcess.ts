import { identity } from "./utils/general";

import * as types from "../types";

export default function asyncProcess<S, A extends types.AnyAction>({
    state,
    action,
    transformerMap,
}: types.AsyncProcessInput<S, A>): Promise<types.ProcessOutput<A>> {

    function transformField<A extends types.AnyAction, K extends keyof A>(
        fieldKey: K,
    ): Promise<types.FieldResult<A , K>> {
        const transformers = transformerMap[fieldKey]!;
        const baseTransformerInput = { action, fieldKey, state };
        const finalResult = transformers.reduce((result, transformer) => {
            return result.then((value) => {
                return transformer({ ...baseTransformerInput, field: value });
            });
        }, Promise.resolve(action[fieldKey]));
        return finalResult.then((value) => ({ fieldKey, value }));
    }

    function getFieldResults<A extends types.AnyAction, K extends keyof A>(): Array<Promise<types.FieldResult<A, K>>> {
        const transformedFields: Array<Promise<types.FieldResult<A, K>>> = [];
        for (const fieldKey of Object.keys(transformerMap)) {
            transformedFields.push(transformField(fieldKey as K));
        }
        return transformedFields;
    }

    function getTransformedFields<A extends types.AnyAction, K extends keyof A>(
        FieldResults: Array<types.FieldResult<A, K>>,
    ): types.TransformedFields<A> {
        const transformedFields: types.TransformedFields<A> = {};
        for (const { fieldKey, value } of FieldResults) {
            transformedFields[fieldKey] = value;
        }
        return transformedFields;
    }

    return Promise.all(getFieldResults())
        .then(getTransformedFields)
        .then((transformedFields) => {
            return Object.assign({}, action, transformedFields);
        })
        .catch(identity);
    }
