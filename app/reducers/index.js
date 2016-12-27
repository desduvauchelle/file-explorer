import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import favorites from './favorites';

const rootReducer = combineReducers({ favorites, routing });

export default rootReducer;
