import "jest";

import asyncProcess from "../../src/internal/asyncProcess";
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

describe("asyncProcess", () => {

    test("returns the original action given an empty transformerMap", async () => {
        const action = donate("frank", 10);

        const transformerMap: types.SyncTransformerMap<State, Donation> = {};

        const processInput = {
            action,
            state,
            transformerMap,
        };

        const result = await asyncProcess(processInput);

        expect(result).toEqual(action);
    });

    test("returns transformed action given a non-empty transformerMap", async () => {
        const action = donate("  frankcool  ", 1000);

        const transformerMap: types.SyncTransformerMap<State, Donation> = {
            name: [trim, makeUnique],
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

        const result = await asyncProcess(processInput);

        expect(result).toEqual(transformedAction);
    });

    test("external errors are handled gracefully", async () => {
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

        const result = await asyncProcess(processInput);

        expect(isTransformedAction(result)).toBe(false);
    });
});
