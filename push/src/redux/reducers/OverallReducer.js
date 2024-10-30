import { combineReducers } from "redux";
import { TitleReducer } from "./TitleReducer";
import { RequirementReducer } from "./RequirementReducer";

/*
This is an example for reducer
where you can include you data as a key and value 
*/

const OverallReducer = combineReducers({
  title: TitleReducer,
  requirement: RequirementReducer,
});

export default OverallReducer;
