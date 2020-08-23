 
import { ADD_ACCOUNT, DELETE_ACCOUNT } from "../actions/actionTypes";

const initialStateAccounts=[{"uuid":1, "name":"david"},{"uuid":2, "name":"lisa"},{"uuid":3, "name":"charlie"},{"uuid":4, "name":"émie"}];
export default function(state=initialStateAccounts, action){
  switch (action.type) {
    case ADD_ACCOUNT:{
      return [...state, action.data];
    }
    case DELETE_ACCOUNT: {
			return state.filter(account => account.uuid !== action.uuid);
		}
		default: {
			return state;
		}
  }
  return count;
}
