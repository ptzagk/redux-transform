import { transform, transformSync } from "../../../src/internal/utils/public";
import { isTransformedAction } from "../../../src/internal/utils/middleware";

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

describe("middleware utils", () => {

    describe("isTransformedAction", () => {

        test("recognizes an async transformed action", () => {
            const action = signup("frank", "lovelytree", "lovelytree");

            const transformerMap: types.TransformerMap<State, Signup> = {
                name: [trim, randomName, makeUnique,],
                password: [delayedTrim],
            };

            const transformedAction: types.AnyAction = transform({ action, transformerMap });

            expect(isTransformedAction(transformedAction)).toBe(true);
        });

        test("recognizes a sync transformed action", () => {
            const action = donate("sugarTrain10", 650);

            const transformerMap: types.SyncTransformerMap<State, Donation> = {
                name: [trim, makeUnique],
                amount: [matchDonationForCool],
            };

            const transformedAction: types.AnyAction = transformSync({ action, transformerMap });

            expect(isTransformedAction(transformedAction)).toBe(true);
        });

        test("recognizes that an error is not a transformed action", () => {
            const error = Error("terrible");

            expect(isTransformedAction(error)).toBe(false);
        });
    });
});
