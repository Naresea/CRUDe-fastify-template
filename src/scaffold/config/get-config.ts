import { errorIfNotExists, exists, notExists } from '../utils/exists';
import { Config } from './config';
import configSchema from './config.json';
import { validate } from '../utils/validate';

function checkEnvVariableExistence(): void {
    const requiredFields = configSchema.required;
    const missingEnvVariables = requiredFields
        .map((name) => {
            if (notExists(process.env[name])) {
                return name;
            }
            return undefined;
        })
        .filter(exists);
    if (missingEnvVariables.length > 0) {
        throw new Error('Missing environment variables for startup: ' + JSON.stringify(missingEnvVariables));
    }
}

function getConfigObject(): Config {
    const props = Object.keys(JSON.parse(JSON.stringify(configSchema))?.properties);
    return props.reduce((conf, variable) => {
        const envValue: string | undefined = process.env[variable];
        if (notExists(envValue)) {
            return conf;
        }
        // cast to any is required so properties can be indexed with variable names
        /* eslint-disable */
        const type: string = errorIfNotExists(
            (configSchema as any).properties[variable]?.type,
            `Failed to read property type of ${variable}: ${configSchema}`
        );
        /* eslint-enable */
        switch (type) {
            case 'number':
                conf[variable] = Number.parseInt(envValue);
                break;
            case 'boolean':
                conf[variable] = envValue.toLowerCase() === 'true';
                break;
            case 'string':
            default:
                conf[variable] = `${envValue}`;
                break;
        }
        return conf;
    }, {} as Config);
}

export function getConfig(): Config {
    checkEnvVariableExistence();
    const config = getConfigObject();
    if (validate(configSchema, config)) {
        return config;
    }
    throw new Error('Configuration failed validation.');
}
