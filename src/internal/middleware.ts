import * as Redux from "redux";

import asyncProcess from "./asyncProcess";
import { asyncSymbol, transformerMapSymbol } from "./symbols";
import syncProcess from "./syncProcess";
import { generateErrorAction } from "./utils/error";
import { isTransformedAction } from "./utils/middleware";

import * as types from "../types";

export default <S>(store: Redux.MiddlewareAPI<S>) => (next: Redux.Dispatch<S>) =>
    <A extends types.AnyAction>(action: A): A | types.ErrorAction<A> | Promise<A | types.ErrorAction<A>> => {

        function handleOutput(output: types.ProcessOutput<A>) {
            if (isTransformedAction(output)) {
                return next(output);
            } else {
                return next(generateErrorAction(action, output));
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
                return handleOutput(syncProcess(processInput));
            }
        } else {
            return next(action);
        }
    };
