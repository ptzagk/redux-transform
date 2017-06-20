import * as Redux from "redux";

import asyncProcess from "./asyncProcess";
import { asyncSymbol, transformerMapSymbol } from "./symbols";
import syncProcess from "./syncProcess";

import * as types from "../types";

export default <S>(store: Redux.MiddlewareAPI<S>) => (next: Redux.Dispatch<S>) =>
    <A extends types.Action>(action: A) => {

        if (action[transformerMapSymbol]) {
            const processInput = {
                action,
                state: store.getState(),
                transformerMap: action[transformerMapSymbol],
            };

            if (action[asyncSymbol]) {
                return asyncProcess(processInput).then(next);
            } else {
                next(syncProcess(processInput));
            }
        } else {
            next(action);
        }
    }
