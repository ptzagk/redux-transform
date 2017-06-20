import "jest";
import * as Redux from "redux";

import reduxTransform from "../../src/internal/middleware";
import { transform, transformSync } from "../../src/internal/utils/public";

import { donate, Donation, login, Login } from "./example/actions";
import getError from "./example/getError";
// import { approved, poetic } from "./example/asyncValidators";
import state, { State } from "./example/state";
import {
    confused,
    makeUnique,
    matchDonationForCool,
    trim,
} from "./example/syncTransformers";

import * as types from "../../src/types";

describe("middleware", () => {
    function getStore(): Redux.MiddlewareAPI<State> {
        return {
            dispatch: jest.fn(),
            getState: () => state,
        };
    }

    describe("non-transformed actions", () => {
        test("passes a non-transformed action to next", () => {
            const store = getStore();
            const next = jest.fn();

            const action = { type: "LOGIN_SUCCESS" };

            reduxTransform(store)(next)(action);

            expect(next).toHaveBeenCalledWith(action);
        });
    });

    describe("sync transformation", () => {

        test("transformed action is passed to next", () => {
            const store = getStore();
            const next = jest.fn();

            const action = donate("  frankcool  ", 1000);

            const transformerMap: types.SyncTransformerMap<State, Donation> = {
                name: [trim, makeUnique],
                amount: [matchDonationForCool],
            };

            const transformedAction = transformSync({ action, transformerMap });

            const expectedTransformedAction = {
                type: "DONATE",
                name: "frankcoolu",
                amount: 2000,
            };

            reduxTransform(store)(next)(transformedAction);

            expect(next).toHaveBeenCalledWith(expectedTransformedAction);
        });

        test("when an action fails sync validation, an error action is passed to next", () => {
            const store = getStore();
            const next = jest.fn();

            const action = donate("frank", 10);

            const transformerMap: types.SyncTransformerMap<State, Donation> = {
                name: [confused],
                amount: [matchDonationForCool],
            };

            const transformedAction = transformSync({ action, transformerMap });

            reduxTransform(store)(next)(transformedAction);

            expect(next).toHaveBeenCalledWith({
                type: "DONATE",
                error: getError(),
                __reduxTransformError__: true,
            });
        });
    });

    describe("async validation", () => {

        test("transformed action is passed to next", async () => {
            const store = getStore();
            const next = jest.fn();

            const action = donate("  frankcool  ", 1000);

            const transformerMap: types.SyncTransformerMap<State, Donation> = {
                name: [trim, makeUnique],
                amount: [matchDonationForCool],
            };

            const transformedAction = transform({ action, transformerMap });

            const expectedTransformedAction = {
                type: "DONATE",
                name: "frankcoolu",
                amount: 2000,
            };

            await reduxTransform(store)(next)(transformedAction);

            expect(next).toHaveBeenCalledWith(expectedTransformedAction);
        });

        test("when an action fails async validation, an error action is passed to next", async () => {
            const store = getStore();
            const next = jest.fn();

            const action = donate("frank", 10);

            const transformerMap: types.SyncTransformerMap<State, Donation> = {
                name: [confused],
                amount: [matchDonationForCool],
            };

            const transformedAction = transform({ action, transformerMap });

            await reduxTransform(store)(next)(transformedAction);

            expect(next).toHaveBeenCalledWith({
                type: "DONATE",
                error: getError(),
                __reduxTransformError__: true,
            });
        });
    });
});
