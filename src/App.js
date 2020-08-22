/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {
  Root,
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

import { Provider } from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './reducers/storeConfig';

import {addAccount, deleteAccount} from './actions/index';

const App: () => React$Node = () => {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
          <SafeAreaView>
            <Container>
              <Header>
                <Body>
                  <Title>test 3</Title>
                </Body>
              </Header>
              <Content>
                <Text>Contenddt</Text>
              </Content>
              <Footer>
                <FooterTab>
                  <Button vertical>
                    <Text>Compte </Text>
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
                    <Text>Résa</Text>
                  </Button>
                </FooterTab>
              </Footer>
            </Container>
          </SafeAreaView>
      </PersistGate>
    </Provider>
  );
};

export default App;
