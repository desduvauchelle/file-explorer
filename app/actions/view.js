export const EDIT = "EDIT";

export function update(properties) {
    return {
        type: EDIT,
        properties: properties
    }
}

