import { AsyncTransformer, SyncTransformer } from "redux-transform";

import { getAccountCap } from "api";

import { Transaction } from "actions/transaction";
import { State } from "reducers";

export const limitToCap: AsyncTransformer<State, Transaction, "amount"> = ({
    field,
    action,
    state,
}) => {
    return getAccountCap()
        .then((accountCap) => {
            const currentBalance = state.accounts[action.target].balance;
            if ((currentBalance + field) <= accountCap) {
                return field;
            } else {
                return accountCap - currentBalance;
            }
        });
};

export const limitToBalance: SyncTransformer<State, Transaction, "amount"> = ({
    field,
    action,
    state,
}) => {
    const currentBalance = state.accounts[action.target].balance;
    if (field > currentBalance) {
        return currentBalance;
    } else {
        return field;
    }
};

export const trim: SyncTransformer<State, Transaction, "target"> = ({ field }) => {
    return field.trim();
};

export const roundToNearestDollar: SyncTransformer<State, Transaction, "amount"> = ({ field }) => {
    return Math.round(field);
};
