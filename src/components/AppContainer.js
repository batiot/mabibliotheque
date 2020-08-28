import React, {Component} from 'react';
import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Icon,
  Text,
  Badge,
} from 'native-base';
import {connect} from 'react-redux';
import {addAccount, deleteAccount,fetchAccountPending,fetchAccountSuccess,fetchAccountError} from '../actions/accountAction';
import {WS} from '../services';

class AppContainer extends Component {
  render() {
    return (
      <Container>
        <Header>
          <Title>test 3</Title>
        </Header>
        <Content>
          <Text>Content v</Text>
          { Object.values(this.props.accounts).map((account) => (
            <Text key={account.cardId}>{account.userName}</Text>
          ))}
          <Button vertical onPress={() => this.props.addAccount({"cardId":965694,"password":"bati"})}>
            <Text>Add Account </Text>
          </Button>
        </Content>
        <Footer>
          <FooterTab>
            <Button vertical onPress={() => this.props.deleteAccount(1)}>
              <Text>Compte a </Text>
            </Button>
            <Button badge vertical>
              <Badge>
                <Text>2</Text>
              </Badge>
              <Icon name="book" />
              <Text>Prêts</Text>
            </Button>
            <Button badge active>
              <Badge>
                <Text>2</Text>
              </Badge>
              <Text>Résa </Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

export function loginThunk(credentials) {
  // Redux Thunk will inject dispatch here:
  return dispatch => {
    // Reducers may handle this to set a flag like isFetching
    //dispatch(fetchAccountPending());
    console.log('fetchAccountPending');
    // Perform the actual API call
    return WS.login(credentials.cardId, credentials.password)
        .then(data=>{
          console.log('fetchAccountSuccess',data);
          //dispatch(fetchAccountSuccess());
       }
    ).catch(error => {
      console.log('fetchAccountError');
      console.log(error);
    });
  }    
}

const mapStateToProps = (state) => ({
  accounts: state.accounts,
});

const mapDispatchToProps = (dispatch) => {
  return {
    addAccount: (credentials) => dispatch(loginThunk(credentials)),
    fetchAccountAndAdd: (credentials) => dispatch(fetchAccountAndAdd(credentials)),
    deleteAccount: (cardId) => dispatch(deleteAccount(cardId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
