import { SECTION_ADD, SECTION_REMOVE, SECTION_EDIT, LINK_ADD, LINK_REMOVE } from '../actions/favorites';

const initialState = {
    favorites: [
        {
            id: 'default',
            order: 0,
            name: "Favorites",
            isOpen: true,
            links: [ ]
        }
    ]
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
        case SECTION_ADD:{
            const newFavorite = Object.assign({}, initialStateFavorite, action.section, {
                id: (Math.floor( Math.random( ) * 999999 ) + + new Date( )).toString( 36 )
            });

            let favorites = state.favorites;
            favorites.push( newFavorite );
            console.log( newFavorite, favorites );
            return Object.assign({}, initialState, state, { favorites: favorites });
        }
        case SECTION_REMOVE:{
            return Object.assign({}, initialState, state, {
                favorites: state.favorites.filter( fav => fav.id === action.id )
            });
        }
        case SECTION_EDIT:{
            return Object.assign({}, initialState, state, {
                favorites: state.favorites.map( fav => ( fav.id === action.id )
                    ? Object.assign( {}, initialStateFavorite, fav, action.newAttributes )
                    : fav )
            });
        }
        case LINK_ADD:{
            return Object.assign({}, initialState, state, {
                favorites: state.favorites.map(fav => {
                    if ( fav.id === action.sectionId ) {
                        let links = fav.links;
                        links.push( action.link );
                        let newFav = Object.assign({}, initialStateFavorite, fav, { links: links });
                        return newFav;
                    }
                    return fav;
                })
            });
        }
        case LINK_REMOVE:{
            return Object.assign({}, initialState, state, {
                favorites: state.favorites.map( fav => ( fav.id === action.sectionId )
                    ? Object.assign({}, initialStateFavorite, fav, {
                        links: fav.links.filter( link => link !== action.link )
                    })
                    : fav )
            });
        }
        default:
            return state;
    }
}
