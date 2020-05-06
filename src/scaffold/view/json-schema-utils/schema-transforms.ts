import { notExists } from '../../utils/exists';

/* Removes the required id and property from the input schema */
function removeFromRequired(dtoEntitySchema: object, key: string): object {
    const required = (dtoEntitySchema as { required?: Array<string> })?.required;
    if (notExists(required) || !Array.isArray(required)) {
        return dtoEntitySchema;
    } else {
        (dtoEntitySchema as { required?: Array<string> }).required = required.filter((val) => val !== key);
        return dtoEntitySchema;
    }
}

function removeFromProperties(dtoEntitySchema: object, key: string): object {
    const properties = (dtoEntitySchema as { properties?: { [k: string]: object } })?.properties;
    if (notExists(properties) || typeof properties !== 'object') {
        return dtoEntitySchema;
    } else {
        delete (dtoEntitySchema as { properties: { [k: string]: object | undefined } }).properties[key];
        return dtoEntitySchema;
    }
}

export function toCreate(dtoEntitySchema: object): object {
    const result = JSON.parse(JSON.stringify(dtoEntitySchema));
    return removeFromProperties(removeFromRequired(result, 'id'), 'id');
}

export function toUpdate(dtoEntitySchema: object): object {
    const result = JSON.parse(JSON.stringify(dtoEntitySchema));
    return removeFromRequired(result, 'id');
}
