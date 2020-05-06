import { Config } from '../scaffold/config/config';
import fastify, { FastifyInstance } from 'fastify';
import fastifySwagger from 'fastify-swagger';
import { swaggerConfig } from '../scaffold/config/swagger.config';
import { exists } from '../scaffold/utils/exists';
import { RestView } from '../scaffold/view/rest-view';
import { UserView } from './user-view';
import { RestControllerMap } from '../scaffold/controller/rest-controller-map';
import { UserController } from '../controller/user.controller';

function getViews(controllers: RestControllerMap): Array<RestView> {
    return [new UserView(controllers.get(UserController))];
}

export async function initViews(config: Config, controllers: RestControllerMap): Promise<void> {
    const fastifyServer: FastifyInstance = await new Promise((resolve, reject) => {
        const server = fastify({
            logger: config.FASTIFY_LOGGER,
        });
        server.register(fastifySwagger, swaggerConfig);
        getViews(controllers).forEach((view) => view.defineEndpoints(server));
        server.listen(config.FASTIFY_PORT, config.FASTIFY_BIND, (err) => {
            if (exists(err)) {
                reject(err);
            } else {
                resolve(server);
            }
        });
    });
    fastifyServer.swagger();
}
