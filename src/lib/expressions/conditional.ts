import { SubtypeClause } from "./clause";
import { ZodTypeDef } from "zod";
import { ZsMonoType } from "../mono-type";
import { ConditionCases } from "./cases";

export class ZsConditional<
    Clause extends SubtypeClause,
    Cases extends ConditionCases
> extends ZsMonoType<
    getConditionalOf<Clause, Cases>,
    ZsConditionalDef<Clause, Cases>
> {
    readonly actsLike = this._def.cases._true.or(this._def.cases._false);
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
