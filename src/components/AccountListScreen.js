import React from 'react';
import {
  Button,
  Text,
  List,
  ListItem,
  Body,
  Right,
  Icon,
  Fab,
  View,
  Header,
  Title,
} from 'native-base';
import material from '../../native-base-theme/variables/material';
import {connect} from 'react-redux';
import {
  deleteAccount,
  fetchAccountPending,
  fetchAccountSuccess,
  fetchAccountError,
} from '../actions/accountAction';
import {WS} from '../services';

function AccountListScreen({accounts, navigation, deleteAccount}) {
  return (
    <>
      <Header>
        <Body>
          <Title>Liste des cartes</Title>
        </Body>
      </Header>
      <View style={{flex: 1}}>
        <List>
          {Object.values(accounts).map((account) => (
            <ListItem key={account.cardId}>
              <Body>
                <Text key={account.cardId}>
                  {account.userName} - N°{account.cardId}
                </Text>
              </Body>
              <Right>
                <Button
                  transparent
                  onPress={() => deleteAccount(account.cardId)}>
                  <Icon active type="FontAwesome5" name="trash-alt" />
                </Button>
              </Right>
            </ListItem>
          ))}
        </List>
        <Fab
          active={true}
          position="bottomRight"
          onPress={() => navigation.navigate('AccountDetail')}
          containerStyle={{}}
          style={{backgroundColor: material.brandPrimary}}>
          <Icon  type="FontAwesome5" name="plus" />
        </Fab>
      </View>
    </>
  );
}

function loginThunk(credentials) {
  // Redux Thunk will inject dispatch here:
  return (dispatch) => {
    // Reducers may handle this to set a flag like isFetching
    dispatch(fetchAccountPending(credentials.cardId));
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
    deleteAccount: (cardId) => dispatch(deleteAccount(cardId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountListScreen);
