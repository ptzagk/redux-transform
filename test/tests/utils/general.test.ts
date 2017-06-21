import { identity } from "../../../src/internal/utils/general";

describe("general utils", () => {

    describe("identity", () => {
        test("returns what arg it's given", () => {
            expect(identity(10)).toBe(10);
            expect(identity("there")).toBe("there");
            expect(identity([])).toEqual([]);
            expect(identity({})).toEqual({});
        });
    });
});
