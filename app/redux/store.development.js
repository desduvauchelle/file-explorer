import { createStore, applyMiddleware } from 'redux'
import createLogger from 'redux-logger'
import rootReducer from './reducers'

const logger = createLogger({
    level: 'info',
    collapsed: true
});

const enhancer = applyMiddleware(logger);

export default function configureStore(initialState) {
    const store = createStore(rootReducer, initialState, enhancer);
    if (module.hot) {
        module.hot.accept('./reducers', () => store.replaceReducer(require('./reducers')));
    }
    return store;
}
