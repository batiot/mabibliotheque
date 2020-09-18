import React from 'react';
import {
  Button,
  Text,
  List,
  ListItem,
  Body,
  Right,
  Icon,
  View,
  Header,
  Title,
  Content
} from 'native-base';
import material from '../../native-base-theme/variables/material';
import {connect} from 'react-redux';
import {
  fetchLoanPending,
  fetchLoanSuccess,
  fetchLoanError,
} from '../actions/loanAction';
import {WS} from '../services';

function LoanListScreen({loans, accounts,navigation, refreshLoans}) {
  return (
    <>
      <Header>
        <Body>
          <Title>Liste des Prêts</Title>
        </Body>
        <Right>
                <Button
                  transparent
                  onPress={() => refreshLoans(accounts)}>
                  <Icon active type="FontAwesome5" name="sync-alt" />
                </Button>
              </Right>
      </Header>
      <Content>
        <List>
          {Object.values(loans).map((loan) => (
            <ListItem key={loan.id}>
                <Text key={loan.id}>{loan.titre}</Text>
            </ListItem>
          ))}
        </List>
      </Content>
    </>
  );
}

function fetchLoansThunk(accounts) {
  // Redux Thunk will inject dispatch here:
  return (dispatch) => {
    // Reducers may handle this to set a flag like isFetching
    //dispatch(fetchLoanPending('1000'));

    let cardId= '965694';
    //Perform the actual API call
    return WS.fetchAccountLoans(accounts[cardId])
      .then((loanList) => {
        //console.log('fetchLoanSuccess', loanList);
        return dispatch(fetchLoanSuccess(cardId,loanList));
      })
      .catch((error) => {
        console.log('fetchLoanError', error);
        //dispatch(fetchLoanError('1000', error));
      });
  };
}

const mapStateToProps = (state) => ({
  loans: state.loans,
  accounts: state.accounts,
});

const mapDispatchToProps = (dispatch) => {
  return {
    refreshLoans: (accounts) => dispatch(fetchLoansThunk(accounts)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoanListScreen);
