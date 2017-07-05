import { transformerMapSymbol } from "../symbols";

import * as types from "../../types";

export function isTransformedAction<A extends types.AnyAction>(output: types.ProcessOutput<A>): output is A {
    return (output as A)[transformerMapSymbol] !== undefined;
}
