
import { ActionTypes } from "../contants/ActionTypes";

export const addClientRequirements = (requirement) => {
  return {
    type: ActionTypes.ADD_CLIENT_REQUIREMENTS,
    payload: requirement,
    
  };
};
