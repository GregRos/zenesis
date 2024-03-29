export const cases: {
    [Kind in keyof ZsTsTable]: (
        this: TypeExprContext,
        node: ZsTypeTable[Kind]
    ) => ZsTsTable[Kind]
} = {