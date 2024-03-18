const funParamRegex = /^(?<name>[\w_]+)(?:[:,| -]\s*(?<description>.*))?$/

export interface FunParamInfo {
    name: string
    description?: string
}

function genParamName(index: number) {
    return `arg${index}`
}

export function getParamInfo(
    index: number,
    schemaDescription: string | undefined
) {
    const defaultName = genParamName(index)
    if (!schemaDescription) {
        return { name: defaultName, description: undefined }
    }
    const match = funParamRegex.exec(schemaDescription)?.groups
    if (!match) {
        return { name: defaultName, description: schemaDescription }
    }
    return match
}
