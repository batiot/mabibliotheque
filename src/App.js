/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
} from 'react-native';


import { Container, Header,Body,Title,Content, Footer, FooterTab, Button, Icon, Text, Badge } from 'native-base';

const App: () => React$Node = () => {
  return (
    <>
      <SafeAreaView>
        <Container>
          <Header>
            <Body>
              <Title>test 3</Title>
            </Body>
          </Header>
          <Content></Content>
          <Footer>
          <FooterTab>
          <Button badge vertical>
              <Badge><Text>2</Text></Badge>
              <Icon name="apps" />
              <Text>Apps</Text>
            </Button>
            <Button vertical>
              <Icon name="camera" />
              <Text>Camera</Text>
            </Button>
            <Button active badge vertical>
              <Badge ><Text>51</Text></Badge>
              <Icon active name="navigate" />
              <Text>Navigate</Text>
            </Button>
            <Button vertical>
              <Icon name="person" />
              <Text>Contact</Text>
            </Button>
          </FooterTab>
          </Footer>
        </Container>
      </SafeAreaView>
    </>
  );
};

export default App;
