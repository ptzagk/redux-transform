# Redux Transform

[![Build Status](https://travis-ci.org/contrarian/redux-transform.svg?branch=master)](https://travis-ci.org/contrarian/redux-transform) [![codecov](https://codecov.io/gh/contrarian/redux-transform/branch/master/graph/badge.svg)](https://codecov.io/gh/contrarian/redux-transform) [![codebeat badge](https://codebeat.co/badges/9546d22d-60bf-4447-a77e-693dae34a62e)](https://codebeat.co/projects/github-com-contrarian-redux-transform-master) [![npm version](https://badge.fury.io/js/redux-transform.svg)](https://badge.fury.io/js/redux-transform)

Async friendly transformation middleware for Redux.

# Overview

1. Gist
2. API
3. Complementary Libraries
4. Examples

# Gist

### You define transformers

```typescript
const roundToNearestDollar: SyncTransformer<State, Transaction, "amount"> = ({ field }) => {
    return Math.round(field);
};

const makeUnique: AsyncTransformer<State, Transaction, "ID"> = ({ field, action }) => {
    // uniqueTransactionID calls an endpoint that generates a unique id for a transaction
    return uniqueTransactionID(field, action);
};
```

### You use ```transform``` or ```transformSync``` to specify transformations


```typescript
type TransactionType = "DEPOSIT" | "WITHDRAWAL";

interface Transaction extends Redux.Action {
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
```

### Redux Transform will perform the transformations

- If the transformation succeeds, the transformed action is passed to the next middleware
- If the transformation fails, an error action is passed to the next middleware

### You use the ```isTransformErrorAction``` type guard to check for failure

```typescript

// inside a reducer
case "WITHDRAWAL":
    if (isTransformErrorAction(action)) {
        return { ...state, transformError: action.error };
    } else {                
        return initialState;
    }
```

# API

## Functions

- reduxTransform
- transform
- transformSync
- isTransformErrorAction

### reduxTransform

```reduxTransform``` is the middleware

```typescript

import reduxTransform from "redux-transform";

applyMiddleware(reduxTransform);

```

### transform

```transform``` specifies async transformations for an action

When using ```transform```, you may freely mix sync and async transformations. The transformations for a given field are normalized, and will always be processed strictly left to right.

```typescript
interface TransformInput<S, A extends Redux.Action> {
    action: A;
    transformerMap: TransformerMap<S, A>;
}

transform<A extends Redux.Action>(input: TransformInput) => A;
```

### transformSync

```transformSync``` specifies sync transformations for an action

```typescript
interface TransformSyncInput<S, A extends Redux.Action> {
    action: A;
    transformerMap: SyncTransformerMap<S, A>;
}

transformSync<A extends Redux.Action>(input: TransformSyncInput) => A;
```

### isTransformErrorAction

```isTransformErrorAction``` is a type guard that is used to detect a transformation error

```typescript
isTransformErrorAction<A extends Redux.Action>(action: TransformAction<A>): action is TransformErrorAction<A>
```

## Types/Interfaces

- AsyncTransformer
- SyncTransformer
- SyncTransformerMap
- Transformer
- TransformerMap
- TransformAction

```Only the above types/interfaces are exported. Other types/interfaces are also listed below for clarity.```

### AsyncTransformer

```typescript
// TransformerInput is used for both AsyncTransformers and SyncTransformers
interface TransformerInput<S, A extends Redux.Action, K extends keyof A> {
    fieldKey: K;
    field: A[K];
    action: A;
    state: S;
}

type AsyncTransformer<S, A extends Redux.Action, K extends keyof A> = (
    input: TransformerInput<S, A, K>,
) => Promise<A[K]>;
```

### SyncTransformer

```typescript
type SyncTransformer<S, A extends Redux.Action, K extends keyof A> = (
    input: TransformerInput<S, A, K>,
) => A[K];
```

### SyncTransformerMap

```typescript
type SyncTransformerMap<S, A extends Redux.Action> = {
    [K in keyof A]?: Array<SyncTransformer<S, A, K>>;
};
```

### Transformer

```typescript
type Transformer<S, A extends Redux.Action, K extends keyof A> =
    SyncTransformer<S, A, K> | AsyncTransformer<S, A, K>;
```

### TransformerMap

```typescript
export type TransformerMap<S, A extends Redux.Action> = {
    [K in keyof A]?: Array<Transformer<S, A, K>>;
};
```

### TransformAction

```typescript
interface ErrorActionHelp<A extends Redux.Action, T extends keyof A> {
    __reduxTransformError__: boolean;
    type: A[T];
    error: Error;
}

type ErrorAction<A extends Redux.Action> = ErrorActionHelp<A, "type">;

type TransformAction<A extends Redux.Action> = A | ErrorAction<A>;
```
# Complementary Libraries

1. [Redux TSA](https://github.com/contrarian/redux-tsa): lets you validate the properties of an action in much the same way that Redux Transform lets transform the properties of an action. 

# Examples

An example application using Redux TSA:
- [TypeScript](https://github.com/contrarian/redux-transform/tree/master/examples/ts)
- [JavaScript](https://github.com/contrarian/redux-transform/tree/master/examples/js)
