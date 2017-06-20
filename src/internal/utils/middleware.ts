import { transformerMapSymbol } from "../symbols";

import * as types from "../../types";

export function isTransformedAction<A extends types.Action>(output: types.ProcessOutput<A>): action is A {
    return (output as A)[transformerMapSymbol] !== undefined;
}
