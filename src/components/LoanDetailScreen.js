import React from 'react';
import {
  Button,
  Text,
  Body,
  Right,
  Icon,
  Header,
  Title,
  Content,
  Left,
  Card,
  CardItem,
} from 'native-base';
import FastImage from 'react-native-fast-image';
import material from '../../native-base-theme/variables/material';
import {connect} from 'react-redux';
import {WS} from '../services';
import {
  fetchLoanPending,
  fetchLoanSuccess,
  fetchLoanError,
  fetchLoanByAccount
} from '../actions/loanAction';

const LoanPicture = (props) => (
  <FastImage
    style={{width: 200, height: 200}}
    source={{
      uri: props.url,
      priority: FastImage.priority.normal,
      cache: FastImage.cacheControl.immutable,
    }}
    resizeMode={FastImage.resizeMode.contain}
  />
  //          headers: { 'User-Agent':          USER_AGENT},
);

function LoanDetailScreen({route, loans, accounts, navigation,prolongation}) {
  const currLoanId = route.params.loanId;
  const currLoan = loans.filter((loan) => loan.id == currLoanId).shift();

  let currDate = new Date(currLoan.dateMax);
  let currDateLabel =
    currDate.getDate() +
    '/' +
    (currDate.getMonth() + 1) +
    '/' +
    currDate.getFullYear();

  return (
    <>
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon active type="FontAwesome5" name="chevron-left" />
          </Button>
        </Left>
        <Body>
          <Title>{currLoan.titre}</Title>
        </Body>
      </Header>
      <Content>
        <Card style={{flex: 0}}>
          <CardItem header bordered>
            <Text>
              {currLoan.notice.typeDocument} - {currLoan.notice.section}
            </Text>
          </CardItem>
          <CardItem>
            <Left>
              <LoanPicture url={currLoan.picture} />
            </Left>
            <Body>
              {currLoan.notice.description ? (
                <Text>
                  <Text style={{fontWeight: 'bold'}}>Résumé : </Text>
                  {'\n'}
                  {currLoan.notice.description}
                  {'\n'}
                </Text>
              ) : null}
              {currLoan.notice.DCFormat ? (
                <Text>
                  <Text style={{fontWeight: 'bold'}}>Format: </Text>
                  {'\n'}
                  {currLoan.notice.DCFormat}
                </Text>
              ) : null}
            </Body>
          </CardItem>
          <CardItem footer bordered>
            <Text>Prêt jusqu'au {currDateLabel}   </Text>
            {currLoan.idProlong?(<Button  disabled={currLoan.pending} onPress={() => prolongation(currLoan.idProlong,accounts[currLoan.cardId],loans)}><Text>Prolonger</Text></Button>):null}
          </CardItem>
        </Card>
      </Content>
    </>
  );
}

function prolongationThunk(idProlong,account, existingLoans) {
  // Redux Thunk will inject dispatch here:
  return async (dispatch) => {
    // Perform the actual API call
    let prolongationSuccess = await WS.prolongation(idProlong);
    //console.log('prolongationSuccess', prolongationSuccess);
    return await fetchLoanByAccount(dispatch, account,existingLoans);
  };
}



const mapStateToProps = (state) => ({
  loans: state.loans,
  accounts: state.accounts,
});

const mapDispatchToProps = (dispatch) => {
  return {
    prolongation: (idProlong,account, loans) => dispatch(prolongationThunk(idProlong,account, loans)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoanDetailScreen);
