export function exists<T>(val: T | null | undefined): val is T {
    return val !== null && val !== undefined && typeof val !== 'undefined';
}

export function notExists<T>(val: T | null | undefined): val is null | undefined {
    return !exists(val);
}

export function errorIfNotExists<T>(val: T | null | undefined, errorMessage?: string): T {
    if (exists(val)) {
        return val;
    }
    if (exists(errorMessage)) {
        throw new Error(errorMessage);
    }
    throw new Error('Value passed to errorIfNotExists is undefined.');
}
