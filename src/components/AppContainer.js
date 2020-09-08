import React, {Component} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
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
  Left,
  View,
} from 'native-base';
import Accounts from '../components/Accounts';
import {connect} from 'react-redux';

function LoanScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Prêt</Text>
    </View>
  );
}
function BookingScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Réservation</Text>
    </View>
  );
}

function AccountScreen() {
  return (
    <>
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
    </>
  );
}

function MyTabBar({state, descriptors, navigation}) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  if (focusedOptions.tabBarVisible === false) {
    return null;
  }
  return (
    <Footer>
      <FooterTab>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Button
              badge
              vertical={options.tabBarBadge}
              key={route.key}
              active={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}>
              { options.tabBarBadge ?(<Badge><Text>{options.tabBarBadge}</Text></Badge>):null }
              { options.tabBarIcon ? options.tabBarIcon :null }
              <Text>{options.tabBarLabel}</Text>
            </Button>
          );
        })}
      </FooterTab>
    </Footer>
  );
}

const Tab = createBottomTabNavigator();

class AppContainer extends Component {
  render() {
    return (
      <Container>
        <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}>
          <Tab.Screen
            name="account"
            component={AccountScreen}
            options={{tabBarLabel: 'Carte'}}
          />
          <Tab.Screen
            name="loan"
            component={LoanScreen}
            options={{tabBarLabel: 'Prêt', tabBarBadge: 2, tabBarIcon:<Icon name="book" />}}
          />
          <Tab.Screen
            name="booking"
            component={BookingScreen}
            options={{tabBarLabel: 'Résa'}}
          />
        </Tab.Navigator>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
