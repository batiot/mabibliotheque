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
        <List selected>
          {Object.values(accounts).map((account) => (
            <ListItem key={account.cardId}>
              <Body>
                <Text>
                  {account.userName} - N°{account.cardId}
                </Text>
                <Text note>
                  {account.cardStartDate}
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

const mapStateToProps = (state) => ({
  accounts: state.accounts,
});

const mapDispatchToProps = (dispatch) => {
  return {
    deleteAccount: (cardId) => dispatch(deleteAccount(cardId)),
    //TODO also delete loan and reservation
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountListScreen);
