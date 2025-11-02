import { combineReducers } from '@reduxjs/toolkit';
import { productListReducer } from './productReducers';

const rootReducer = combineReducers({
  productList: productListReducer,
});

export default rootReducer;