/* eslint-disable */
import * as types from '../actions/favorites';
import uuid from 'uuid/v1';

const initialState = {
    favorites: [
        {
            id: 'default',
            order: 0,
            name: "Favorites",
            isOpen: true,
            links: []
        }
    ]
};

const initialStateFavorite = {
    id: '',
    order: 0,
    name: '',
    isOpen: true,
    links: []
};

export default function counter(state = initialState, action = {}) {
    switch (action.type) {
        case types.SECTION_ADD: {
            return {
                ...state,
                favorites: [...state.favorites, {
                    ...initialStateFavorite,
                    ...action.section,
                    id: uuid()
                }]
            }
        }
        case types.SECTION_REMOVE: {
            return {
                ...state,
                favorites: state.favorites.filter(fav => fav.id !== action.id)
            }
        }
        case types.SECTION_EDIT: {
            return {
                ...state,
                favorites: state.favorites.map(fav => fav.id === action.id ? {
                    ...fav,
                    ...action.newAttributes
                } : fav)
            }
        }
        case types.LINK_ADD: {
            return {
                ...state,
                favorites: state.favorites.map(fav => {
                    if (fav.id === action.sectionId) {
                        let links = fav.links;
                        links.push(action.link);
                        let newFav = Object.assign({}, initialStateFavorite, fav, {
                            links: links
                        });
                        return newFav;
                    }
                    return fav;
                })
            }
        }
        case types.LINK_REMOVE: {
            return {
                ...state,
                favorites: state.favorites.map(fav => fav.id === action.sectionId ?
                    {
                        ...fav,
                        links: fav.links.filter(link => link !== action.link)
                    }
                    : fav)
            }
        }
        default:
            return state;
    }
}
