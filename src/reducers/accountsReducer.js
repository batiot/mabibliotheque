import {
  ADD_ACCOUNT,
  DELETE_ACCOUNT,
  FETCH_ACCOUNT_PENDING,
  FETCH_ACCOUNT_SUCCESS,
  FETCH_ACCOUNT_ERROR,
} from '../actions/actionTypes';

import produce from "immer";

const initialStateAccounts = [
  {uuid: 1, userName: 'david'},
  {uuid: 2, userName: 'lisa'},
  {uuid: 3, userName: 'charlie'},
  {uuid: 4, userName: 'émie'},
];
const example = {
  cardId: 18256,
  cardStartDate: '2020-04-23T18:25:43.511Z',
  password: 'mypassword',
  userId: 145,
  userName: 'mathieu',
  token: '245434254534d354354135',
  loading: false,
  tokenValidUntil: '2012-04-23T18:25:43.511Z',
  reservationLastRefresh: '2012-02-10T18:25:43.511Z',
  loanLastRefresh: '2012-02-23T12:25:43.511Z',
  pending: false,
  error: null,
};
export default function (state = initialStateAccounts, action) {
  switch (action.type) {
    case ADD_ACCOUNT: {
      return [...state, action.account];
    }
    case DELETE_ACCOUNT: {
      return state.filter((account) => account.uuid !== action.uuid);
    }

    case FETCH_ACCOUNT_PENDING:
      return immer.produce(state, draftState => {
          draftState[action.cardId].pending = true
          //draftState[0].address.city = 'Paris'
        });
    case FETCH_ACCOUNT_SUCCESS:
      return {
        ...state,
        pending: false,
        products: action.account,
      };
    case FETCH_ACCOUNT_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    default: {
      return state;
    }
  }
  return count;
}
