import { ZsTypeVar, ZsTypeVarsRecord } from "./type-var";
import { ZodAny, ZodTypeAny, ZodTypeDef } from "zod";
import { SchemaSubtypeOf } from "../utils";

import { ZsInstantiation } from "../expressions/instantiation";
import { ZsDeclaredType } from "../refs";
import { GenericBuilder } from "./generic-builder";
import { ZsNodeKind, ZsTypeCtorKind, ZsTypeKind } from "../kinds";

export interface ZsGenericDef<
    Vars extends ZsTypeVarsRecord,
    Instance extends ZodTypeAny
> extends ZodTypeDef {
    typeName: ZsTypeCtorKind.ZsGeneric;
    vars: Vars;
    instance: Instance;
    ordering: (keyof Vars)[];
}

export class ZsGenericType<
    Vars extends ZsTypeVarsRecord = ZsTypeVarsRecord,
    Instance extends ZsDeclaredType = ZsDeclaredType
> {
    constructor(readonly _def: ZsGenericDef<Vars, Instance>) {}

    instantiate<
        TypeArgs extends {
            [Name in keyof Vars as Vars[Name] extends ZsTypeVar<any, null>
                ? Name
                : never]: SchemaSubtypeOf<Vars[Name]["_def"]["extends"]>;
        } & {
            [Name in keyof Vars]?: SchemaSubtypeOf<
                Vars[Name]["_def"]["extends"]
            >;
        }
    >(args: TypeArgs): ZsInstantiation<Instance> {
        const typeArgs = this._def.ordering.map(name => args[name]);
        return new ZsInstantiation({
            typeArgs: typeArgs as any,
            instance: this._def.instance,
            typeName: ZsTypeKind.ZsInstantiation
        });
    }

    static create<Names extends string>(...names: [Names, ...Names[]]) {
        return new GenericBuilder(
            names,
            {} as Record<Names, ZsTypeVar<ZodAny, null>>
        );
    }
}
