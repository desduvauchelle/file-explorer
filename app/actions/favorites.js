export const SECTION_ADD = "SECTION_ADD";
export const SECTION_REMOVE = "SECTION_REMOVE";
export const SECTION_RENAME = "SECTION_RENAME";
export const LINK_ADD = "LINK_ADD";
export const LINK_REMOVE = "LINK_REMOVE";

export function sectionAdd( ) {
    return { type: SECTION_ADD }
}

export function sectionRemove( ) {
    return { type: SECTION_REMOVE }
}

export function sectionRename( ) {
    return { type: SECTION_RENAME }
}

export function linkAdd( link ) {
    return { type: LINK_ADD, link: link }
}

export function linkRemove( link ) {
    return { type: LINK_REMOVE, link }
}
