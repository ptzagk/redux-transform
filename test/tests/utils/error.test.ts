import { isTransformErrorAction } from "../../../src/internal/utils/error";

import { donate } from "../example/actions";

describe("error utils", () => {

    describe("isError", () => {
        test("recognizes reduxTransformError action", () => {
            const errorAction = {
                type: "DONATE",
                error: Error("terrible"),
                __reduxTransformError__: true,
            };

            expect(isTransformErrorAction(errorAction)).toBe(true);
        });

        test("recognizes normal action", () => {
            const action = donate("sugarTrain10", 650);

            expect(isTransformErrorAction(action)).toBe(false);
        })
    });
});
