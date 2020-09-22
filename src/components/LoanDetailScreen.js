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

function LoanDetailScreen({route, loans, accounts, navigation}) {
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
            <Text>Prêt jusqu'au {currDateLabel}  </Text>
            <Button>
              <Text>Prolonger</Text>
            </Button>
          </CardItem>
        </Card>
      </Content>
    </>
  );
}

const mapStateToProps = (state) => ({
  loans: state.loans,
  accounts: state.accounts,
});

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(LoanDetailScreen);
