import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import ExplorerPage from './containers/ExplorerPage';
import SettingsPage from './containers/SettingsPage';

export default(
    <Route path="/" component={App}>
        <IndexRoute component={ExplorerPage}/>
        <Route path="/settings" component={SettingsPage}/>
    </Route>
);
