import uuid from 'uuid/v1'
//
// ACTION TYPES
//
const SECTION_ADD = "SECTION_ADD"
const SECTION_REMOVE = "SECTION_REMOVE"
const SECTION_EDIT = "SECTION_EDIT"
const SECTION_REORDER = "SECTION_REORDER"
const LINK_ADD = "LINK_ADD"
const LINK_REMOVE = "LINK_REMOVE"

//
// REDUCER
//

const initialState = [
    {
        id: 'default',
        name: "Favorites",
        isOpen: true,
        links: []
    }
]

const initialStateFavorite = {
    id: '',
    name: '',
    isOpen: true,
    links: []
}

const initialStateLink = {
    id: '',
    link: ''
}

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case SECTION_ADD: {
            return [
                ...state,
                {
                    ...initialStateFavorite,
                    ...action.section,
                    id: uuid()
                }
            ]
        }
        case SECTION_REMOVE: {
            return state.filter(fav => fav.id !== action.id)
        }
        case SECTION_EDIT: {
            return state.map(fav => fav.id === action.id ? {
                ...fav,
                ...action.newAttributes
            } : fav)
        }
        case SECTION_REORDER: {
            return action.favorites;
        }
        case LINK_ADD: {
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
        case LINK_REMOVE: {
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

//
// ACTIONS
//

export function sectionAdd(section) {
    return {
        type: SECTION_ADD,
        section: section
    }
}

export function sectionRemove(id) {
    return {
        type: SECTION_REMOVE,
        id: id
    }
}

export function sectionEdit(id, newAttributes) {
    return {
        type: SECTION_EDIT,
        id: id,
        newAttributes: newAttributes
    }
}

export function sectionReorder(favorites) {
    return {
        type: SECTION_REORDER,
        favorites: favorites
    }
}

export function linkAdd(sectionId, link) {
    return {
        type: LINK_ADD,
        sectionId: sectionId,
        link: link
    }
}

export function linkRemove(sectionId, linkId) {
    return {
        type: LINK_REMOVE,
        sectionId: sectionId,
        linkId: linkId
    }
}
