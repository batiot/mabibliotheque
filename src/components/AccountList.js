import React, {Component} from 'react';
import {Container, Button, Text, List, ListItem, Spinner} from 'native-base';
import {connect} from 'react-redux';
import {
  deleteAccount,
  fetchAccountPending,
  fetchAccountSuccess,
  fetchAccountError,
} from '../actions/accountAction';
import {WS} from '../services';

class AccountList extends Component {
  render() {
    return (
      <Container>
        <List>
          {Object.values(this.props.accounts).map((account) => (
            <ListItem key={account.cardId}>
              <Text key={account.cardId}>{account.userName}</Text>
              <Button onPress={() => this.props.deleteAccount(account.cardId)}>
                <Text>Delete</Text>
              </Button>
            </ListItem>
          ))}
        </List>
      </Container>
    );
  }
}


const mapStateToProps = (state) => ({
  accounts: state.accounts,
});

const mapDispatchToProps = (dispatch) => {
  return {
    deleteAccount: (cardId) => dispatch(deleteAccount(cardId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountList);
