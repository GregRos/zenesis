import { SubtypeClause } from "./clause";
import { ZodTypeAny, ZodTypeDef } from "zod";
import { ZsMonoType } from "../mono-type";

export class ConditionCases<
    True extends ZodTypeAny = ZodTypeAny,
    False extends ZodTypeAny = ZodTypeAny
> {
    constructor(
        readonly _true: True,
        readonly _false: False
    ) {}
}

export interface ZsConditionalDef<
    Clause extends SubtypeClause,
    Cases extends ConditionCases
> extends ZodTypeDef {
    typeName: "ZsConditional";
    clause: Clause;
    cases: Cases;
}

export type getConditionalOf<
    TClause extends SubtypeClause,
    TCases extends ConditionCases
> = [TClause["subtype"]] extends [TClause["supertype"]]
    ? TCases["_true"]
    : TCases["_false"];

export class ZsConditional<
    Clause extends SubtypeClause,
    Cases extends ConditionCases
> extends ZsMonoType<
    getConditionalOf<Clause, Cases>,
    ZsConditionalDef<Clause, Cases>
> {}
