import "jest";

import syncProcess from "../../src/internal/syncProcess";
import { isTransformedAction } from "../../src/internal/utils/middleware";

import { donate, Donation } from "./example/actions";
import state, { State } from "./example/state";
import {
    confused,
    makeUnique,
    matchDonationForCool,
    trim,
} from "./example/syncTransformers";

import * as types from "../../src/types";

describe("syncProcess", () => {

    test("returns the original action given an empty transformerMap", () => {
        const action = donate("frank", 10);

        const transformerMap: types.SyncTransformerMap<State, Donation> = {};

        const processInput = {
            action,
            state,
            transformerMap,
        };

        expect(syncProcess(processInput)).toEqual(action);
    });

    test("returns transformed action given a non-empty transformerMap", () => {
        const action = donate("  frankcool  ", 1000);

        const transformerMap: types.SyncTransformerMap<State, Donation> = {
            name: [ trim, makeUnique ],
            amount: [matchDonationForCool],
        };

        const processInput = {
            action,
            state,
            transformerMap,
        };

        const transformedAction = {
            type: "DONATE",
            name: "frankcoolu",
            amount: 2000,
        };

        expect(syncProcess(processInput)).toEqual(transformedAction);
    });

    test("external errors are handled gracefully", () => {
        const action = donate("frank", 10);

        const transformerMap: types.SyncTransformerMap<State, Donation> = {
            name: [confused],
            amount: [matchDonationForCool],
        };

        const processInput = {
            action,
            state,
            transformerMap,
        };

        expect(isTransformedAction(syncProcess(processInput))).toBe(false);
    });
});
