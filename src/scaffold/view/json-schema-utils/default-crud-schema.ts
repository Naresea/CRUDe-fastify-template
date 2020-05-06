import { toCreate, toUpdate } from './schema-transforms';
import { authenticated, createReq, CrudOptions, deleteReq, readListReq, readReq, updateReq } from './schema-crud';
import { deepLog } from '../../utils/deep-log';

export interface CrudSchema {
    readElement: object;
    readList: object;
    createElement: object;
    updateElement: object;
    deleteElement: object;
}

export interface CrudSchemaOptions {
    readElementOptions?: CrudOptions;
    readListOptions?: CrudOptions;
    createOptions?: CrudOptions;
    updateOptions?: CrudOptions;
    deleteOptions?: CrudOptions;
}

export function getDefaultCrudSchema(dtoEntitySchema: object, crudSchemaOptions?: CrudSchemaOptions): CrudSchema {
    return {
        readList: authenticated(readListReq(dtoEntitySchema, crudSchemaOptions?.readListOptions)),
        readElement: authenticated(readReq(dtoEntitySchema, crudSchemaOptions?.readElementOptions)),
        createElement: authenticated(
            createReq(toCreate(dtoEntitySchema), dtoEntitySchema, crudSchemaOptions?.createOptions)
        ),
        updateElement: authenticated(
            updateReq(toUpdate(dtoEntitySchema), dtoEntitySchema, crudSchemaOptions?.updateOptions)
        ),
        deleteElement: authenticated(deleteReq(dtoEntitySchema, crudSchemaOptions?.deleteOptions)),
    };
}

export function printDefaultCrudSchema(dto: object): void {
    const defaultSchema = getDefaultCrudSchema(dto);
    console.log('### GET LIST ###');
    console.log(deepLog(defaultSchema.readList));
    console.log('### GET ELEMENT ###');
    console.log(deepLog(defaultSchema.readElement));
    console.log('### CREATE ELEMENT ###');
    console.log(deepLog(defaultSchema.createElement));
    console.log('### UPDATE ELEMENT ###');
    console.log(deepLog(defaultSchema.updateElement));
    console.log('### DELETE ELEMENT ###');
    console.log(deepLog(defaultSchema.deleteElement));
    console.log('### END SCHEMAS ###');
}
