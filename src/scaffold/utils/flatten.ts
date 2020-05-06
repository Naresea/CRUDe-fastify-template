export function flatten<T>(arr: Array<Array<T>>): Array<T> {
    return arr.reduce((accu, curr) => accu.concat(curr), []);
}
