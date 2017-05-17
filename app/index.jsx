import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { render } from 'react-dom'
import { ipcRenderer } from 'electron'
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
        state: PropTypes.object,
        actions: PropTypes.object
    }

    componentDidMount() {
        const {actions} = this.props;
        let body = document.body;
        body.className = this.props.state.settings.theme;
        //
        //
        //
        ipcRenderer.on('window-listener', (event, arg) => {
            console.info(arg)
        })
        ipcRenderer.on('module', (event, arg) => {
            console.info(arg)
            if (!arg.module || !arg.action || !arg.data) {
                return
            }
            if (!actions[arg.module] || !actions[arg.module][arg.action]) {
                return
            }
            switch (arg.module) {
                case 'favorites':
                    if (arg.action === 'linkAdd') {
                        actions[arg.module][arg.action](arg.data.favoriteId, arg.data.file)
                    }
                    break;
                case 'navigation':
                    if (arg.action === 'goToPage') {
                        actions[arg.module][arg.action](arg.data)
                    }
                    break;
                case 'fileExplorer':
                    if (arg.action === 'remove') {
                        // shell.moveItemToTrash(arg.data)
                        actions[arg.module][arg.action](arg.data)
                    }
                    break;
                case 'rename':

            }
        })
        ipcRenderer.send('window-init')
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
           <AppWrapper />
       </Provider>, document.getElementById('root'));
