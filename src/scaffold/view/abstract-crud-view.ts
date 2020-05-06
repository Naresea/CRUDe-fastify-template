import { RestView } from './rest-view';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { elementIdUrlParamName } from './json-schema-utils/schema-crud';
import { CrudSchema, CrudSchemaOptions, getDefaultCrudSchema } from './json-schema-utils/default-crud-schema';

export interface CrudRequestParams<T> {
    headers?: { [k: string]: string };
    params?: { [k: string]: string | number | boolean };
    query?: { [k: string]: string | number | boolean };
    body?: T;
}

/* Some types to give the the handler implementations more safety about their inputs */
/* NOTE: these types are not statically checked (they are 'CrudRequestParams<T> as <x>', so only casted) */
/* Nevertheless type safety during runtime is ensured by the JSON schema check: requests that conflict with these */
/* interfaces are declined with a 40X by fastify */
export declare type CreateBody<T extends { id: number }> = Omit<T, 'id'>;
export declare type UpdateBody<T extends { id: number }> = Required<T> & Partial<Pick<T, 'id'>>;

export declare type CreateCrudRequestParams<T extends { id: number }> = Required<
    Pick<CrudRequestParams<CreateBody<T>>, 'body'>
> &
    CrudRequestParams<CreateBody<T>>;

export declare type ReadListCrudRequestParams<T extends { id: number }> = Omit<CrudRequestParams<T>, 'body'>;

export declare type ReadElementCrudRequestParams<T extends { id: number }> = Required<
    Pick<CrudRequestParams<T>, 'params'>
> &
    Omit<CrudRequestParams<T>, 'body'>;

export declare type UpdateCrudRequestParams<T extends { id: number }> = Required<
    Pick<CrudRequestParams<UpdateBody<T>>, 'body' | 'params'>
> &
    CrudRequestParams<UpdateBody<T>>;

export declare type DeleteCrudRequestParams<T extends { id: number }> = Required<Pick<CrudRequestParams<T>, 'params'>> &
    Omit<CrudRequestParams<T>, 'body'>;

export abstract class AbstractCrudView<T extends { id: number }> implements RestView {
    protected baseUrl: string;
    protected dtoSchemaForT: object;

    private readonly options: CrudSchemaOptions | undefined;

    protected constructor(baseUrl: string, dtoSchemaForT: object, options?: CrudSchemaOptions) {
        this.baseUrl = baseUrl;
        this.dtoSchemaForT = dtoSchemaForT;
        this.options = options;
    }

    /* Abstract method stubs to implement the basic CRUD / REST operations (C_reate, R_ead, U_pdate, D_elete) */

    /* Read gets two methods since REST ususally allows reading a list of all elements or a specific element */
    public abstract create(input: CreateCrudRequestParams<T>): Promise<T>;

    public abstract readList(input: ReadListCrudRequestParams<T>): Promise<Array<T>>;

    public abstract readElement(input: ReadElementCrudRequestParams<T>): Promise<T>;

    public abstract update(input: UpdateCrudRequestParams<T>): Promise<T>;

    public abstract delete(input: DeleteCrudRequestParams<T>): Promise<T>;

    /* Endpoint definition and handlers below, the URLs follow the standard REST schema of '/<resource>/:elementId' */

    public defineEndpoints(server: FastifyInstance): void {
        const schemas: CrudSchema = getDefaultCrudSchema(this.dtoSchemaForT, this.options);
        server.get(this.baseUrl, { schema: schemas.readList }, async (req) => this.readListRequest(req));

        server.get(`${this.baseUrl}/:${elementIdUrlParamName}`, { schema: schemas.readElement }, async (req) =>
            this.readElementRequest(req)
        );

        server.post(this.baseUrl, { schema: schemas.createElement }, async (req) => this.createElementRequest(req));

        server.put(`${this.baseUrl}/:${elementIdUrlParamName}`, { schema: schemas.updateElement }, async (req) =>
            this.updateElementRequest(req)
        );

        server.delete(`${this.baseUrl}/:${elementIdUrlParamName}`, { schema: schemas.deleteElement }, async (req) =>
            this.deleteElementRequest(req)
        );
    }

    private extractInput(req: FastifyRequest): CrudRequestParams<T> {
        return {
            headers: req.headers,
            params: req.params,
            query: req.query,
            body: req.body,
        };
    }

    private async createElementRequest(req: FastifyRequest): Promise<{ value: T }> {
        const input = this.extractInput(req);
        const result = await this.create(input as CreateCrudRequestParams<T>);
        return { value: result };
    }

    private async readListRequest(req: FastifyRequest): Promise<{ values: Array<T> }> {
        const input = this.extractInput(req);
        const result = await this.readList(input as ReadListCrudRequestParams<T>);
        return { values: result };
    }

    private async readElementRequest(req: FastifyRequest): Promise<{ value: T }> {
        const input = this.extractInput(req);
        const result = await this.readElement(input as ReadElementCrudRequestParams<T>);
        return { value: result };
    }

    private async updateElementRequest(req: FastifyRequest): Promise<{ value: T }> {
        const input = this.extractInput(req);
        const result = await this.update(input as UpdateCrudRequestParams<T>);
        return { value: result };
    }

    private async deleteElementRequest(req: FastifyRequest): Promise<{ value: T }> {
        const input = this.extractInput(req);
        const result = await this.delete(input as DeleteCrudRequestParams<T>);
        return { value: result };
    }
}
