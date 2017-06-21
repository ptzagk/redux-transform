import { getAccountCap } from "api";

export const limitToCap = ({
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

export const limitToBalance = ({
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

export const trim = ({ field }) => {
    return field.trim();
};

export const roundToNearestDollar = ({ field }) => {
    return Math.round(field);
};
