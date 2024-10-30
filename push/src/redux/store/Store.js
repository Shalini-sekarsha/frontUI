import { configureStore } from "@reduxjs/toolkit";
import OverallReducer from "../reducers/OverallReducer";

//Its a static don't change this file

const store = configureStore({
  reducer: OverallReducer,
  devTools:
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__(),
});

export default store;
