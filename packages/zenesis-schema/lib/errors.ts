export class ZenesisError extends Error {
    constructor(
        public code: string,
        message: string
    ) {
        super(message)
    }
}

export function zenesisError({
    code,
    message
}: {
    code: string
    message: string
}): never {
    const fullCode = `zenesis/${code}`
    throw new ZenesisError(fullCode, message)
}
