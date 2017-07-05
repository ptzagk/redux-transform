import * as Redux from "redux";

import * as types from "../../types";

export function generateErrorAction<A extends Redux.Action>(
    action: A,
    error: Error,
): types.ErrorAction<A> {
    return {
        error,
        __reduxTransformError__: true,
        type: action.type,

    };
}

export function isTransformErrorAction<A extends types.AnyAction>(
    action: types.TransformAction<A>,
): action is types.ErrorAction<A> {
    return (action as types.ErrorAction<A>).__reduxTransformError__ !== undefined;
}
