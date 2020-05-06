import AJV from 'ajv';

const ajv = new AJV();

export function validate(schema: object, data: object): boolean {
    const validate = ajv.compile(schema);
    return !!validate(data);
}
