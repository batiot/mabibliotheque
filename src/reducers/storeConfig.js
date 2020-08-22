import { createStore, combineReducers } from 'redux';
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from '@react-native-community/async-storage'
import accountReducer from './accountReducer.js';

const persistConfig = {
	key: "mabibliotheque",
	storage: AsyncStorage
};


const allReducers = combineReducers({
    account: accountReducer,
	//loan: loanReducer,
});

const persistedReducer = persistReducer(persistConfig, allReducers);

//let composeEnhancers = compose;

//if (__DEV__) {
//	composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
//}

export const store = createStore(
	persistedReducer
	//composeEnhancers(applyMiddleware(thunk))
);

export const persistor = persistStore(store);