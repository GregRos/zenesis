import { ZsToTsDeclTable } from "./table"

export const cases: {
    [Kind in keyof ZsToTsDeclTable]: (
        this: ZsToTsDeclTable,
        node: ZsToTsDeclTable[Kind]
    ) => ZsToTsDeclTable[Kind]
} = {
    [ZsDeclKind.ZsClass](node) {
        return this.get(node)
    }
}
