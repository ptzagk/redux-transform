
import { isError, TransformAction } from "redux-transform";

import { Stream, Transaction, TransactionType } from "actions/transaction";

export interface TransactionFormState {
    target: string;
    transactionType: TransactionType;
    amount: number;
}

const initialState: TransactionFormState = {
    target: "mango",
    transactionType: "DEPOSIT",
    amount: 100,
};

export type Action = Stream | TransformAction<Transaction>;

export default function transactionForm(state = initialState, action: Action): TransactionFormState {
    switch (action.type) {
        case "TRANSACTION_FORM_STREAM_NAME":
            return { ...state, target: action.field };
        case "TRANSACTION_FORM_STREAM_TRANSACTION_TYPE":
            return { ...state, transactionType: action.field };
        case "TRANSACTION_FORM_STREAM_AMOUNT":
            return { ...state, amount: Number(action.field) };
        case "DEPOSIT":
        case "WITHDRAWAL":
            if (isError(action)) {
                return state;
            } else {
                return initialState;
            }
        default:
            return state;
    }
}
