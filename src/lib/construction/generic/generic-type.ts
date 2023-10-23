import { ZsTypeVar, ZsTypeVarsRecord } from "./type-var"
import { ZodAny, ZodTypeAny, ZodTypeDef } from "zod"
import { SchemaSubtypeOf } from "../utils"

import { ZsInstantiation, ZsTypeCtors } from "../expressions/instantiation"
import { GenericBuilder } from "./generic-builder"
import { ZsTypeKind } from "../kinds"
import { ZsInterface } from "../module-declarations/interface"
import { ZsClass } from "../module-declarations/class"
import { ZsTypeAlias } from "../module-declarations/alias"

export interface ZsGenericDef<
    Vars extends ZsTypeVarsRecord,
    Instance extends ZodTypeAny
> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsGenericType
    vars: Vars
    innerType: Instance
    ordering: (keyof Vars)[]
}

export type ZsGenericInterface<
    Vars extends ZsTypeVarsRecord = ZsTypeVarsRecord
> = ZsGenericType<Vars, ZsInterface>

export type ZsGenericClass<Vars extends ZsTypeVarsRecord = ZsTypeVarsRecord> =
    ZsGenericType<Vars, ZsClass>

export type ZsGenericTypeAlias<
    Vars extends ZsTypeVarsRecord = ZsTypeVarsRecord
> = ZsGenericType<Vars, ZsTypeAlias>

export class ZsGenericType<
    Vars extends ZsTypeVarsRecord = ZsTypeVarsRecord,
    Instance extends ZsTypeCtors = ZsTypeCtors
> {
    constructor(readonly _def: ZsGenericDef<Vars, Instance>) {}

    get declaration() {
        return this._def.innerType.declaration
    }

    get name() {
        return this._def.innerType.name
    }

    instantiate<
        TypeArgs extends {
            [Name in keyof Vars as Vars[Name] extends ZsTypeVar<any, null>
                ? Name
                : never]: SchemaSubtypeOf<Vars[Name]["_def"]["extends"]>
        } & {
            [Name in keyof Vars]?: SchemaSubtypeOf<
                Vars[Name]["_def"]["extends"]
            >
        }
    >(args: TypeArgs): ZsInstantiation<Instance> {
        const typeArgs = this._def.ordering.map(name => args[name])
        return new ZsInstantiation({
            typeArgs: typeArgs as any,
            instance: this._def.innerType,
            typeName: ZsTypeKind.ZsInstantiation
        })
    }

    static create<Names extends string>(...names: [Names, ...Names[]]) {
        return new GenericBuilder(
            names,
            {} as Record<Names, ZsTypeVar<ZodAny, null>>
        )
    }
}
