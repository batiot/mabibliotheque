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
  View,
  Spinner,
  Container,
  Picker
} from 'native-base';
import FastImage from 'react-native-fast-image';
import {TouchableHighlight} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import material from '../../native-base-theme/variables/material';
import {connect} from 'react-redux';
import {fetchLoanByAccount,loanUnCheck,loanCheck,loanSort} from '../actions/loanAction';

const LoanPicture = (props) => (
  <FastImage
    style={{width: 60, height: 70}}
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

function LoanListScreen({loans, accounts, navigation, refreshLoans,dispatchLoanCheck,dispatchLoanUnCheck,dispatchLoanSort}) {
  const renderHiddenItem = () => (
    <ListItem style={{  flex: 1,
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'flex-start',
      paddingRight: 0,
      paddingTop: 0,
      borderColor: 'transparent'
      }}>
      <View
        style={{
          width: 75,
          height: 80,
          alignItems: 'flex-start',
          padding: 25,
        }}>
        <Icon active type="FontAwesome5"  name="lock" />
      </View>
      <View
        style={{
          width: 75,
          height: 80,
          alignItems: 'flex-end',
          padding:20,
        }}>
        <Icon active type="FontAwesome5"  name="unlock-alt" />
      </View>
    </ListItem>
  );

  const renderItem = (data) => (
    <ListItem
      key={data.item.id}
      thumbnail
      onPress={() => navigation.navigate('LoanDetail', {loanId: data.item.id})}
      style={{
        backgroundColor: data.item.check?'#727272':'#f2f2f2'
      }}>
      <Left>
        <LoanPicture url={data.item.picture} />
      </Left>
      <Body>
        <Text key={data.item.id}>{data.item.titre}</Text>
        <TypeText
          type={data.item.notice.typeDocument}
          dateMax={data.item.dateMax}
        />
        {data.item.error && (
          <Text note style={{color: material.brandDanger}}>
            {data.item.error.message}
          </Text>
        )}
      </Body>
    </ListItem>
  );

  const onLeftActionStatusChange = (event) => {
    if(event.isActivated){
      //console.log('onLeftActionStatusChange', event);
      dispatchLoanCheck(event.key);
    }
  };

  const onRightActionStatusChange = (event) => {
    if(event.isActivated){
      //console.log('onRightActionStatusChange', event);
      dispatchLoanUnCheck(event.key);
  }
  };

  return (
    <>
      <Header>
        <Body>
          <Title>{loans.length} prêt(s) en cours.</Title>
        </Body>
        <Right>
            <Picker
              mode="dropdown"
              iosHeader="Trie"
              iosIcon={<Icon name="arrow-down" />}
              style={{ width: undefined, color:material.toolbarInputColor }}
              selectedValue="titre"
              onValueChange={(itemValue, itemIndex) => dispatchLoanSort(itemValue)}
            >
              <Picker.Item label="Carte" value="cardId" />
              <Picker.Item label="Titre" value="titre" />
            </Picker>
          {Object.values(loans).filter((loan) => loan.pending).length == 0 ? (
            <Button transparent onPress={() => refreshLoans(accounts, loans)}>
              <Icon type="FontAwesome5" name="sync-alt" />
            </Button>
          ) : (
            <Spinner></Spinner>
          )}
        </Right>
      </Header>

      <SwipeListView

        style={{
          borderColor: material.listBorderColor,

        }}
        data={Object.values(loans)}
        keyExtractor={(loan) => loan.id.toString()}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        leftActivationValue={75}
        rightActivationValue={-75}
        stopLeftSwipe={300}
        stopRightSwipe={-300}
        onLeftActionStatusChange={onLeftActionStatusChange}
        onRightActionStatusChange={onRightActionStatusChange}
      />
    </>
  );
}

function fetchLoansThunk(accounts, existingLoans) {
  // Redux Thunk will inject dispatch here:
  return async (dispatch) => {
    //Pour chaque account
    for (let cardId of Object.keys(accounts)) {
      await fetchLoanByAccount(dispatch, accounts[cardId], existingLoans);
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
      dispatchLoanCheck: (loanId) => dispatch(loanCheck(loanId)),
      dispatchLoanUnCheck: (loanId) => dispatch(loanUnCheck(loanId)),
      dispatchLoanSort: (sortBy) => dispatch(loanSort(sortBy)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoanListScreen);
