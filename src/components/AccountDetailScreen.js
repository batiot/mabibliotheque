import React from 'react';
import {connect} from 'react-redux';
import {
  Container,
  Header,
  Content,
  Button,
  Left,
  Icon,
  Body,
  Title,
} from 'native-base';

import AccountForm from '../components/AccountForm';

function AccountDetailScreen({navigation}) {
  return (
    <Container>
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Ajout de carte</Title>
        </Body>
      </Header>
      <Content padder>
        <AccountForm></AccountForm>
      </Content>
    </Container>
  );
}

const mapStateToProps = (state) => ({
  accounts: state.accounts,
});

const mapDispatchToProps = (dispatch) => {
  return {
    //addAccount: (credentials) => dispatch(loginThunk(credentials)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountDetailScreen);
