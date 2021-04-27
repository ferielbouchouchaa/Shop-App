import {Provider} from 'react-redux';
import {createStore ,combineReducers, applyMiddleware} from 'redux';
import React from 'react';
import productsReducer from './store/reducers/productsReducer';
import cartReducer from './store/reducers/cartReducer';
import orderReducer from './store/reducers/orderReducer';
import AppNavigator from './Navigation/AppNavigator';
import ReduxThunk from 'redux-thunk';
import authReducer from './store/reducers/authReducer';

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders: orderReducer,
  auth : authReducer
});
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));


const App= () => {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
    
  };

export default App;
