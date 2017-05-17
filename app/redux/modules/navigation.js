

//
// Action types
//
const GO_TO_PAGE = 'explorer/navigation/GO_TO_PAGE';

//
// REDUCER
//
const initialState = {
    page: 'explorer'
};

export default function reducer(state = {
        ...initialState
    }, action = {}) {

    switch (action.type) {
        case GO_TO_PAGE:
            return {
                ...state,
                page: action.page
            }
        default:
            return state
    }
}
//
// ACTIONS
//
export function goToPage(page) {
    return {
        type: GO_TO_PAGE,
        page: page
    }
}