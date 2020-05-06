export declare type SchemaVariableType = 'number' | 'string' | 'boolean';
export declare type SchemaParam = { name: string; type: SchemaVariableType };

export function getParamSchema(params: Array<SchemaParam>): object {
    const required = params.map((param) => param.name);
    return {
        type: 'object',
        required: required,
        properties: params.reduce((prop, param) => {
            prop[param.name] = { type: param.type };
            return prop;
        }, {} as { [k: string]: object }),
        additionalProperties: false,
    };
}
