import {
  ADD_ACCOUNT,
  DELETE_ACCOUNT,
  FETCH_ACCOUNT_PENDING,
  FETCH_ACCOUNT_SUCCESS,
  FETCH_ACCOUNT_ERROR,
} from '../actions/actionTypes';

import produce from 'immer';

const initialStateAccounts = {
  '1': {cardId: '1', userName: 'david'},
  '2': {cardId: '2', userName: 'lisa'},
  '3': {cardId: '3', userName: 'charlie'},
  '4': {cardId: '4', userName: 'émie'},
};
const example = {
  cardId: '18256',
  cardStartDate: '2020-04-23T18:25:43.511Z',
  password: 'mypassword',
  userId: '145',
  userName: 'mathieu',
  token: '245434254534d354354135',
  tokenValidUntil: '2012-04-23T18:25:43.511Z',
  reservationLastRefresh: '2012-02-10T18:25:43.511Z',
  loanLastRefresh: '2012-02-23T12:25:43.511Z',
  cookie:{"domain": null, "httpOnly": false, "name": "PHPSESSID", "path": null, "secure": false, "value": "nb2d5cfmq5amjrer7fdve6be43"},
  pending: false,
  error: null,
};
export default function (state = initialStateAccounts, action) {
  switch (action.type) {
    case DELETE_ACCOUNT: {
      return produce(state, (draftState) => {
        delete draftState[action.payload];
      });
    }
    case FETCH_ACCOUNT_PENDING:
      return produce(state, (draftState) => {
        if(!draftState[action.payload]){
          draftState[action.payload]={};
        }
        draftState[action.payload].pending = true;
        draftState[action.payload].cardId = action.payload;
        draftState[action.payload].userName = '. . .';
        console.log('pending',draftState)
      });
    case FETCH_ACCOUNT_SUCCESS:
      return produce(state, (draftState) => {
        //console.log(action.payload.cardId,draftState,draftState[action.payload.cardId] );
        draftState[action.payload.cardId].pending = false;
        draftState[action.payload.cardId].cardId = action.payload.cardId;
        draftState[action.payload.cardId].cardStartDate =
          action.payload.cardStartDate;
        draftState[action.payload.cardId].userId = action.payload.userId;
        draftState[action.payload.cardId].token = action.payload.token;
        draftState[action.payload.cardId].userName = action.payload.userName;
        draftState[action.payload.cardId].cookie = action.payload.cookie;
        draftState[action.payload.cardId].error = null;
      });
    case FETCH_ACCOUNT_ERROR:
      return produce(state, (draftState) => {
        draftState[action.payload].pending = false;
        draftState[action.payload].error = action.error;
      });
    default: {
      return state;
    }
  }
}
