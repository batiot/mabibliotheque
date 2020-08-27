import { createStore, combineReducers,applyMiddleware } from 'redux';
import { persistStore, persistReducer } from "redux-persist";
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-community/async-storage'
import accountsReducer from './accountsReducer.js';

const persistConfig = {
	key: "mabibliotheque",
	storage: AsyncStorage
};


const allReducers = combineReducers({
    accounts: accountsReducer,
	//loan: loanReducer,
});

const persistedReducer = persistReducer(persistConfig, allReducers);

const middlewares = [thunk];

//let composeEnhancers = compose;

//if (__DEV__) {
//	composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
//}

export const store = createStore(
	persistedReducer,
	applyMiddleware(thunk)
	//composeEnhancers(applyMiddleware(thunk))
);

export const persistor = persistStore(store);