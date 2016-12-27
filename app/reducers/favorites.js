import { SECTION_ADD, SECTION_REMOVE, SECTION_EDIT, LINK_ADD, LINK_REMOVE } from '../actions/favorites';

const initialState = {
    favorites: [ ]
}
const initialStateFavorite = {
    id: '',
    order: 0,
    name: '',
    isOpen: true,
    links: [ ]
}

export default function counter(state = initialState, action = {}) {
    switch ( action.type ) {
        case SECTION_ADD:
            const newFavorite = Object.assign({}, initialStateFavorite, action.section, {
                id: (Math.floor( Math.random( ) * 999999 ) + + new Date( )).toString( 36 )
            });
            return Object.assign({}, initialState, state, {favorites: favorites.push( newFavorite )});

        case SECTION_REMOVE:
            return Object.assign({}, initialState, state, {
                favorites: favorites.filter( fav => fav.id === action.id )
            });

        case SECTION_EDIT:
            return Object.assign({}, initialState, state, {
                favorites: favorites.map( fav => ( fav.id === action.id )
                    ? Object.assign( {}, initialStateFavorite, fav, action.newAttributes )
                    : fav )
            });

        case LINK_ADD:
            return Object.assign({}, initialState, state, {
                favorites: favorites.map( fav => ( fav.id === action.sectionId )
                    ? Object.assign({}, initialStateFavorite, fav, {
                        links: fav.links.push( action.link )
                    })
                    : fav )
            });

        case LINK_REMOVE:
            return Object.assign({}, initialState, state, {
                favorites: favorites.map( fav => ( fav.id === action.sectionId )
                    ? Object.assign({}, initialStateFavorite, fav, {
                        links: fav.links.filter( link => link !== action.link )
                    })
                    : fav )
            });

        default:
            return state;
    }
}
