import * as types from '../actions/view'

const initialState = {
    showHidden: false,
    theme: 'dark'
};

export default function counter(state = initialState, action = {}) {
    switch (action.type) {
        case types.EDIT: {
            return {
                ...initialState,
                ...state,
                ...action.properties
            }
        }
        default:
            return state;
    }
}
