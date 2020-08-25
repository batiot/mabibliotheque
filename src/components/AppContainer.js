import React, {Component} from 'react';
import {
  Container,
  Header,
  Body,
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
import {addAccount, deleteAccount} from '../actions/index';

class AppContainer extends Component {
  render() {
    return (
      <Container>
        <Header>
          <Title>test 3</Title>
        </Header>
        <Content>
          <Text>Content xx </Text>
          {this.props.accounts.map((account) => (
            <Text key={account.uuid}>{account.userName}</Text>
          ))}
        </Content>
        <Footer>
          <FooterTab>
            <Button vertical onPress={()=>this.props.deleteAccount(1)} >
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

const mapStateToProps = (state) => ({
  accounts: state.accounts,
});

const mapDispatchToProps = (dispatch) => {
  return {
    addAccount: (data) => dispatch(addAccount(data)),
    deleteAccount: (uuid) => dispatch(deleteAccount(uuid)),
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(AppContainer);
