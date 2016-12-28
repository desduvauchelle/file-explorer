import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import favorites from './favorites';

export default combineReducers({ 
    favorites,
    routing
});