import { Donation, Signup } from "./actions";
import { State } from "./state";

import * as types from "../../../src/types";

function generateRandomName(): Promise<string> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("gravyocean");
        }, 25);
    });
}

export const randomName: types.AsyncTransformer<State, Signup, "name"> = ({ field }) => {
    if (field === "random") {
        return generateRandomName();
    } else {
        return Promise.resolve(field);
    }
}

export const delayedTrim: types.AsyncTransformer<State, Signup, "name" | "password" | "confirm"> = ({
    field 
}) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(field.trim());
        }, 25);
    })
}
