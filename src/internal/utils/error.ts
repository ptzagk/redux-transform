import * as Redux from "redux";

import * as types form "../../types";


export function generateErrorAction<A extends types.Action>(error: Error): types.ErrorAction<A> {
    return {
        error,
        type: action.type,
    }
}

export function isError<A extends Redux.Action>(action: types.TransformAction<A>): action is types.ErrorAction<A> {
    return (action as ErrorAction<A>).__reduxTransformError__ !== undefined;
}
