import { getConfig } from './scaffold/config/get-config';
import { initModels } from './model/init-models';
import { initControllers } from './controller/init-controllers';
import { initViews } from './view/init-views';

async function main(): Promise<void> {
    const config = getConfig();
    console.log('Using config: ', config);
    await initModels(config);
    const controllers = await initControllers(config);
    await initViews(config, controllers);
}

main();
