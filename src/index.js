import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { compose, createStore } from "redux";
import { Provider } from "react-redux";
import { reducer } from "./redux/reducer";
// import { loadState, saveState } from "./localStorage/localStorage";
// import throttle from "lodash.throttle"

// const persistedState = loadState();

const store = createStore(
  reducer,
  // persistedState,
  compose(
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

// store.subscribe(throttle(() => {
//   saveState({
//     selected:store.getState().selected
//   });
// }, 1000));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
