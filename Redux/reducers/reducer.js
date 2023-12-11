import { combineReducers } from "redux";

import cartReducer from "./refreshReducer";

const rootReducer = combineReducers({
  canRefresh: cartReducer,
});

export default rootReducer;
