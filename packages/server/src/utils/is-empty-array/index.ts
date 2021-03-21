export function isEmptyString(str: string): boolean {
    if (str === undefined || str === null || typeof str !== "string") {
        return false;
    }
    return str.length === 0;
}
