import 'react-native-gesture-handler/jestSetup';
import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';

// persistReducer.js
import { persistReducer as basePersistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');