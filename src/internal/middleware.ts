import * as Redux from "redux";
import isError from "lodash-es/isError";

import asyncProcess from "./asyncProcess";
import { asyncSymbol, transformerMapSymbol } from "./symbols";
import syncProcess from "./syncProcess";

import * as types from "../types";

export default <S>(store: Redux.MiddlewareAPI<S>) => (next: Redux.Dispatch<S>) =>
    <A extends types.Action>(action: A) => {
        function handleOutput(output: types.ProcessOutput<A>): void {
            if (isError(output)) {
                const errorAction = {
                    type: action.type,
                    error: output,
                };
                next(errorAction);
            } else {
                next(output);
            }
        }

        if (action[transformerMapSymbol]) {
            const processInput = {
                action,
                state: store.getState(),
                transformerMap: action[transformerMapSymbol],
            };

            if (action[asyncSymbol]) {
                return asyncProcess(processInput).then(handleOutput);
            } else {
                handleOutput(syncProcess(processInput));
            }
        } else {
            next(action);
        }
    }
