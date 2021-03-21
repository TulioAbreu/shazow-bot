export interface Result<T> {
    value: T;
    hasValue: boolean;
    errorMessage: string;
}

export function createErrorResult<T>(errorMessage: string): Result<T> {
    return {
        value: undefined,
        hasValue: false,
        errorMessage,
    };
}

export function createResult<T>(value: T): Result<T> {
    return {
        value,
        hasValue: true,
        errorMessage: undefined,
    };
}
