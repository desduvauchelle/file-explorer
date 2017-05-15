import { combineReducers } from 'redux'
//
import favorites from './modules/favorites'
import navigation from './modules/navigation'
import settings from './modules/settings'
import fileExplorer from './modules/fileExplorer'

const rootReducer = combineReducers({
    favorites,
    navigation,
    settings,
    fileExplorer
});

export default rootReducer;
