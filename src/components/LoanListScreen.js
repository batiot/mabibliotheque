import React from 'react';
import {
  Button,
  Text,
  List,
  ListItem,
  Body,
  Right,
  Icon,
  Header,
  Title,
  Content,
  Left,
} from 'native-base';
import FastImage from 'react-native-fast-image';
import material from '../../native-base-theme/variables/material';
import {connect} from 'react-redux';
import {
  fetchLoanPending,
  fetchLoanSuccess,
  fetchLoanError,
} from '../actions/loanAction';
import {WS} from '../services';

const LoanPicture = (props) => (
  <FastImage
    style={{width: 50, height: 50}}
    source={{
      uri: props.url,
      priority: FastImage.priority.normal,
      cache: FastImage.cacheControl.immutable,
    }}
    resizeMode={FastImage.resizeMode.contain}
  />
  //          headers: { 'User-Agent':          USER_AGENT},
);

const TypeIcon = (props) => {
  let typeToIconMap = {book: 'book', entry: 'address-book', game: 'gamepad'};
  let iconName = typeToIconMap[props.type];
  if (!iconName) iconName = 'question-circle';
  let color = material.brandPrimary;
  let dayDiff = Math.round(
    (props.dateMax - new Date()) / (1000 * 60 * 60 * 24),
  );
  if (dayDiff <= 0) {
    color = material.brandDanger;
  } else if (dayDiff <= 7) {
    color = material.brandWarning;
  }
  return (
    <Icon active type="FontAwesome5" name={iconName} style={{color: color}} />
  );
};

function LoanListScreen({loans, accounts, navigation, refreshLoans}) {
  return (
    <>
      <Header>
        <Body>
          <Title>Liste des Prêts</Title>
        </Body>
        <Right>
          <Button transparent onPress={() => refreshLoans(accounts, loans)}>
            <Icon active type="FontAwesome5" name="sync-alt" />
          </Button>
        </Right>
      </Header>
      <Content>
        <List>
          {Object.values(loans).map((loan) => (
            <ListItem key={loan.id} icon>
              <Left>
                <TypeIcon
                  type={loan.osirosData.DCType}
                  dateMax={loan.dateMax}
                />
              </Left>
              <Body>
                <Text key={loan.id}> {loan.titre}</Text>
              </Body>
              <Right>
                <LoanPicture url={loan.picture} />
              </Right>
            </ListItem>
          ))}
        </List>
      </Content>
    </>
  );
}

function fetchLoansThunk(accounts, existingLoans) {
  // Redux Thunk will inject dispatch here:
  return async (dispatch) => {
    // Reducers may handle this to set a flag like isFetching
    //dispatch(fetchLoanPending('1000'));
    try {
      let cardId = '965694';
      //Perform the actual API call
      let newLoanList = await WS.fetchAccountLoans(accounts[cardId]);
      //console.log('fetchLoanSuccess', newLoanList);

      //On fait les appel en sequentiel pour ne pas surcharger le serveur
      for (let newLoan of newLoanList) {
        let osirosData = existingLoans
          .filter((loan) => (loan.id = newLoan.id))
          .map((loan) => loan.osirosData)
          .shift();
        if (!osirosData) {
          //appel distant que si on a pas déja l'info
          osirosData = await WS.fetchRemoteNotice(newLoan.id);
        }
        newLoan.osirosData = osirosData;
      }
      //newLoanList = [];
      return dispatch(fetchLoanSuccess(cardId, newLoanList));
    } catch (error) {
      console.log('fetchLoanError', error);
      //dispatch(fetchLoanError('1000', error));
    }
  };
}

const mapStateToProps = (state) => ({
  loans: state.loans,
  accounts: state.accounts,
});

const mapDispatchToProps = (dispatch) => {
  return {
    refreshLoans: (accounts, loans) =>
      dispatch(fetchLoansThunk(accounts, loans)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoanListScreen);
