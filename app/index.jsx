import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { render } from 'react-dom'
import Helmet from 'react-helmet'

import { Provider } from 'react-redux'
import configureStore from './redux/store'
import ReduxBinder from 'alias-redux/ReduxBinder'
import './app.global.less';
//
// REDUX STORE AND STORAGE
//
import Storage from './utils/storage'
import defaultSettings from './settings.default'
const settings = new Storage({
    configName: 'settings',
    defaults: defaultSettings
});
console.log(settings);
const store = configureStore(settings.get('state'));
store.subscribe(() => {
    // Update local storage store.getState()
    settings.set('state', store.getState())
});

//
// PAGES
//
import ExplorerPage from './pages/ExplorerPage';
import SettingsPage from './pages/SettingsPage';
//
// APP
//
class App extends Component {
    static propTypes = {
        state: PropTypes.object
    }

    componentDidMount() {
        let body = document.body;
        body.className = this.props.state.settings.theme;
    }
    componentWillReceiveProps(nextProps) {
        let body = document.body;
        body.className = nextProps.state.settings.theme;
    }

    render() {
        const {page} = this.props.state.navigation
        switch (page) {
            case "settings":
                return <SettingsPage />
            default:
                return <ExplorerPage />

        }
    }
}
const AppWrapper = ReduxBinder(App, {
    state: ['navigation', 'settings']
})
//
// INITIAL RENDER
//
render(<Provider store={store}>
           <div className="full">
               <Helmet titleTemplate="FileExplorer - %s"
                       defaultTitle="FileExplorer" />
               <AppWrapper />
           </div>
       </Provider>, document.getElementById('root'));
