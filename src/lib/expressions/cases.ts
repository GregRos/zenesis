import { ZodTypeAny } from "zod";

export class ConditionCases<
    True extends ZodTypeAny = ZodTypeAny,
    False extends ZodTypeAny = ZodTypeAny
> {
    constructor(
        readonly _true: True,
        readonly _false: False
    ) {}
}
