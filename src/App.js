/**
 * 
 * redux plugin
 *
 */
import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store} from './reducers/storeConfig';
import {persistor} from './reducers/storeConfig';

import AppContainer from './components/AppContainer';

const App: () => React$Node = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
            <AppContainer></AppContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
