import { Config } from '../scaffold/config/config';
import { createConnection } from 'typeorm';
import { getEntities } from './entities/get-entities';
import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions';

export async function initModels(config: Config): Promise<void> {
    await createConnection({
        type: config.TYPEORM_CONNECTION,
        database: config.TYPEORM_DATABASE,
        username: config.TYPEORM_USERNAME,
        password: config.TYPEORM_PASSWORD,
        host: config.TYPEORM_HOST,
        port: config.TYPEORM_PORT,
        synchronize: config.TYPEORM_SYNCHRONIZE,
        entities: getEntities(),
    } as ConnectionOptions);
}
