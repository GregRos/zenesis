import {
    objectUtil,
    ParseInput,
    ParseReturnType,
    TypeOf,
    z,
    ZodAny,
    ZodTypeAny
} from "zod";
import { SchemaSubtypeOf } from "../utils";
import { ZsDeclaration, ZsDeclaredDef, ZsDeclaredType } from "./general";
import addQuestionMarks = objectUtil.addQuestionMarks;
import { ZsMonoType } from "../mono-type";
import { defaultsDeep } from "lodash";

export type ZsTypeVarVariance = "" | "in" | "out" | "inout";

export interface ZsTypeVarDef<
    Constraint extends ZodTypeAny,
    Default extends SchemaSubtypeOf<Constraint> | null,
    Name extends string
> extends ZsDeclaredDef {
    typeName: "ZsTypeVar";
    name: Name;
    where: WhereClause<Constraint, Default>;
}

export type VarNames = [string, ...string[]];

export interface WhereClause<
    Constraint extends ZodTypeAny = ZodTypeAny,
    Default extends SchemaSubtypeOf<Constraint> | null = SchemaSubtypeOf<Constraint> | null
> {
    readonly extends: Constraint;
    readonly default: Default;
    readonly const: boolean;
    readonly variance: ZsTypeVarVariance;
}

export type WhereClauses<Vars extends string> = {
    [K in Vars]?: Partial<WhereClause>;
};

export type FullWhereClauses<Vars extends string> = {
    readonly [K in Vars]: WhereClause;
};

export type DefaultWhere = {
    extends: ZodAny;
    default: null;
    const: false;
    variance: "";
};

export type Defaultify<
    Vars extends string,
    Wheres extends WhereClauses<Vars>
> = {
    [K in Vars]: Wheres[K] extends string
        ? {
            [P in keyof DefaultWhere]: Wheres[K][P] extends string | null | object | boolean ? Wheres[K][P] : DefaultWhere[P];
        }
        : DefaultWhere;
};

const obj: DefaultWhere = {
    extends: z.any(),
    default: null,
    const: false,
    variance: ""
};

export class Generic<
    Vars extends VarNames,
    Wheres extends FullWhereClauses<Vars[number]>
> {
    private _names: Vars;
    private _where: Wheres;

    constructor(w: Wheres, ns: Vars) {
        this._names = ns;
        this._where = w;
    }

    where<Wheres extends WhereClauses<Vars[number]>>(
        where: keyof Wheres extends Vars[number] ? Wheres : never
    ): Generic<Vars, Defaultify<Vars[number], Wheres>> {
        return new Generic(defaultsDeep(where, obj), this._names);
    }

    declare<Decl extends ZsDeclaration<any>>(
        declarator: (vars: WheresToTypeVars<Wheres>) => Decl
    ) {
    }

    static create<N extends VarNames>(...ns: N) {
        const wheres = ns.reduce((acc, n) => {
            acc[n] = obj;
            return acc;
        }, {} as any) as FullWhereClauses<N[number]>;
        return new Generic(wheres, ns);
    }
}

Generic.create("A", "B").where({
    A: {
        extends: z.string(),
        const: true
    }
}).declare(vars => {
    let x = vars.A.parse("")
});

export class GenericDeclaration<
    Vars extends VarNames,
    Wheres extends WhereClauses<Vars[number]>,
    Decl extends ZsDeclaration<any>
> {
    constructor(private _def:) {
    }
}

class ZsTypeVar<
    Constraint extends ZodTypeAny,
    Default extends SchemaSubtypeOf<Constraint> | null,
    Name extends string
> extends ZsMonoType<
    TypeOf<Constraint>,
    ZsTypeVarDef<Constraint, Default, Name>
> {
    readonly declaration = "typeVar";
    _default!: Default;

    readonly actsLike = z.lazy(() => this._def.where.extends);
}

export type WheresToTypeVars<Wheres extends FullWhereClauses<string>> = {
    [K in keyof Wheres]: ZsTypeVar<Wheres[K]["extends"], Wheres[K]["default"], K & string>
};

export type ZsTypeVarAny = ZsTypeVar<
    ZodTypeAny,
    SchemaSubtypeOf<ZodTypeAny> | null
>;
export type ZsTypeVars = [ZsTypeVarAny, ...ZsTypeVarAny[]] | [];

export const $typeVar = ZsTypeVar.create;
