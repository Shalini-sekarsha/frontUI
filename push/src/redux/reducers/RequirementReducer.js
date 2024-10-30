
import { ActionTypes } from "../contants/ActionTypes";

const initialState = {
  requirements: [],
  clients:[],
};

export const RequirementReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.ADD_CLIENT_REQUIREMENTS:
      return {
        ...state,
        requirements: [...state.requirements, payload],
      };

    default:
      return state;
  }
};
