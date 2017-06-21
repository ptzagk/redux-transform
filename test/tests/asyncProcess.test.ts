import "jest";

import asyncProcess from "../../src/internal/asyncProcess";
import { isTransformedAction } from "../../src/internal/utils/middleware";

import { randomName, delayedTrim } from "./example/asyncTransformers";
import { donate, Donation, signup, Signup } from "./example/actions";
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

    test("returns transformed action using only sync transformers", async () => {
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

    test("returns transformed action using only sync transformers", async () => {
        const action = signup("  random  ", " lovelytree  ", " lovelytree  ");

        const transformerMap: types.TransformerMap<State, Signup> = {
            name: [delayedTrim, randomName],
            password: [delayedTrim],
            confirm: [delayedTrim]
        };

        const processInput = {
            action,
            state,
            transformerMap,
        };

        const transformedAction = {
            type: "SIGNUP",
            name: "gravyocean",
            password: "lovelytree",
            confirm: "lovelytree",
        }

        const result = await asyncProcess(processInput);

        expect(result).toEqual(transformedAction);
    });

    test("returns transformed action using only mixed transformers", async () => {
        const action = signup("  random  ", " lovelytree  ", " lovelytree  ");

        const transformerMap: types.TransformerMap<State, Signup> = {
            name: [delayedTrim, randomName, makeUnique ],
            password: [delayedTrim],
            confirm: [delayedTrim]
        };

        const processInput = {
            action,
            state,
            transformerMap,
        };

        const transformedAction = {
            type: "SIGNUP",
            name: "gravyoceanu",
            password: "lovelytree",
            confirm: "lovelytree",
        }

        const result = await asyncProcess(processInput);

        expect(result).toEqual(transformedAction);
    })

    test("external errors are handled gracefully", async () => {
        const action = donate("frank", 10);

        const transformerMap: types.SyncTransformerMap<State, Donation> = {
            name: [ confused ],
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
