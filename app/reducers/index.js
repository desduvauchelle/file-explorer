import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import favorites from './favorites'
import view from './view'

export default combineReducers({
    view,
    favorites,
    routing
});