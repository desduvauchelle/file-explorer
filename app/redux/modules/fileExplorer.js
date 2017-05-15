

//
// Action types
//
const BACK = 'explorer/navigation/BACK';
const FORWARD = 'explorer/navigation/FORWARD';
const UP = 'explorer/navigation/UP';
const DOWN = 'explorer/navigation/DOWN';
const TO = 'explorer/navigation/TO';

const initialState = {
    path: '/',
    selected: null
};

export default function reducer(state = {
        ...initialState
    }, action = {}) {

    switch (action.type) {
        case BACK:
            return state
        case FORWARD:
            return state
        case UP:
            return state
        case DOWN:
            return state
        case TO:
            return {
                ...state,
                path: action.path,
                selected: action.selected
            }
        default:
            return state
    }
}

export function goBack() {
    return {
        type: BACK
    }
}

export function goForward() {
    return {
        type: FORWARD
    }
}

export function goUp() {
    return {
        type: UP
    }
}

export function goDown() {
    return {
        type: DOWN
    }
}

export function goTo(path = '/', selected = null) {
    return {
        type: TO,
        path: path,
        selected: selected
    }
}