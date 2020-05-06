import util from 'util';

/* eslint-disable */
export function deepLog(val: any): any {
    return util.inspect(val, false, null, true /* enable colors */);
}
/* eslint-enable */
