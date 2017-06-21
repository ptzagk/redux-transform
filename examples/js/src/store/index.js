import { applyMiddleware, compose, createStore } from "redux";
import reduxTransform from "redux-transform";

import rootReducer from "reducers";

const enhancer = compose(
  applyMiddleware(reduxTransform),
  devToolsExtension ? devToolsExtension() : (f: any): any => f,
);

export default (initialState?: object) =>
  createStore(
    rootReducer,
    initialState ? initialState : undefined,
    enhancer,
  );
