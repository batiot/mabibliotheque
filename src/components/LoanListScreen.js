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
  Picker,
} from 'native-base';
import FastImage from 'react-native-fast-image';
import material from '../../native-base-theme/variables/material';
import {connect} from 'react-redux';
import {
  fetchLoanPending,
  fetchLoanSuccess,
  fetchLoanError,
  fetchLoanByAccount
} from '../actions/loanAction';
import {WS} from '../services';

const LoanPicture = (props) => (
  <FastImage
    style={{width: 60, height: 60}}
    source={{
      uri: props.url,
      priority: FastImage.priority.normal,
      cache: FastImage.cacheControl.immutable,
    }}
    resizeMode={FastImage.resizeMode.contain}
  />
  //          headers: { 'User-Agent':          USER_AGENT},
);
//                <TypeIcon type={loan.notice.DCType} dateMax={loan.dateMax} />
const TypeIcon = (props) => {
  let typeToIconMap = {book: 'book', entry: 'address-book', game: 'gamepad'};
  let iconName = typeToIconMap[props.type];
  if (!iconName) iconName = 'question-circle';
  let color = material.brandPrimary;
  let dayDiff = Math.round(
    (new Date(props.dateMax) - new Date()) / (1000 * 60 * 60 * 24),
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

const TypeText = (props) => {
  let color = material.brandPrimary;
  let dayDiff = Math.round((currDate - new Date()) / (1000 * 60 * 60 * 24));
  if (dayDiff <= 0) {
    color = material.brandDanger;
  } else if (dayDiff <= 7) {
    color = material.brandWarning;
  }
  let currDate = new Date(props.dateMax);
  let currDateLabel =
    currDate.getDate() +
    '/' +
    (currDate.getMonth() + 1) +
    '/' +
    currDate.getFullYear();
  return (
    <Text note style={{color: color}}>
      {props.type} - {currDateLabel}
    </Text>
  );
};

function LoanListScreen({loans, accounts, navigation, refreshLoans}) {
  return (
    <>
      <Header>
        <Body>
          <Title>{loans.length} prêt(s) en cours.</Title>
        </Body>
        <Right>
          <Button transparent onPress={() => refreshLoans(accounts, loans)}>
            <Icon type="FontAwesome5" name="sync-alt" />
          </Button>
        </Right>
      </Header>
      <Content>
      <List>
          {Object.values(loans).map((loan) => (
            <ListItem key={loan.id} thumbnail onPress={() =>
              navigation.navigate('LoanDetail', {loanId: loan.id})
            }>
              <Left>
                <LoanPicture url={loan.picture} />
              </Left>
              <Body>
                <Text key={loan.id}>{loan.titre}</Text>
                <TypeText
                  type={loan.notice.typeDocument}
                  dateMax={loan.dateMax}
                />
              </Body>
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
    //Pour chaque account
    for (let cardId of  Object.keys(accounts)) {
      await fetchLoanByAccount(dispatch, accounts[cardId],existingLoans);
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
