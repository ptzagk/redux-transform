import { asyncSymbol, transformerMapSymbol } from "../../../src/internal/symbols";
import { transform, transformSync } from "../../../src/internal/utils/public";

import { donate, Donation, signup, Signup } from "../example/actions";
import { randomName, delayedTrim } from "../example/asyncTransformers";
import state, { State } from "../example/state";
import {
    confused,
    makeUnique,
    matchDonationForCool,
    trim,
} from "../example/syncTransformers";

import * as types from "../../../src/types";

describe("public utils", () => {

    describe("transform", () => {
        const action = signup("frank", "lovelytree", "lovelytree");

        const transformerMap: types.TransformerMap<State, Signup> = {
            name: [trim, randomName, makeUnique,],
            password: [delayedTrim],
        };

        const transformedAction: types.Action = transform({ action, transformerMap });

        test("async is set to true", () => {
            expect(transformedAction[asyncSymbol]).toBe(true);
        });

        test("augments given action with transformation input", () => {
            expect(transformedAction).toEqual({
                ...action,
                [transformerMapSymbol]: transformerMap,
                [asyncSymbol]: true,
            });
        });
    });

    describe("transformSync", () => {
        const action = donate("sugarTrain10", 650);

        const transformerMap: types.SyncTransformerMap<State, Donation> = {
            name: [trim, makeUnique],
            amount: [matchDonationForCool],
        };

        const transformedAction: types.Action = transformSync({ action, transformerMap });

        test("async is set to false", () => {
            expect(transformedAction[asyncSymbol]).toBe(false);
        });

        test("augments given action with transformation input", () => {
            expect(transformedAction).toEqual({
                ...action,
                [transformerMapSymbol]: transformerMap,
                [asyncSymbol]: false,
            });
        });
    });
});
