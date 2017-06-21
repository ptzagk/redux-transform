import * as React from "react";
import * as Redux from "redux";
import { transform, TransformerMap } from "redux-transform";

import { State } from "reducers";
import { limitToBalance, limitToCap, roundToNearestDollar, trim } from "transformers";

type StreamType =
"TRANSACTION_FORM_STREAM_NAME" |
"TRANSACTION_FORM_STREAM_AMOUNT" |
"TRANSACTION_FORM_STREAM_TRANSACTION_TYPE";

export interface Stream extends Redux.Action {
    type: StreamType;
    field: any;
}

export function streamTarget(event: React.ChangeEvent<HTMLSelectElement>): Stream {
    return {
        type: "TRANSACTION_FORM_STREAM_NAME",
        field: event.target.value,
    };
}

export function streamTransactionType(event: React.ChangeEvent<HTMLSelectElement>): Stream {
    return {
        type: "TRANSACTION_FORM_STREAM_TRANSACTION_TYPE",
        field: event.target.value,
    };
}

export function streamAmount(event: React.ChangeEvent<HTMLSelectElement>): Stream {
    return {
        type: "TRANSACTION_FORM_STREAM_AMOUNT",
        field: event.target.value,
    };
}

export type TransactionType = "DEPOSIT" | "WITHDRAWAL";

export interface Transaction extends Redux.Action {
    type: TransactionType;
    target: string;
    amount: number;
}

function withdrawal(target: string, amount: number): Transaction {
    const action: Transaction = {
        amount,
        target,
        type: "WITHDRAWAL",
    };

    const transformerMap: TransformerMap<State, Transaction> = {
        target: [trim],
        amount: [roundToNearestDollar, limitToBalance],
    };

    return transform({ action, transformerMap });
}

function deposit(target: string, amount: number): Transaction {
    const action: Transaction = {
        target,
        amount,
        type: "DEPOSIT",
    };

    const transformerMap: TransformerMap<State, Transaction> = {
        target: [trim],
        amount: [roundToNearestDollar, limitToCap],
    };

    return transform({ action, transformerMap });
}

export function transaction(target: string, transactionType: string, amount: number): Transaction {
    if (transactionType === "WITHDRAWAL") {
        return withdrawal(target, amount);
    } else {
        return deposit(target, amount);
    }
}
