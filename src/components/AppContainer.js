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
  Right,
  Body,
  Left
} from 'native-base';
import Accounts from '../components/Accounts';
import {connect} from 'react-redux';

class AppContainer extends Component {
  render() {
    return (
      <Container>
        <Header>
          <Left></Left>
          <Body>
            <Title>test 3</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="search" />
            </Button>
          </Right>
        </Header>
        <Content>
          <Accounts></Accounts>
        </Content>
        <Footer>
          <FooterTab>
            <Button vertical>
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

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
