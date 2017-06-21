import values from "lodash-es/values";
import { connect } from "react-redux";
import * as Redux from "redux";

import * as transactionActions from "actions/transaction";
import TransactionForm from "../components/TransactionForm";

export interface StateFromProps extends TransactionFormState {
    accounts: Account[];
}

function mapStateToProps(state) {
    return {
        ...state.transactionForm,
        accounts: values(state.accounts),
    };
}

export interface DispatchProps {
    streamTarget: (e) => void;
    streamTransactionType: (e) => void;
    streamAmount: (e) => void;
    transaction: (target, transactionType, amount) => void;
}

function mapDispatchToProps(dispatch) {
    return {
        streamTarget(e) {
            dispatch(transactionActions.streamTarget(e));
        },
        streamTransactionType(e) {
            dispatch(transactionActions.streamTransactionType(e));
        },
        streamAmount(e) {
            dispatch(transactionActions.streamAmount(e));
        },
        transaction(target, transactionType, amount) {
            dispatch(transactionActions.transaction(target, transactionType, amount));
        },
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(TransactionForm);
