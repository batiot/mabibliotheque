import React, {Component} from 'react';
import {Container, Button, Text} from 'native-base';
import {connect} from 'react-redux';
import {
  deleteAccount,
  fetchAccountPending,
  fetchAccountSuccess,
  fetchAccountError,
} from '../actions/accountAction';
import {WS} from '../services';

class Accounts extends Component {
  render() {
    return (
      <Container>
        {Object.values(this.props.accounts).map((account) => (
          <Text key={account.cardId}>{account.userName}</Text>
        ))}
        <Button
          onPress={() =>
            this.props.addAccount({cardId: '965694', password: 'bati'})
          }>
          <Text>Add Account</Text>
        </Button>
        <Text>testd </Text>
        <Button onPress={() => this.props.deleteAccount('965694')}>
          <Text>Delete</Text>
        </Button>
        <Button onPress={() => alert('This is Card Header')}>
          <Text>tesft</Text>
        </Button>
      </Container>
    );
  }
}

export function loginThunk(credentials) {
  console.log('loginThunk');
  // Redux Thunk will inject dispatch here:
  return (dispatch) => {
    // Reducers may handle this to set a flag like isFetching
    dispatch(fetchAccountPending(credentials.cardId));
    console.log('fetchAccountPending');

    // Perform the actual API call
    return WS.login(credentials.cardId, credentials.password)
      .then((accountData) => {
        console.log('fetchAccountSuccess', accountData);
        dispatch(fetchAccountSuccess(accountData));
      })
      .catch((error) => {
        console.log('fetchAccountError', error);
        dispatch(fetchAccountError(credentials.cardId, error));
      });
  };
}

const mapStateToProps = (state) => ({
  accounts: state.accounts,
});

const mapDispatchToProps = (dispatch) => {
  return {
    addAccount: (credentials) => dispatch(loginThunk(credentials)),
    deleteAccount: (cardId) => dispatch(deleteAccount(cardId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);
