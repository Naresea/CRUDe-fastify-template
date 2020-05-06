export declare type ResponseSchema = { [code: string]: object } | { [code: number]: object };

export function getSingleValueSchema(dtoSchema: object): object {
    const copy = JSON.parse(JSON.stringify(dtoSchema));
    return {
        type: 'object',
        required: ['value'],
        properties: {
            value: copy,
        },
        additionalProperties: false,
    };
}

export function getListValueSchema(dtoSchema: object): object {
    const copy = JSON.parse(JSON.stringify(dtoSchema));
    return {
        type: 'object',
        required: ['values'],
        properties: {
            values: {
                type: 'array',
                items: copy,
            },
        },
        additionalProperties: false,
    };
}

export function getResponseSchema(dtoSchema: object): ResponseSchema {
    return {
        200: getSingleValueSchema(dtoSchema),
    };
}

export function getListResponseSchema(dtoSchema: object): ResponseSchema {
    return {
        200: getListValueSchema(dtoSchema),
    };
}
