import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as FavoritesActions from './modules/favorites'
import * as NavigationActions from './modules/navigation'
import * as SettingsActions from './modules/settings'
import * as FileExplorerActions from './modules/fileExplorer'

const defaultOptions = {
    state: [
        'favorites',
        'navigation',
        'settings',
        'fileExplorer'
    ]
};

export default (component, options = {}) => {
    options = {
        ...defaultOptions,
        ...options
    };

    return connect(
        (state) => {
            // Map state to props
            let newState = {};
            if (options.state.length === defaultOptions.length) {
                newState = state;
            } else {
                options.state.map(item => {
                    newState[item] = state[item];
                })
            }
            return {
                state: newState
            }
        },
        (dispatch) => {
            // Map dispatch to props
            return {
                actions: {
                    favorites: bindActionCreators(FavoritesActions, dispatch),
                    navigation: bindActionCreators(NavigationActions, dispatch),
                    settings: bindActionCreators(SettingsActions, dispatch),
                    fileExplorer: bindActionCreators(FileExplorerActions, dispatch)
                }
            }
        }
    )(component)
}

