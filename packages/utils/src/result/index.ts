export type Maybe<T> = T | undefined;

export class Result<T> {
    private value?: T;
    private errorMessage: string;

    constructor(value: Maybe<T>, errorMessage?: string) {
        this.value = value;
        this.errorMessage = errorMessage ?? "";
    }

    hasValue(): boolean {
        return !!this.value;
    }

    getErrorMessage(): string {
        return this.errorMessage;
    }

    unwrap(): T {
        if (!this.hasValue()) {
            throw new Error("ERROR - Attempt to unwrap Result without value");
        }
        return this.value as T;
    }
}

export function createErrorResult<T>(errorMessage: string): Result<T> {
    return new Result<T>(undefined, errorMessage);
}

export function createResult<T>(value: T): Result<T> {
    return new Result(value);
}
