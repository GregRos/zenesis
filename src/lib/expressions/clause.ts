import { ZodTypeAny } from "zod";
import { ZsMonoLike } from "../mono-type";

export class SubtypeClause<Subtype = any, Supertype = any> {
    constructor(
        readonly subtype: ZsMonoLike<Subtype>,
        readonly supertype: ZsMonoLike<Supertype>
    ) {}
}
