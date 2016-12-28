import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import configureStore from './store/configureStore';
import './app.global.less';
// Local store into JSON file
import Storage from './utils/storage'
import defaultSettings from './settings.default'
const settings = new Storage({
    // We'll call our data file 'user-preferences'
    configName: 'settings',
    defaults: defaultSettings
});
console.log( settings );
const store = configureStore(settings.get( 'state' ));
const history = syncHistoryWithStore( hashHistory, store );

store.subscribe(( ) => {
    // Update local storage store.getState()
    settings.set('state', store.getState( ))
});

render(
    <Provider store={store}>
    <Router history={history} routes={routes}/>
</Provider>, document.getElementById( 'root' ));
