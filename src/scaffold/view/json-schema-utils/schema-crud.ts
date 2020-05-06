import { RouteSchema } from 'fastify';
import { getParamSchema, SchemaParam } from './schema-request';
import { exists, notExists } from '../../utils/exists';
import { getListResponseSchema, getResponseSchema } from './schema-response';

declare type JSONSchemaObject = { [k: string]: object };

export interface CrudOptions {
    headers?: Array<SchemaParam>;
    params?: Array<SchemaParam>;
    query?: Array<SchemaParam>;
}

export const elementIdUrlParamName = 'elementId';

function getParamSchemas(opts?: CrudOptions): { headers?: object; params?: object; query?: object } {
    if (notExists(opts)) {
        return {};
    }
    const query = exists(opts.query) ? getParamSchema(opts.query) : undefined;
    const params = exists(opts.params) ? getParamSchema(opts.params) : undefined;
    const headers = exists(opts.headers) ? getParamSchema(opts.headers) : undefined;
    return {
        headers,
        params,
        query,
    };
}

export function appendHeader(schema: RouteSchema, header: SchemaParam): RouteSchema {
    const properties = (schema?.headers as { properties: JSONSchemaObject })?.properties ?? undefined;
    const required = (schema?.headers as { required: Array<string> })?.required ?? undefined;

    if (notExists(properties)) {
        return schema;
    }
    properties[header.name] = {
        type: header.type,
    };
    if (exists(required) && Array.isArray(required)) {
        required.push(header.name);
    }
    return schema;
}

export function getElementIdParams(opts?: CrudOptions): CrudOptions {
    const elementIdParam: SchemaParam = { name: elementIdUrlParamName, type: 'number' };
    let finalOpts: CrudOptions;
    if (notExists(opts)) {
        finalOpts = { params: [elementIdParam] };
    } else if (notExists(opts.params) || notExists(opts.params.find((elem) => elem.name === elementIdParam.name))) {
        finalOpts = opts;
        finalOpts.params = [elementIdParam];
    } else {
        finalOpts = opts;
    }
    return finalOpts;
}

export function authenticated(schema: RouteSchema): RouteSchema {
    const header: SchemaParam = { name: 'authorization', type: 'string' };
    schema.headers = exists(schema.headers) ? appendHeader(schema.headers, header) : getParamSchema([header]);
    return schema;
}

export function createReq(inputSchema: object, resultSchema?: object, opts?: CrudOptions): RouteSchema {
    const { headers, params, query } = getParamSchemas(opts);
    const responseSchema = getResponseSchema(resultSchema ?? inputSchema);
    const body = inputSchema;
    return {
        headers,
        querystring: query,
        params,
        body,
        response: responseSchema,
    };
}

export function readReq(dtoSchema: object, opts?: CrudOptions): RouteSchema {
    const options = getElementIdParams(opts);
    const { headers, params, query } = getParamSchemas(options);
    const responseSchema = getResponseSchema(dtoSchema);
    return {
        headers,
        querystring: query,
        params,
        response: responseSchema,
    };
}

export function readListReq(dtoSchema: object, opts?: CrudOptions): RouteSchema {
    const { headers, params, query } = getParamSchemas(opts);
    const responseSchema = getListResponseSchema(dtoSchema);
    return {
        headers,
        querystring: query,
        params,
        response: responseSchema,
    };
}

export function updateReq(dtoSchema: object, resultSchema?: object, opts?: CrudOptions): RouteSchema {
    return createReq(dtoSchema, resultSchema, getElementIdParams(opts));
}

export function deleteReq(dtoSchema: object, opts?: CrudOptions): RouteSchema {
    const options = getElementIdParams(opts);
    const { headers, params, query } = getParamSchemas(options);
    const responseSchema = getResponseSchema(dtoSchema);
    return {
        headers,
        querystring: query,
        params,
        response: responseSchema,
    };
}
