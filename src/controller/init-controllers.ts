import { Config } from '../scaffold/config/config';
import { RestControllerMap } from '../scaffold/controller/rest-controller-map';
import { UserController } from './user.controller';

export function initControllers(config: Config): Promise<RestControllerMap> {
    // TODO: remove config parameter if not required
    console.log('Initializing controller with config: ', config);
    const map = new RestControllerMap();

    // TODO: add all required controllers here
    map.add(UserController, new UserController());
    return Promise.resolve(map);
}
