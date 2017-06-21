import { applyMiddleware, compose, createStore } from "redux";
import reduxTransform from "redux-transform";

import rootReducer from "reducers";

const enhancer = compose(
  applyMiddleware(reduxTransform),
  (window as any).devToolsExtension ? (window as any).devToolsExtension() : (f: any): any => f,
);

export default (initialState?: object) =>
  createStore(
    rootReducer,
    initialState ? initialState : undefined,
    enhancer,
  );
