import { Donation, Signup } from "./actions";
import { State } from "./state";

import * as types from "../../../src/types";

export const trim: types.SyncTransformer<State, Signup | Donation, "name"> = ({
    field
}) => {
    return field.trim()
}

export const matchDonationForCool: types.SyncTransformer<State, Donation, "amount"> = ({
     field,
     action
 }) => {
     if (action.name.includes("cool")) {
         return field * 2;
     } else {
         return field;
     }
 }

 export const makeUnique: types.SyncTransformer<State, Signup | Donation, "name"> = ({
     field,
     action,
     state
 }) => {
     let uniqueName = field;
     while (state.users.includes(uniqueName)) {
        uniqueName += 'u';
    }
    return uniqueName;
 }

 export const confused: types.SyncTransformer<State, types.AnyAction, string> = () => {
     return `${Symbol("there")}`;
 }
