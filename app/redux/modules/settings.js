import Path from 'path'
import uuid from 'uuid/v1'

//
// ACTION TYPES
//
const EDIT = "EDIT"
const APP_ADD = "APP_ADD"
const APP_REMOVE = "APP_REMOVE"
const EXTENSIONS_OPEN_WITH_ADD = "EXTENSIONS_OPEN_WITH_ADD"
const EXTENSIONS_OPEN_WITH_REMOVE = "EXTENSIONS_OPEN_WITH_REMOVE"
const PATH_OPEN_WITH_ADD = "PATH_OPEN_WITH_ADD"
const PATH_OPEN_WITH_REMOVE = "PATH_OPEN_WITH_REMOVE"
//
// REDUCER
//

const initialState = {
    showHidden: false,
    theme: 'dark',
    apps: [],
    extensionsOpenWith: [],
    pathsOpenWith: []
};

export default function counter(state = initialState, action = {}) {
    switch (action.type) {
        case EDIT: {
            return {
                ...initialState,
                ...state,
                ...action.properties
            }
        }
        case APP_ADD: {
            let apps = state.apps;
            if (action.appPath && apps.filter(app => app.path === action.appPath).length === 0) {
                apps.push({
                    id: uuid(),
                    path: action.appPath,
                    name: Path.basename(action.appPath)
                })
            }
            return {
                ...initialState,
                ...state,
                apps: apps
            }
        }
        case APP_REMOVE: {
            let apps = state.apps.filter(app => app.id !== action.id);
            return {
                ...initialState,
                ...state,
                apps: apps
            }
        }
        case EXTENSIONS_OPEN_WITH_ADD: {
            let extensionsOpenWith = state.extensionsOpenWith;
            if (action.extension && extensionsOpenWith.filter(x => x.extension === action.extension.extension).length === 0) {
                extensionsOpenWith.push({
                    id: uuid(),
                    extension: action.extension.extension,
                    appId: action.extension.appId
                })
            }
            return {
                ...initialState,
                ...state,
                extensionsOpenWith: extensionsOpenWith
            }
        }
        case EXTENSIONS_OPEN_WITH_REMOVE: {
            let extensionsOpenWith = state.extensionsOpenWith.filter(ext => ext.id !== action.id);
            return {
                ...initialState,
                ...state,
                extensionsOpenWith: extensionsOpenWith
            }
        }
        case PATH_OPEN_WITH_ADD: {
            let pathsOpenWith = state.pathsOpenWith;
            if (action.path && pathsOpenWith.filter(p => p.path === action.path.path).length === 0) {
                pathsOpenWith.push({
                    id: uuid(),
                    path: action.path.path,
                    appId: action.path.appId
                })
            }
            return {
                ...initialState,
                ...state,
                pathsOpenWith: pathsOpenWith
            }
        }
        case PATH_OPEN_WITH_REMOVE: {
            let pathsOpenWith = state.pathsOpenWith.filter(p => p.id !== action.id);
            return {
                ...initialState,
                ...state,
                pathsOpenWith: pathsOpenWith
            }
        }
        default:
            return state;
    }
}

//
// ACTIONS
//

export function update(properties) {
    return {
        type: EDIT,
        properties: properties
    }
}

export function appAdd(appPath) {
    return {
        type: APP_ADD,
        appPath: appPath
    }
}

export function appRemove(appId) {
    return {
        type: APP_REMOVE,
        id: appId
    }
}

export function extensionsOpenWithAdd(extension) {
    return {
        type: EXTENSIONS_OPEN_WITH_ADD,
        extension: extension
    }
}

export function extensionsOpenWithRemove(extId) {
    return {
        type: EXTENSIONS_OPEN_WITH_REMOVE,
        id: extId
    }
}

export function pathsOpenWithAdd(path) {
    return {
        type: PATH_OPEN_WITH_ADD,
        path: path
    }
}

export function pathsOpenWithRemove(pathId) {
    return {
        type: PATH_OPEN_WITH_REMOVE,
        id: pathId
    }
}