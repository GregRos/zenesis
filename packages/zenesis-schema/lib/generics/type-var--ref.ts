import { ZodAny, ZodTypeAny, ZodTypeDef } from "zod"
import { ZsMonoType } from "../core/mono-type"
import { ZsTypeKind } from "../core/type-kind"

export interface ZsTypeVarRefDef<Name extends string> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsTypeVarRef
    name: Name
}

export class ZsTypeVarRef<Name extends string = string> extends ZsMonoType<
    any,
    ZsTypeVarRefDef<Name>
> {
    readonly actsLike = ZodAny.create()
    readonly name = this._def.name
    static create<Name extends string, Extends extends ZodTypeAny>(
        name: Name
    ): ZsTypeVarRef<Name> {
        return new ZsTypeVarRef({
            typeName: ZsTypeKind.ZsTypeVarRef,
            name
        })
    }
}

export type ZsTypeVarRefs = [ZsTypeVarRef, ...ZsTypeVarRef[]]
