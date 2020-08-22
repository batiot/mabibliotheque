 
import { ADD_ACCOUNT, DELETE_ACCOUNT } from "../actions/actionTypes";

const initialAccounts=[];
export default function(state=initialAccounts, action){
  switch (action.type) {
    case ADD_ACCOUNT:{
      return [...state, action.data];
    }
    case DELETE_ACCOUNT: {
			return state.filter(account => account.uid !== action.uid);
		}
		default: {
			return state;
		}
  }
  return count;
}
