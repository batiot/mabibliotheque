import React, {Component} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {
  Container,
  Footer,
  FooterTab,
  Button,
  Icon,
  Text,
  Badge,
  View,
  Root,
  StyleProvider,
} from 'native-base';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';
import AccountListScreen from '../components/AccountListScreen';
import AccountDetailScreen from '../components/AccountDetailScreen';
import LoanListScreen from '../components/LoanListScreen';
import {connect} from 'react-redux';

function LoanTab() {
  return <LoanListScreen></LoanListScreen>;
}
function BookingTab() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Bientôt, gérez ici vos réservations</Text>
    </View>
  );
}

function AccountTab() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="AccountList" component={AccountListScreen} />
      <Stack.Screen name="AccountDetail" component={AccountDetailScreen} />
    </Stack.Navigator>
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
              vertical
              badge={!!options.tabBarBadge}
              key={route.key}
              active={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}>
              {options.tabBarBadge ? (
                <Badge>
                  <Text>{options.tabBarBadge}</Text>
                </Badge>
              ) : null}
              {options.tabBarIcon ? options.tabBarIcon : null}
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
      <Root>
        <StyleProvider style={getTheme(material)}>
          <Container>
            <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}>
              <Tab.Screen
                name="accountTab"
                component={AccountTab}
                options={{
                  tabBarLabel: 'Carte',
                  tabBarIcon: <Icon active type="FontAwesome5" name="user" />,
                }}
              />
              <Tab.Screen
                name="loanTab"
                component={LoanTab}
                options={{
                  tabBarLabel: 'Prêt',
                  tabBarIcon: <Icon type="FontAwesome5" name="book-open" />,
                }}
              />
              <Tab.Screen
                name="bookingTab"
                component={BookingTab}
                options={{
                  tabBarLabel: 'Résa',
                  tabBarIcon: <Icon type="FontAwesome5" name="bookmark" />,
                }}
              />
            </Tab.Navigator>
          </Container>
        </StyleProvider>
      </Root>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
