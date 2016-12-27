export const SECTION_ADD = "SECTION_ADD";
export const SECTION_REMOVE = "SECTION_REMOVE";
export const SECTION_EDIT = "SECTION_EDIT";
export const LINK_ADD = "LINK_ADD";
export const LINK_REMOVE = "LINK_REMOVE";

export function sectionAdd( section ) {
    return { type: SECTION_ADD, section: section }
}

export function sectionRemove( id ) {
    return { type: SECTION_REMOVE, id: id }
}

export function sectionEdit( id, newAttributes ) {
    return { type: SECTION_EDIT, id: id, newAttributes: newAttributes }
}

export function linkAdd( sectionId, link ) {
    return { type: LINK_ADD, sectionId: sectionId, link: link }
}

export function linkRemove( sectionId, link ) {
    return { type: LINK_REMOVE, sectionId: sectionId, link: link }
}
