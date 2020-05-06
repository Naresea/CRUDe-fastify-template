import { errorIfNotExists } from '../utils/exists';

export class RestControllerMap {
    // disable linter, explicit any must be allowed since we want to store all possible controller implementations here
    // type safety is ensured by the statically typed add and get methods
    /* eslint-disable */
    private map = new Map<{ new (): any }, any>();
    /* eslint-enable */

    public add<T>(ctor: { new (): T }, controller: T): void {
        this.map.set(ctor, controller);
    }

    public get<T>(ctor: { new (): T }): T {
        return errorIfNotExists(this.map.get(ctor), 'Missing controller: ' + JSON.stringify(ctor));
    }
}
