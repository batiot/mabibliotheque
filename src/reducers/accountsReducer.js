import {ADD_ACCOUNT, DELETE_ACCOUNT} from '../actions/actionTypes';

const initialStateAccounts = [
  {uuid: 1, userName: 'david'},
  {uuid: 2, userName: 'lisa'},
  {uuid: 3, userName: 'charlie'},
  {uuid: 4, userName: 'émie'},
];
const example = {
  userId:145,
  userName: 'mathieu',
  cardId: 18256,
  cardStartDate: '2020-04-23T18:25:43.511Z',
  password: 'mypassword',
  token: '245434254534d354354135',
  loading:false,
  tokenValidUntil: '2012-04-23T18:25:43.511Z',
  reservationLastRefresh: '2012-02-10T18:25:43.511Z',
  loanLastRefresh: '2012-02-23T12:25:43.511Z',
};
export default function (state = initialStateAccounts, action) {
  switch (action.type) {
    case ADD_ACCOUNT: {
      return [...state, action.data];
    }
    case DELETE_ACCOUNT: {
      return state.filter((account) => account.uuid !== action.uuid);
    }
    default: {
      return state;
    }
  }
  return count;
}
