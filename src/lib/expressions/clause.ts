import { ZodTypeAny } from "zod";

export class SubtypeClause<
    Subtype extends ZodTypeAny = ZodTypeAny,
    Supertype extends ZodTypeAny = ZodTypeAny
> {
    constructor(
        readonly subtype: Subtype,
        readonly supertype: Supertype
    ) {}
}
