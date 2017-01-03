import * as types from '../actions/favorites';
import uuid from 'uuid/v1';

const initialState = [
    {
        id: 'default',
        name: "Favorites",
        isOpen: true,
        links: []
    }
];

const initialStateFavorite = {
    id: '',
    name: '',
    isOpen: true,
    links: []
};

const initialStateLink = {
    id: '',
    link: ''
}

export default function counter(state = initialState, action = {}) {
    switch (action.type) {
        case types.SECTION_ADD: {
            return [
                ...state,
                {
                    ...initialStateFavorite,
                    ...action.section,
                    id: uuid()
                }
            ]
        }
        case types.SECTION_REMOVE: {
            return state.filter(fav => fav.id !== action.id)
        }
        case types.SECTION_EDIT: {
            return state.map(fav => fav.id === action.id ? {
                ...fav,
                ...action.newAttributes
            } : fav)
        }
        case types.SECTION_REORDER: {
            return action.favorites;
        }
        case types.LINK_ADD: {
            return state.map(fav => {
                if (fav.id === action.sectionId) {
                    let links = fav.links;
                    links.push(Object.assign({}, initialStateLink, {
                        id: uuid(),
                        link: action.link
                    }));
                    let newFav = Object.assign({}, initialStateFavorite, fav, {
                        links: links
                    });
                    return newFav;
                }
                return fav;
            })
        }
        case types.LINK_REMOVE: {
            return state.map(fav => fav.id === action.sectionId ?
                {
                    ...fav,
                    links: fav.links.filter(link => link.id !== action.linkId)
                }
                : fav)
        }
        default:
            return state;
    }
}
