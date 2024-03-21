export class ZenesisBuildError extends Error {
    constructor(
        readonly code: string,
        message: string
    ) {
        super(message)
    }
}
